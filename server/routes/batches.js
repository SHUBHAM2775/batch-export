import { Router } from "express";
import { config } from "../config.js";
import { createBatch } from "../store.js";

const router = Router();

router.post("/", (req, res) => {
    const { settings, rows } = req.body;

    if(!settings || !Array.isArray(rows)){
        return res.status(400).json({ error : "settings and rows are required"});
    }

    const { min , max } = config.rows;
    if(rows.length < min || rows.length > max)
    {
        return res.status(400).json({ error : `rows must be between ${min} and ${max}`});
    }

    const batch = createBatch(settings, rows);
    res.status(201).json({ batchId : batch.id});
});

export default router;