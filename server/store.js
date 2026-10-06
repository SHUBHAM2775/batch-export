import { randomUUID } from "node:crypto";
const batches = new Map();

export function createBatch(settings, rows) {
    const batch = {
        id : randomUUID(), 
        settings, 
        rows : rows.map((row) => ({ 
            id : randomUUID(),
            name : row.name, 
            size : row.size, 
            status : "queued",
            progress : 0, 
            outputUrl : null, 
            error : null,
         })),
    };

    batches.set(batch.id, batch);
    return batch;
}

export function getBatch(batchId) {
   return batches.get(batchId) ?? null;
}   