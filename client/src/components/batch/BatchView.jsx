import { useState } from "react";
import { usePolling } from "../../hooks/usePolling.js";
import { downloadRow, downloadAll } from "../../utils/download.js";
import SummaryStrip from "./SummaryStrip.jsx";
import RowCard from "./RowCard.jsx";
import Button from "../ui/Button.jsx";

export default function BatchView({ batchId }) {
  const { batch, error, retry } = usePolling(batchId);
  const [showFailedOnly, setShowFailedOnly] = useState(false);

  if (error?.status === 404) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="text-4xl">📦</div>
        <h3 className="text-xl font-semibold">Batch not found</h3>
        <p className="text-text-muted max-w-xs">The batch ID provided is invalid or has expired. Please try again.</p>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-text-muted animate-pulse">Loading batch status...</p>
        </div>
        {error && <p role="alert" className="mt-4 text-error text-sm font-medium">{error.message}</p>}
      </div>
    );
  }

  const rows = batch.rows || [];
  const counts = {
    done: rows.filter((row) => row.status === "done").length,
    failed: rows.filter((row) => row.status === "failed").length,
    running: rows.filter(
      (row) => row.status === "queued" || row.status === "processing"
    ).length,
  };

  const displayedRows = showFailedOnly
    ? rows.filter((row) => row.status === "failed")
    : rows;

  return (
    <div className="bg-surface border border-border rounded-card p-6 space-y-8">
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Batch Identifier</span>
          <h2 className="text-2xl tabular-nums">{batch.id}</h2>
        </div>
        <Button onClick={() => downloadAll(rows)} disabled={counts.done === 0} variant="primary">
          Download all results
        </Button>
      </header>

      <SummaryStrip
        counts={counts}
        showFailedOnly={showFailedOnly}
        onToggleFailedOnly={() => setShowFailedOnly(!showFailedOnly)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedRows.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-2">
            <p className="text-text-muted font-medium">No rows match the current filter</p>
            <Button variant="ghost" onClick={() => setShowFailedOnly(false)}>Show all rows</Button>
          </div>
        ) : (
          displayedRows.map((row) => (
            <RowCard
              key={row.id}
              row={row}
              onRetry={retry}
              onDownload={downloadRow}
            />
          ))
        )}
      </div>
    </div>
  );
}
