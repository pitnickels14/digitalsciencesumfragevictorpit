import type { PostgrestRpcError } from '@supabase/supabase-js';

let supabase: any = null;

function init() {
  if (supabase) return supabase;
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  // Lazy import to avoid bundling when not configured
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createClient } = require('@supabase/supabase-js');
  supabase = createClient(url, key);
  return supabase;
}

export async function insertResultSupabase(payload: any) {
  const s = init();
  if (!s) return null;
  try {
    const { data, error } = await s.from('results').insert([payload]);
    if (error) throw error;
    return data;
  } catch (e) {
    console.error('Supabase insert error', e);
    return null;
  }
}

export async function getCountsSupabase() {
  const s = init();
  if (!s) return null;
  try {
    // Fetch winners and aggregate client-side
    const { data, error } = await s.from('results').select('winner');
    if (error) throw error;
    const counts: Record<string, number> = {};
    (data || []).forEach((row: any) => {
      const w = row.winner;
      if (!w) return;
      counts[w] = (counts[w] || 0) + 1;
    });
    return counts;
  } catch (e) {
    console.error('Supabase counts error', e);
    return null;
  }
}

export async function clearResultsSupabase() {
  const s = init();
  if (!s) return null;
  try {
    const { error } = await s.from('results').delete().neq('id', -1);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Supabase clear error', e);
    return false;
  }
}
