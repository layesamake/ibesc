import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IBESC — International BESC Business",
    short_name: "IBESC",
    description: "Vos certificats de suivi des cargaisons vers l'Afrique, simplement.",
    start_url: "/fr",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f6f5f0",
    theme_color: "#142e3b",
    lang: "fr",
    icons: [
      { src: "/logo.png", sizes: "300x300", type: "image/png", purpose: "any" },
    ],
  };
}
