import { useState } from "react";

const OTHER = "__other__";

export default function FieldRenderer({ id, field, value, onChange, error }) {
  const [otherSelected, setOtherSelected] = useState(false);

  const handleSelect = (event) => {
    const picked = event.target.value;
    if (picked === OTHER) {
      setOtherSelected(true);
      onChange("");
    } else {
      setOtherSelected(false);
      onChange(picked);
    }
  };

  let input;

  if (field.type === "text") {
    input = (
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  } else if (field.type === "textarea") {
    input = (
      <textarea
        id={id}
        value={value}
        maxLength={field.maxLength}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
      />
    );
  } else if (field.type === "toggle") {
    input = (
      <label className="flex items-center justify-between p-3 rounded-ui bg-main border border-border cursor-pointer group hover:border-accent/50 transition-all">
        <span className="text-sm font-medium text-text-main">{field.label}</span>
        <div className="relative inline-flex items-center">
          <input
            id={id}
            type="checkbox"
            checked={value}
            onChange={(event) => onChange(event.target.checked)}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-border rounded-full peer-checked:bg-accent transition-colors duration-200 relative">
            <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5" />
          </div>
        </div>
      </label>
    );
  } else if (field.type === "select") {
    input = (
      <div className="space-y-2">
        <select id={id} value={otherSelected ? OTHER : value} onChange={handleSelect}>
          <option value="">Select...</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          {field.allowOther && <option value={OTHER}>Other...</option>}
        </select>
        {field.allowOther && otherSelected && (
          <input
            type="text"
            value={value}
            placeholder="Type your own"
            onChange={(event) => onChange(event.target.value)}
          />
        )}
      </div>
    );
  } else {
    return null;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {field.type !== "toggle" && (
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-text-muted">
          {field.label}
          {field.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {input}
      {error && <p role="alert" className="text-error text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
}
