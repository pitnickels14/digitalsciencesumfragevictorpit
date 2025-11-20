import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "server", "data");
const STATS_FILE = path.join(DATA_DIR, "stats.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface Result {
  id: number;
  ts: number;
  winner: string;
  scores: Record<string, number>;
  payload?: any;
}

interface StatsData {
  results: Result[];
  nextId: number;
}

function loadStats(): StatsData {
  try {
    if (fs.existsSync(STATS_FILE)) {
      const content = fs.readFileSync(STATS_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (e) {
    console.error("Error loading stats:", e);
  }
  return { results: [], nextId: 1 };
}

function saveStats(data: StatsData) {
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving stats:", e);
    throw e;
  }
}

export function insertResult(
  ts: number,
  winner: string,
  scores: Record<string, number>,
  payload: any,
) {
  const data = loadStats();
  const id = data.nextId++;

  data.results.push({
    id,
    ts,
    winner,
    scores,
    payload,
  });

  saveStats(data);
  return id;
}

export function getCounts(): Record<string, number> {
  const data = loadStats();
  const counts: Record<string, number> = {};

  data.results.forEach((result) => {
    if (!counts[result.winner]) {
      counts[result.winner] = 0;
    }
    counts[result.winner]++;
  });

  return counts;
}

export function clearResults(): number {
  const data = loadStats();
  const count = data.results.length;
  const newData: StatsData = { results: [], nextId: data.nextId };
  saveStats(newData);
  return count;
}

export default {
  loadStats,
  saveStats,
};
