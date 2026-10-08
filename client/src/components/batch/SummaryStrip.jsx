export default function SummaryStrip({
  counts,
  showFailedOnly,
  onToggleFailedOnly,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 p-4 bg-main border border-border rounded-ui">
      <div className="flex items-center gap-8">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Done</span>
          <span className="text-lg font-bold tabular-nums text-success">{counts?.done ?? 0}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Failed</span>
          <span className="text-lg font-bold tabular-nums text-error">{counts?.failed ?? 0}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Running</span>
          <span className="text-lg font-bold tabular-nums text-accent">{counts?.running ?? 0}</span>
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={showFailedOnly}
            onChange={onToggleFailedOnly}
          />
          <div className={`
            w-9 h-5 rounded-full transition-colors duration-200
            ${showFailedOnly ? "bg-accent" : "bg-border"}
          `} />
          <div className={`
            absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200
            ${showFailedOnly ? "translate-x-4" : "translate-x-0"}
          `} />
        </div>
        <span className="text-xs font-medium text-text-muted group-hover:text-text-main transition-colors">
          Show failed only
        </span>
      </label>
    </div>
  );
}
