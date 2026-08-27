import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import bodyHtml from "@/goelette/body.html?raw";
import jsonLd from "@/goelette/jsonld.json";
import { initGoelette } from "@/goelette/init";
import "@/goelette/goelette.css";

const TITLE =
  "La Goélette — Restaurant & brasserie à L'Aiguillon-sur-Mer (Vendée)";
const DESCRIPTION =
  "La Goélette, brasserie familiale au cœur de L'Aiguillon-sur-Mer : huîtres n°3 de L'Aiguillon, moules de bouchot marinière, poissons, viandes, Goëlette Burger, menu du midi à 20,50 €. Terrasse. Réservation au 02 51 27 64 88.";
const OG_DESCRIPTION =
  "Une escale gourmande au cœur de L'Aiguillon-sur-Mer. Huîtres, moules de bouchot, poissons, viandes, burgers. Terrasse et ambiance familiale.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "index, follow" },
      { name: "geo.placename", content: "L'Aiguillon-sur-Mer, Vendée" },
      { name: "geo.region", content: "FR-PDL" },
      { property: "og:type", content: "restaurant" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:site_name", content: "La Goélette" },
      {
        property: "og:title",
        content: "La Goélette — Restaurant & brasserie à L'Aiguillon-sur-Mer",
      },
      { property: "og:description", content: OG_DESCRIPTION },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#1C3A2C" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Lato:ital,wght@0,400;0,700;0,900;1,400&family=Parisienne&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(jsonLd),
      },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    initGoelette();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}
