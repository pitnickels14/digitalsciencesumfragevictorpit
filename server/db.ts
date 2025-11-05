import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_DIR = path.join(process.cwd(), "server", "data");
const DB_FILE = path.join(DB_DIR, "popmatch.db");

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_FILE);

// Initialize table
db.exec(`
  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts INTEGER NOT NULL,
    winner TEXT NOT NULL,
    scores TEXT NOT NULL,
    payload TEXT
  )
`);

export function insertResult(ts: number, winner: string, scores: Record<string, number>, payload: any) {
  const stmt = db.prepare("INSERT INTO results (ts, winner, scores, payload) VALUES (?, ?, ?, ?)");
  const info = stmt.run(ts, winner, JSON.stringify(scores), JSON.stringify(payload));
  return info.lastInsertRowid;
}

export function getCounts() {
  const stmt = db.prepare("SELECT winner, COUNT(*) as cnt FROM results GROUP BY winner");
  const rows = stmt.all();
  const counts: Record<string, number> = {};
  rows.forEach((r: any) => {
    counts[r.winner] = r.cnt;
  });
  return counts;
}

export function clearResults() {
  const stmt = db.prepare("DELETE FROM results");
  const info = stmt.run();
  return info.changes;
}

export default db;
