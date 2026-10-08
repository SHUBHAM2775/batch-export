import FieldRenderer from "./FieldRenderer.jsx";
import ImageUpload from "./ImageUpload.jsx";
import Button from "../ui/Button.jsx";
import { getDimensions } from "../../utils/aspect.js";

export default function RowItem({
  row,
  index,
  total,
  fields,
  itemLabel = "Item",
  canRemove,
  errors,
  onRemove,
  onMove,
  onUpdate,
}) {
  const fieldEntries = fields ? Object.entries(fields) : [];
  const sortedFields = [...fieldEntries].sort(
    ([, a], [, b]) => (a.order ?? 0) - (b.order ?? 0)
  );

  const dimensions = getDimensions(row?.values);

  return (
    <div className="bg-main border border-border rounded-ui overflow-hidden transition-all duration-200 hover:border-accent/40">
      <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-border">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-border text-text-muted text-[10px] font-bold">
            {index + 1}
          </span>
          <span className="text-xs font-bold text-text-main">
            {itemLabel} {index + 1}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button onClick={() => onMove(row.id, -1)} disabled={index === 0} variant="ghost" className="p-1.5" aria-label="Move up">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
          </Button>
          <Button onClick={() => onMove(row.id, 1)} disabled={index >= total - 1} variant="ghost" className="p-1.5" aria-label="Move down">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </Button>
          <Button onClick={() => onRemove(row.id)} disabled={!canRemove} variant="ghost" className="p-1.5 text-error hover:text-error" aria-label="Remove item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </Button>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-12 gap-6">
        <div className="sm:col-span-4 space-y-3">
          <ImageUpload
            dimensions={dimensions}
            value={row?.values?.file || row?.values?.image}
            onChange={(val) => {
              const fileField = sortedFields.find(([, f]) => f.type === "file")?.[0];
              if (fileField) onUpdate(row.id, fileField, val);
            }}
            error={errors?.file || errors?.image}
          />
        </div>
        <div className="sm:col-span-8 space-y-4">
          {sortedFields.map(([fieldName, fieldDef]) => {
            if (fieldDef.type === "file") return null;
            return (
              <FieldRenderer
                key={fieldName}
                id={`row-${row.id}-${fieldName}`}
                field={fieldDef}
                value={row?.values?.[fieldName]}
                onChange={(val) => onUpdate(row.id, fieldName, val)}
                error={errors?.[fieldName]}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
