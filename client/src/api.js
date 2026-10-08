const BASE_URL = import.meta.env.VITE_API_URL ?? "";

async function request(path,options = {}) {
    const response = await fetch(`${BASE_URL}/api${path}`, {
        headers : { "Content-Type" : "application/json" },
        ...options,
    });

    const data = await response.json().catch(() => null);

    if(!response.ok)
    {
        const error = new Error(data?.error ?? "Request failed");
        error.status = response.status;
        throw error;
    }

    return data;
}

export const getConfig = () => request("/config");

export const createBatch = (settings, rows) =>
    request("/batches", {
        method: "POST",
        body: JSON.stringify({ settings, rows }),
    });

export const getBatch = (batchId) => request(`/batches/${batchId}`);

export const retryRow = (batchId, rowId) =>
    request(`/batches/${batchId}/rows/${rowId}/retry`, {method : "POST"});