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
      />
    );
  } else if (field.type === "toggle") {
    input = (
      <input
        id={id}
        type="checkbox"
        checked={value}
        onChange={(event) => onChange(event.target.checked)}
      />
    );
  } else if (field.type === "select") {
    input = (
      <>
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
      </>
    );
  } else {
    return null;
  }

  return (
    <div>
      <label htmlFor={id}>
        {field.label}
        {field.required && " *"}
      </label>
      {input}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}