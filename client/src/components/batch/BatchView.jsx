import SummaryStrip from "./SummaryStrip.jsx";
import RowCard from "./RowCard.jsx";
import Button from "../ui/Button.jsx";

export default function BatchView({
  batch,
  showFailedOnly,
  onToggleFailedOnly,
  onRetry,
  onDownloadAll,
  onDownload,
}) {
  const rows = batch?.rows || [];
  const displayedRows = showFailedOnly
    ? rows.filter((row) => row.status === "failed")
    : rows;

  return (
    <div>
      <h2>{batch?.id}</h2>
      <SummaryStrip
        counts={batch?.counts}
        showFailedOnly={showFailedOnly}
        onToggleFailedOnly={onToggleFailedOnly}
      />
      <Button onClick={onDownloadAll}>Download all</Button>
      <div>
        {displayedRows.length === 0 ? (
          <p>No rows found</p>
        ) : (
          displayedRows.map((row) => (
            <RowCard
              key={row.id}
              row={row}
              onRetry={onRetry}
              onDownload={onDownload}
            />
          ))
        )}
      </div>
    </div>
  );
}
