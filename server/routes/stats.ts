import { RequestHandler } from "express";
import { insertResult, getCounts, clearResults } from "../db";

export const handleGetStats: RequestHandler = async (_req, res) => {
  try {
    const counts = await getCounts();
    res.status(200).json({ counts });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to read stats" });
  }
};

export const handlePostResult: RequestHandler = async (req, res) => {
  try {
    const { ts, winner, scores, payload } = req.body as any;
    if (!winner || !ts)
      return res.status(400).json({ error: "Missing fields" });
    const id = await insertResult(
      Number(ts),
      String(winner),
      scores ?? {},
      payload ?? null,
    );
    res.status(201).json({ id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to save result" });
  }
};

export const handleDeleteStats: RequestHandler = async (_req, res) => {
  try {
    const changes = await clearResults();
    res.status(200).json({ deleted: changes });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to clear stats" });
  }
};
