import StatusBadge from "../ui/StatusBadge.jsx";
import ProgressBar from "../ui/ProgressBar.jsx";
import Button from "../ui/Button.jsx";

export default function RowCard({ row, onRetry, onDownload }) {
  return (
    <div>
      <span>{row?.name}</span>
      <span>{row?.size}</span>
      <StatusBadge status={row?.status} />
      <ProgressBar value={row?.progress} />
      {row?.status === "done" && (
        <div>
          <img src={row.outputUrl} alt={row.name || "Output"} />
          <Button onClick={() => onDownload(row)}>Download</Button>
        </div>
      )}
      {row?.status === "failed" && (
        <div>
          <p role="alert">{row.error}</p>
          <Button onClick={() => onRetry(row.id)}>Retry</Button>
        </div>
      )}
    </div>
  );
}
