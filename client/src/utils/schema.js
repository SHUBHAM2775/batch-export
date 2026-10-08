export function getDefaults(fieldsSchema) {
  if (!fieldsSchema) return {};
  const defaults = {};
  for (const [name, field] of Object.entries(fieldsSchema)) {
    if (field.default !== undefined) {
      defaults[name] = field.default;
    } else if (field.type === "toggle") {
      defaults[name] = false;
    } else if (field.type === "file") {
      defaults[name] = null;
    } else {
      defaults[name] = "";
    }
  }
  return defaults;
}

export function groupFields(fieldsSchema) {
  if (!fieldsSchema) return [];
  const sorted = Object.entries(fieldsSchema).sort(
    ([, a], [, b]) => (a.order ?? 0) - (b.order ?? 0)
  );
  const groups = [];
  const groupMap = new Map();

  for (const [name, field] of sorted) {
    const group = field.group || "general";
    if (!groupMap.has(group)) {
      const groupObj = { group, fields: [] };
      groupMap.set(group, groupObj);
      groups.push(groupObj);
    }
    groupMap.get(group).fields.push([name, field]);
  }

  return groups;
}

export function createEmptyRow(rowsSchema) {
  return {
    id: crypto.randomUUID(),
    values: getDefaults(rowsSchema?.fields),
  };
}

export function toPayload(settings, rows, rowsSchema) {
  const fileKeys = new Set(
    rowsSchema?.fields
      ? Object.entries(rowsSchema.fields)
          .filter(([, field]) => field.type === "file")
          .map(([name]) => name)
      : []
  );

  return {
    settings,
    rows: (rows || []).map((row) => {
      const rowData = {};
      for (const [key, val] of Object.entries(row.values || {})) {
        if (!fileKeys.has(key)) {
          rowData[key] = val;
        }
      }
      return rowData;
    }),
  };
}
