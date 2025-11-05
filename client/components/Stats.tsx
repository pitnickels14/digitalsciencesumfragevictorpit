import { useEffect, useMemo, useState } from "react";
import { ARTIST_INFO, type ArtistKey } from "@/data/artists";

export default function Stats({ className }: { className?: string }) {
  const [data, setData] = useState<Record<ArtistKey, number> | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("popmatch_survey");
    if (!raw) {
      setData({ taylor: 0, olivia: 0, billie: 0, weeknd: 0 });
      return;
    }
    try {
      const arr = JSON.parse(raw) as any[];
      const counts: Record<ArtistKey, number> = {
        taylor: 0,
        olivia: 0,
        billie: 0,
        weeknd: 0,
      };
      arr.forEach((entry) => {
        const w = entry.winner as ArtistKey | undefined;
        if (w && counts[w] !== undefined) counts[w] += 1;
      });
      setData(counts);
    } catch (e) {
      setData({ taylor: 0, olivia: 0, billie: 0, weeknd: 0 });
    }
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
          onClick={() => {
            localStorage.removeItem("popmatch_survey");
            setData({ taylor: 0, olivia: 0, billie: 0, weeknd: 0 });
          }}
        >
          Statistiken zurücksetzen
        </button>
      </div>
    </div>
  );
}
