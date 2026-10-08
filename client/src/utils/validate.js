function validateField(field, value) {
  if (
    field.required &&
    (value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "") ||
      (field.type === "toggle" && !value))
  ) {
    return `${field.label} is required`;
  }

  if (field.maxLength && typeof value === "string" && value.length > field.maxLength) {
    return `${field.label} must be at most ${field.maxLength} characters`;
  }

  return null;
}

export function validate(config, settings, rows) {
  const settingsErrors = {};
  if (config?.settings) {
    for (const [name, field] of Object.entries(config.settings)) {
      const error = validateField(field, settings?.[name]);
      if (error) {
        settingsErrors[name] = error;
      }
    }
  }

  const rowsErrors = {};
  if (config?.rows?.fields && rows) {
    for (const row of rows) {
      const rowFieldErrors = {};
      for (const [name, field] of Object.entries(config.rows.fields)) {
        const error = validateField(field, row.values?.[name]);
        if (error) {
          rowFieldErrors[name] = error;
        }
      }
      if (Object.keys(rowFieldErrors).length > 0) {
        rowsErrors[row.id] = rowFieldErrors;
      }
    }
  }

  let rowCount = null;
  const min = config?.rows?.min;
  const max = config?.rows?.max;
  const count = rows ? rows.length : 0;

  if (min !== undefined && count < min) {
    rowCount = `Must have at least ${min} items`;
  } else if (max !== undefined && count > max) {
    rowCount = `Must have at most ${max} items`;
  }

  return {
    settings: settingsErrors,
    rows: rowsErrors,
    rowCount,
  };
}
