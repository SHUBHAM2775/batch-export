import express from "express";
import cors from "cors";
import { config } from "./config.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/config", (req,res) => {
    res.json(config);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
