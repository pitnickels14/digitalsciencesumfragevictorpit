export type ArtistKey = "taylor" | "olivia" | "billie" | "weeknd";

export const ARTIST_INFO: Record<ArtistKey, { name: string; desc: string }> = {
  taylor: {
    name: "Taylor Swift",
    desc: "Meisterin der Geschichten: kluge Lyrics, große Emotionen und eingängige Refrains.",
  },
  olivia: {
    name: "Olivia Rodrigo",
    desc: "Roh, ehrlich und energiegeladen – perfekt für Coming-of-Age-Gefühle und Herzmomenten.",
  },
  billie: {
    name: "Billie Eilish",
    desc: "Atmosphärisch, intim und experimentell – für alle, die es düster und subtil lieben.",
  },
  weeknd: {
    name: "The Weeknd",
    desc: "Mitternachts-Vibes zwischen Synthwave und R&B – dunkel, elegant, hypnotisch.",
  },
};
