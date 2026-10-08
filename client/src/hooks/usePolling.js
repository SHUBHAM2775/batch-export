import { useState, useEffect } from "react";
import { getBatch, retryRow } from "../api.js";

export function usePolling(batchId) {
  const [batch, setBatch] = useState(null);
  const [error, setError] = useState(null);

  const isActive =
    Boolean(batchId) &&
    (!batch || batch.rows.some((row) => row.status === "queued" || row.status === "processing")) &&
    error?.status !== 404;

  useEffect(() => {
    if (!isActive) return;

    let timerId;
    let isCurrent = true;

    async function poll() {
      try {
        const nextBatch = await getBatch(batchId);
        if (!isCurrent) return;
        setError(null);
        setBatch(nextBatch);
        const hasPending = nextBatch.rows.some(
          (row) => row.status === "queued" || row.status === "processing"
        );
        if (hasPending) {
          timerId = setTimeout(poll, 3000);
        }
      } catch (err) {
        if (!isCurrent) return;
        setError(err);
        if (err.status !== 404) {
          timerId = setTimeout(poll, 3000);
        }
      }
    }

    poll();

    return () => {
      isCurrent = false;
      clearTimeout(timerId);
    };
  }, [batchId, isActive]);

  async function retry(rowId) {
    try {
      const updatedRow = await retryRow(batchId, rowId);
      setBatch((prev) => ({
        ...prev,
        rows: prev.rows.map((row) => (row.id === rowId ? updatedRow : row)),
      }));
    } catch (err) {
      setError(err);
    }
  }

  return { batch, error, retry };
}
