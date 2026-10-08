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
    return <p>Batch not found</p>;
  }

  if (!batch) {
    return (
      <div>
        {error && <p role="alert">{error.message}</p>}
        <p>Loading...</p>
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
    <div>
      <h2>{batch.id}</h2>
      {error && <p role="alert">{error.message}</p>}
      <SummaryStrip
        counts={counts}
        showFailedOnly={showFailedOnly}
        onToggleFailedOnly={() => setShowFailedOnly(!showFailedOnly)}
      />
      <Button onClick={() => downloadAll(rows)} disabled={counts.done === 0}>
        Download all
      </Button>
      <div>
        {displayedRows.length === 0 ? (
          <p>No rows found</p>
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
