import RowItem from "./RowItem.jsx";
import Button from "../ui/Button.jsx";

export default function RowRepeater({
  schema,
  rows,
  errors,
  onAdd,
  onRemove,
  onMove,
  onUpdate,
}) {
  const min = schema?.min ?? 0;
  const max = schema?.max ?? Infinity;
  const rowList = rows || [];
  const canRemove = rowList.length > min;
  const isMaxReached = rowList.length >= max;

  return (
    <section>
      <h2>{schema?.label}</h2>
      <p>
        {min}–{max} items
      </p>
      <div>
        {rowList.map((row, index) => (
          <RowItem
            key={row?.id ?? index}
            row={row}
            index={index}
            total={rowList.length}
            fields={schema?.fields}
            errors={errors?.[index] || errors?.[row?.id]}
            onRemove={onRemove}
            onMove={onMove}
            onUpdate={onUpdate}
            canRemove={canRemove}
            itemLabel={schema?.itemLabel}
          />
        ))}
      </div>
      <Button onClick={onAdd} disabled={isMaxReached}>
        Add {schema?.itemLabel}
      </Button>
    </section>
  );
}
