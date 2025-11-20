export type ArtistKey = "taylor" | "sabrina" | "billie" | "laufey";

export const ARTIST_INFO: Record<ArtistKey, { name: string; desc: string }> = {
  taylor: {
    name: "Taylor Swift",
    desc: "Gefühlvolle Texte, schöne Melodien und eingängige Songs.",
  },
  sabrina: {
    name: "Sabrina Carpenter",
    desc: "Starke Stimme, poppige Hits und charmante Bühnenpräsenz.",
  },
  billie: {
    name: "Billie Eilish",
    desc: "Dunkle Beats, geheimnisvolle Texte und unverwechselbarer Stil.",
  },
  laufey: {
    name: "Laufey",
    desc: "Sanfte Melodien, poetische Lyrics und nostalgisches Feeling.",
  },
};
