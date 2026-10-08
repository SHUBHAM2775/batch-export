import FieldRenderer from "./FieldRenderer.jsx";
import ImageUpload from "./ImageUpload.jsx";
import Button from "../ui/Button.jsx";

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

  return (
    <div>
      <span>
        {itemLabel} {index + 1}
      </span>
      {sortedFields.map(([fieldName, fieldDef]) => {
        if (fieldDef.type === "file") {
          return (
            <ImageUpload
              key={fieldName}
              value={row?.values?.[fieldName]}
              onChange={(val) => onUpdate(row.id, fieldName, val)}
              error={errors?.[fieldName]}
            />
          );
        }

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
      <Button onClick={() => onRemove(row.id)} disabled={!canRemove}>
        Remove
      </Button>
      <Button onClick={() => onMove(row.id, -1)} disabled={index === 0}>
        Move up
      </Button>
      <Button
        onClick={() => onMove(row.id, 1)}
        disabled={index >= total - 1}
      >
        Move down
      </Button>
    </div>
  );
}
