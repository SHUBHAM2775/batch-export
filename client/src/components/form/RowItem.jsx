import FieldRenderer from "../FieldRenderer.jsx";
import ImageUpload from "./ImageUpload.jsx";
import Button from "../ui/Button.jsx";

export default function RowItem({
  row,
  index,
  total,
  fields,
  errors,
  onRemove,
  onMove,
  onUpdate,
  canRemove,
  itemLabel = "Item",
}) {
  return (
    <div>
      <span>
        {itemLabel} {index + 1}
      </span>
      <ImageUpload
        value={row?.image}
        onChange={(file) => onUpdate(index, "image", file)}
        error={errors?.image}
      />
      {fields?.name && (
        <FieldRenderer
          id={`row-${index}-name`}
          field={fields.name}
          value={row?.name}
          onChange={(val) => onUpdate(index, "name", val)}
          error={errors?.name}
        />
      )}
      {fields?.size && (
        <FieldRenderer
          id={`row-${index}-size`}
          field={fields.size}
          value={row?.size}
          onChange={(val) => onUpdate(index, "size", val)}
          error={errors?.size}
        />
      )}
      <Button onClick={() => onRemove(index)} disabled={!canRemove}>
        Remove
      </Button>
      <Button onClick={() => onMove(index, index - 1)} disabled={index === 0}>
        Move up
      </Button>
      <Button
        onClick={() => onMove(index, index + 1)}
        disabled={index >= total - 1}
      >
        Move down
      </Button>
    </div>
  );
}
