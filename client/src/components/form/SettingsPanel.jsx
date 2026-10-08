import FieldRenderer from "./FieldRenderer.jsx";
import { groupFields } from "../../utils/schema.js";

export default function SettingsPanel({ schema, values, errors, onChange }) {
  const groups = groupFields(schema);

  return (
    <div>
      {groups.map(({ group, fields }) => (
        <section key={group}>
          <h2>{group}</h2>
          {fields.map(([name, field]) => (
            <FieldRenderer
              key={name}
              id={`settings-${name}`}
              field={field}
              value={values?.[name]}
              onChange={(newValue) => onChange(name, newValue)}
              error={errors?.[name]}
            />
          ))}
        </section>
      ))}
    </div>
  );
}
