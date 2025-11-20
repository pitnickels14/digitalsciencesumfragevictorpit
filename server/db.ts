import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    "DATABASE_URL not set. Stats will not be persisted. Set DATABASE_URL environment variable."
  );
}

let pool: pg.Pool | null = null;

function getPool() {
  if (!connectionString) return null;
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }
  return pool;
}

async function initDbIfNeeded() {
  const currentPool = getPool();
  if (!currentPool) return;

  try {
    const client = await currentPool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS results (
          id SERIAL PRIMARY KEY,
          ts BIGINT NOT NULL,
          winner VARCHAR(255) NOT NULL,
          scores JSONB NOT NULL,
          payload JSONB
        )
      `);
    } finally {
      client.release();
    }
  } catch (e) {
    console.error("Error initializing DB:", e);
  }
}

export async function insertResult(
  ts: number,
  winner: string,
  scores: Record<string, number>,
  payload: any
) {
  const currentPool = getPool();
  if (!currentPool) return null;

  try {
    await initDbIfNeeded();
    const result = await currentPool.query(
      "INSERT INTO results (ts, winner, scores, payload) VALUES ($1, $2, $3, $4) RETURNING id",
      [ts, winner, JSON.stringify(scores), JSON.stringify(payload)]
    );
    return result.rows[0].id;
  } catch (e) {
    console.error("Error inserting result:", e);
    return null;
  }
}

export async function getCounts(): Promise<Record<string, number>> {
  const currentPool = getPool();
  if (!currentPool) return {};

  try {
    await initDbIfNeeded();
    const result = await currentPool.query(
      "SELECT winner, COUNT(*) as cnt FROM results GROUP BY winner"
    );
    const counts: Record<string, number> = {};
    result.rows.forEach((r) => {
      counts[r.winner] = Number(r.cnt);
    });
    return counts;
  } catch (e) {
    console.error("Error getting counts:", e);
    return {};
  }
}

export async function clearResults(): Promise<number> {
  const currentPool = getPool();
  if (!currentPool) return 0;

  try {
    await initDbIfNeeded();
    const result = await currentPool.query("DELETE FROM results");
    return result.rowCount || 0;
  } catch (e) {
    console.error("Error clearing results:", e);
    return 0;
  }
}

export default {
  initDbIfNeeded,
};
