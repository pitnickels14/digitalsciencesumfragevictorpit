import { useEffect, useMemo, useState } from "react";
import { ARTIST_INFO, type ArtistKey } from "@/data/artists";

export default function Stats({ className }: { className?: string }) {
  const [data, setData] = useState<Record<ArtistKey, number> | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        // Try Supabase first
        const supa = await import("@/lib/supabase").catch(() => null);
        if (supa && typeof supa.getCountsSupabase === "function") {
          const resp = await supa.getCountsSupabase();
          if (resp) {
            // resp might be an array of { winner, cnt }
            const normalized: Record<ArtistKey, number> = {
              taylor: 0,
              sabrina: 0,
              billie: 0,
              weeknd: 0,
            };
            if (Array.isArray(resp)) {
              resp.forEach((r: any) => {
                if (r.winner && normalized[r.winner] !== undefined) normalized[r.winner] = Number(r.cnt ?? r.count ?? 0);
              });
            } else if (typeof resp === 'object') {
              Object.entries(resp).forEach(([k, v]) => {
                if ((normalized as any)[k] !== undefined) (normalized as any)[k] = Number(v ?? 0);
              });
            }
            if (mounted) setData(normalized);
            return;
          }
        }

        // Fallback to API
        const res = await fetch("/api/stats");
        if (!res.ok) throw new Error("failed");
        const json = await res.json();
        const counts = json.counts ?? {};
        const normalized: Record<ArtistKey, number> = {
          taylor: counts.taylor ?? 0,
          sabrina: counts.sabrina ?? 0,
          billie: counts.billie ?? 0,
          weeknd: counts.weeknd ?? 0,
        };
        if (mounted) setData(normalized);
      } catch (e) {
        if (mounted) setData({ taylor: 0, sabrina: 0, billie: 0, weeknd: 0 });
      }
    };
    fetchStats();
    return () => {
      mounted = false;
    };
  }, []);

  const total = useMemo(() => {
    if (!data) return 0;
    return Object.values(data).reduce((a, b) => a + b, 0);
  }, [data]);

  if (!data) return null;

  const max = Math.max(...Object.values(data), 1);

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4">Statistiken</h3>
      <p className="text-sm text-white/70 mb-4">Gesamtteilnahmen: {total}</p>

      <div className="space-y-3">
        {(Object.keys(ARTIST_INFO) as ArtistKey[]).map((k) => {
          const count = data[k] ?? 0;
          const pct = Math.round((count / Math.max(total, 1)) * 100);
          const width = Math.round((count / max) * 100);
          return (
            <div key={k} className="flex items-center gap-4">
              <div className="w-36 text-sm text-white/90">
                {ARTIST_INFO[k].name}
              </div>
              <div className="flex-1 bg-white/5 rounded-full h-6 overflow-hidden">
                <div
                  className="h-6 bg-white/20 rounded-full transition-all"
                  style={{
                    width: `${width}%`,
                    boxShadow: "0 6px 24px rgba(255,255,255,0.06)",
                  }}
                />
              </div>
              <div className="w-16 text-right text-sm text-white/80">
                {count} ({pct}%)
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 text-right">
        <button
          className="text-xs text-white/70 underline"
          onClick={async () => {
            try {
              const supa = await import('@/lib/supabase').catch(() => null);
              if (supa && typeof supa.clearResultsSupabase === 'function') {
                await supa.clearResultsSupabase();
              } else {
                await fetch('/api/stats', { method: 'DELETE' });
              }
            } catch {}
            setData({ taylor: 0, sabrina: 0, billie: 0, weeknd: 0 });
          }}
        >
          Statistiken zurücksetzen
        </button>
      </div>
    </div>
  );
}
