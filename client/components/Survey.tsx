import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Stats from "@/components/Stats";
import { ARTIST_INFO, type ArtistKey } from "@/data/artists";

interface Option {
  label: string;
  weights: Partial<Record<ArtistKey, number>>;
}

interface Question {
  id: string;
  prompt: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: "mood",
    prompt: "Welche Stimmung hörst du am liebsten?",
    options: [
      { label: "Episch & euphorisch", weights: { taylor: 2, weeknd: 1 } },
      {
        label: "Melancholisch & erwachsen",
        weights: { sabrina: 2, taylor: 1 },
      },
      { label: "Düster & intim", weights: { billie: 2 } },
      { label: "Nachtfahrt & Club-Vibes", weights: { weeknd: 2, billie: 1 } },
    ],
  },
  {
    id: "lyrics",
    prompt: "Welche Lyrics sprechen dich an?",
    options: [
      { label: "Wortgewandt & clever", weights: { taylor: 2 } },
      { label: "Direkt & persönlich", weights: { sabrina: 2 } },
      { label: "Minimalistisch & poetisch", weights: { billie: 2 } },
      { label: "Mysteriös & verführerisch", weights: { weeknd: 2 } },
    ],
  },
  {
    id: "sound",
    prompt: "Welchen Sound bevorzugst du?",
    options: [
      { label: "Pop mit großem Refrain", weights: { taylor: 2 } },
      { label: "Polierter Pop & erwachsene Themen", weights: { sabrina: 2, taylor: 1 } },
      { label: "Elektronisch & experimentell", weights: { billie: 2 } },
      { label: "Synthwave & R&B", weights: { weeknd: 2 } },
    ],
  },
];

export default function Survey() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array.from({ length: QUESTIONS.length }, () => null),
  );
  const [result, setResult] = useState<ArtistKey | null>(null);
  const [showStats, setShowStats] = useState(false);

  const allAnswered = useMemo(
    () => answers.every((a) => a !== null),
    [answers],
  );

  const handleSelect = (qIdx: number, optIdx: number) => {
    const next = [...answers];
    next[qIdx] = optIdx;
    setAnswers(next);
  };

  const compute = () => {
    const scores: Record<ArtistKey, number> = {
      taylor: 0,
      sabrina: 0,
      billie: 0,
      weeknd: 0,
    };

    answers.forEach((optIdx, qIdx) => {
      if (optIdx === null) return;
      const opt = QUESTIONS[qIdx].options[optIdx];
      Object.entries(opt.weights).forEach(([k, v]) => {
        scores[k as ArtistKey] += v ?? 0;
      });
    });

    const winner = (Object.keys(scores) as ArtistKey[]).reduce((a, b) =>
      scores[a] >= scores[b] ? a : b,
    );

    try {
      const payload = {
        ts: Date.now(),
        answers: answers.map((a, i) => ({ q: QUESTIONS[i].id, a })),
        scores,
        winner,
      };
      const prevRaw = localStorage.getItem("popmatch_survey");
      const prev = prevRaw ? JSON.parse(prevRaw) : [];
      prev.push(payload);
      localStorage.setItem("popmatch_survey", JSON.stringify(prev));
    } catch {}

    setResult(winner);
  };

  const reset = () => {
    setAnswers(Array.from({ length: QUESTIONS.length }, () => null));
    setResult(null);
    setShowStats(false);
  };

  if (result) {
    const info = ARTIST_INFO[result];
    return (
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 text-white shadow-[0_0_40px_rgba(255,255,255,0.08)]">
          <p className="uppercase tracking-widest text-xs md:text-sm text-white/60 mb-2">
            Deine Empfehlung
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            {info.name}
          </h2>
          <p className="text-white/85 mb-6 md:mb-8 leading-relaxed">
            {info.desc}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="brand" size="lg" onClick={reset}>
              Erneut versuchen
            </Button>
            <Button
              variant="brand"
              size="lg"
              onClick={() => setShowStats((s) => !s)}
            >
              Statistiken ansehen
            </Button>
          </div>
        </div>

        {showStats && (
          <div className="mt-6 w-full max-w-2xl mx-auto">
            <div className="rounded-2xl bg-white/4 p-5 border border-white/8">
              <Stats />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 text-white shadow-[0_0_40px_rgba(255,255,255,0.08)]">
        <div className="mb-6 md:mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Welcher Pop-Act passt zu dir?
          </h2>
          <p className="text-white/70 mt-2">
            Beantworte 3 Fragen und erhalte eine persönliche Empfehlung.
          </p>
        </div>

        <ol className="space-y-6 md:space-y-8">
          {QUESTIONS.map((q, qIdx) => (
            <li key={q.id}>
              <h3 className="font-semibold mb-3 md:mb-4 text-lg md:text-xl">
                {qIdx + 1}. {q.prompt}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {q.options.map((opt, optIdx) => {
                  const selected = answers[qIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      className={cn(
                        "group relative w-full rounded-xl border border-white/10 px-4 py-3 md:px-5 md:py-4 text-left transition-all",
                        "bg-white/0 hover:bg-white/5 focus-visible:outline-none",
                        "text-white/90 hover:text-white",
                        selected &&
                          "bg-white/10 border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.12)]",
                      )}
                    >
                      <span className="absolute inset-0 rounded-xl ring-0 group-hover:ring-1 ring-white/30 transition" />
                      <span className="relative z-10">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 md:mt-8 text-center">
          <Button
            variant="brand"
            size="lg"
            className="min-w-48"
            disabled={!allAnswered}
            onClick={compute}
          >
            Empfehlung anzeigen
          </Button>
        </div>
      </div>
    </div>
  );
}
