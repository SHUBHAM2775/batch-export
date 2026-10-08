import FieldRenderer from "../FieldRenderer.jsx";

export default function SettingsPanel({ schema, values, errors, onChange }) {
  const fields = schema ? Object.entries(schema) : [];

  const groups = fields.reduce((acc, [fieldName, fieldDef]) => {
    const groupName = fieldDef.group || "default";
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push({ fieldName, fieldDef });
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(groups).map(([groupName, groupFields]) => {
        const sortedFields = [...groupFields].sort(
          (a, b) => (a.fieldDef.order ?? 0) - (b.fieldDef.order ?? 0)
        );

        return (
          <section key={groupName}>
            <h2>{groupName}</h2>
            {sortedFields.map(({ fieldName, fieldDef }) => (
              <FieldRenderer
                key={fieldName}
                id={fieldName}
                field={fieldDef}
                value={values?.[fieldName]}
                onChange={(newValue) => onChange(fieldName, newValue)}
                error={errors?.[fieldName]}
              />
            ))}
          </section>
        );
      })}
    </div>
  );
}
