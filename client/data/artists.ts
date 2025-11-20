export type ArtistKey = "taylor" | "sabrina" | "billie" | "laufey";

export const ARTIST_INFO: Record<ArtistKey, { name: string; desc: string }> = {
  taylor: {
    name: "Taylor Swift",
    desc: "Meisterin der Geschichten: kluge Lyrics, große Emotionen und eingängige Refrains.",
  },
  sabrina: {
    name: "Sabrina Carpenter",
    desc: "Polierte Pop-Performer: eingängige Melodien, reife Themen und starke Vocals.",
  },
  billie: {
    name: "Billie Eilish",
    desc: "Atmosphärisch, intim und experimentell – für alle, die es düster und subtil lieben.",
  },
  laufey: {
    name: "Laufey",
    desc: "Orchestrale Pop-Experimente mit klassischen Einflüssen – elegant, emotiv und innovativ.",
  },
};
