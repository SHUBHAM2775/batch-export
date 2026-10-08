import RowItem from "./RowItem.jsx";
import Button from "../ui/Button.jsx";

export default function RowRepeater({
  schema,
  rows,
  errors,
  error,
  onAdd,
  onRemove,
  onMove,
  onUpdate,
}) {
  const min = schema?.min ?? 0;
  const max = schema?.max ?? Infinity;
  const rowList = rows || [];
  const canRemove = rowList.length > min;
  const canAdd = rowList.length < max;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3">
        {rowList.map((row, index) => (
          <RowItem
            key={row.id}
            row={row}
            index={index}
            total={rowList.length}
            fields={schema?.fields}
            itemLabel={schema?.itemLabel}
            canRemove={canRemove}
            errors={errors?.[row.id]}
            onRemove={onRemove}
            onMove={onMove}
            onUpdate={onUpdate}
          />
        ))}
      </div>

      <div className="space-y-3">
        <Button
          onClick={onAdd}
          disabled={!canAdd}
          variant="outline"
          className="w-full py-3 border-dashed border-2 text-text-muted hover:text-text-main hover:border-accent"
        >
          + Add {schema?.itemLabel}
        </Button>
        {error && <p role="alert" className="text-error text-sm font-medium text-center">{error}</p>}
      </div>
    </div>
  );
}
