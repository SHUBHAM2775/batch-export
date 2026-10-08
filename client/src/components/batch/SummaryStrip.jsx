export default function SummaryStrip({
  counts,
  showFailedOnly,
  onToggleFailedOnly,
}) {
  return (
    <div>
      <div>
        <span>Done</span>
        <span>{counts?.done ?? 0}</span>
      </div>
      <div>
        <span>Failed</span>
        <span>{counts?.failed ?? 0}</span>
      </div>
      <div>
        <span>Running</span>
        <span>{counts?.running ?? 0}</span>
      </div>
      <label>
        <input
          type="checkbox"
          checked={showFailedOnly}
          onChange={onToggleFailedOnly}
        />
        Show only failed
      </label>
    </div>
  );
}
