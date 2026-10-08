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
    <section>
      <h2>{schema?.label}</h2>
      <p>
        {min}–{max} items
      </p>
      <div>
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
      <Button onClick={onAdd} disabled={!canAdd}>
        Add {schema?.itemLabel}
      </Button>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
