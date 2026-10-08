import StatusBadge from "../ui/StatusBadge.jsx";
import ProgressBar from "../ui/ProgressBar.jsx";
import Button from "../ui/Button.jsx";
import { getDimensions, getRatioLabel } from "../../utils/aspect.js";

export default function RowCard({ row, onRetry, onDownload }) {
  const dimensions = getDimensions({ size: row?.size });

  return (
    <div className="bg-main border border-border rounded-ui overflow-hidden flex flex-col transition-all duration-200 hover:border-accent/40">
      <div className="aspect-square w-full bg-surface relative flex items-center justify-center border-b border-border overflow-hidden">
        <div
          className={`
            relative transition-all duration-300 ease-in-out
            ${'motion-reduce:transition-none'}
            ${row?.outputUrl ? 'shadow-sm' : 'border-2 border-dashed border-border'}
          `}
          style={{
            aspectRatio: dimensions ? `${dimensions.width}/${dimensions.height}` : '1/1',
            width: '100%',
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain'
          }}
        >
          {row?.outputUrl ? (
            <img src={row.outputUrl} alt={row.name || "Output"} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.5-3.5L9 21l-7-7 7-7"/></svg>
            </div>
          )}
        </div>

        {dimensions && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-sm bg-surface/80 backdrop-blur-sm border border-border">
            <span className="text-[9px] font-medium text-text-muted tabular-nums">
              {dimensions.width} × {dimensions.height} · {getRatioLabel(dimensions.width, dimensions.height)}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4 flex-1 flex flex-col">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <span className="font-bold truncate text-text-main text-sm" title={row?.name}>
              {row?.name || "Unnamed Image"}
            </span>
            <StatusBadge status={row?.status} />
          </div>
          <span className="text-[10px] text-text-muted tabular-nums">
            {row?.size || "Unknown size"}
          </span>
        </div>

        <div className="space-y-1">
          <ProgressBar value={row?.progress} />
        </div>

        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
          {row?.status === "done" && (
            <Button onClick={() => onDownload(row)} variant="secondary" className="w-full text-xs py-1.5">
              Download
            </Button>
          )}

          {row?.status === "failed" && (
            <div className="flex flex-col gap-2 w-full">
              <p role="alert" className="text-[10px] text-error font-medium line-clamp-1 italic">
                {row.error}
              </p>
              <Button onClick={() => onRetry(row.id)} variant="secondary" className="w-full text-xs py-1.5">
                Retry Row
              </Button>
            </div>
          )}

          {row?.status !== "done" && row?.status !== "failed" && (
            <span className="text-[10px] text-text-muted italic text-center w-full">
              Processing...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
