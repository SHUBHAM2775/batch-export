import FieldRenderer from "./FieldRenderer.jsx";
import { groupFields } from "../../utils/schema.js";

export default function SettingsPanel({ schema, values, errors, onChange }) {
  const groups = groupFields(schema);

  return (
    <div className="space-y-8">
      {groups.map(({ group, fields }) => (
        <section key={group} className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">
              {group}
            </span>
            <div className="h-px bg-border w-full" />
          </div>
          <div className="space-y-4">
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
          </div>
        </section>
      ))}
    </div>
  );
}
