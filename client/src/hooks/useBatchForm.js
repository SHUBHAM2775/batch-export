import { useState } from "react";
import { getDefaults, createEmptyRow, toPayload } from "../utils/schema.js";
import { validate } from "../utils/validate.js";
import { createBatch } from "../api.js";

export { toPayload };

export function useBatchForm(config, onSubmitted) {
  const [settings, setSettings] = useState(() =>
    getDefaults(config?.settings)
  );

  const [rows, setRows] = useState(() => {
    const minRows = config?.rows?.min ?? 0;
    return Array.from({ length: minRows }, () =>
      createEmptyRow(config?.rows)
    );
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const errors = submitted
    ? validate(config, settings, rows)
    : { settings: {}, rows: {}, rowCount: null };

  const updateSetting = (name, value) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addRow = () => {
    const maxRows = config?.rows?.max ?? Infinity;
    setRows((prevRows) => {
      if (prevRows.length >= maxRows) return prevRows;
      return [...prevRows, createEmptyRow(config?.rows)];
    });
  };

  const removeRow = (rowId) => {
    const minRows = config?.rows?.min ?? 0;
    setRows((prevRows) => {
      if (prevRows.length <= minRows) return prevRows;
      return prevRows.filter((row) => row.id !== rowId);
    });
  };

  const moveRow = (rowId, direction) => {
    setRows((prevRows) => {
      const index = prevRows.findIndex((row) => row.id === rowId);
      if (index === -1) return prevRows;
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prevRows.length) return prevRows;
      const newRows = [...prevRows];
      const temp = newRows[index];
      newRows[index] = newRows[targetIndex];
      newRows[targetIndex] = temp;
      return newRows;
    });
  };

  const updateRow = (rowId, fieldName, value) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              values: {
                ...row.values,
                [fieldName]: value,
              },
            }
          : row
      )
    );
  };

  const submit = async () => {
    setSubmitted(true);
    setSubmitError(null);
    const validationErrors = validate(config, settings, rows);
    const hasErrors =
      Object.keys(validationErrors.settings).length > 0 ||
      Object.keys(validationErrors.rows).length > 0 ||
      validationErrors.rowCount !== null;

    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = toPayload(settings, rows, config?.rows);
      const res = await createBatch(payload.settings, payload.rows);
      onSubmitted?.(res.batchId);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    settings,
    rows,
    updateSetting,
    addRow,
    removeRow,
    moveRow,
    updateRow,
    errors,
    isSubmitting,
    submitError,
    submit,
  };
}
