import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import bodyHtml from "@/goelette/body.html?raw";
import jsonLd from "@/goelette/jsonld.json";
import { initGoelette } from "@/goelette/init";
import "@/goelette/goelette.css";

const TITLE =
  "La Goëlette — Restaurant & brasserie à L'Aiguillon-sur-Mer (Vendée)";
const DESCRIPTION =
  "La Goëlette, brasserie familiale au cœur de L'Aiguillon-sur-Mer : huîtres n°3 de L'Aiguillon, moules de bouchot marinière, poissons, viandes, Goëlette Burger, menu du midi à 20,50 €. Terrasse. Réservation au 02 51 27 64 88.";
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
      { property: "og:site_name", content: "La Goëlette" },
      {
        property: "og:title",
        content: "La Goëlette — Restaurant & brasserie à L'Aiguillon-sur-Mer",
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

/* ------------------------------------------------------------------ */
/*  Pop-up « fermeture exceptionnelle pour congés »                    */
/*  Fermé du lundi 5 au dimanche 11 octobre 2026 inclus.               */
/*  S'affiche tout seul et disparaît tout seul le 12 octobre 2026      */
/*  à 00h00 (heure de Paris) : rien à retirer après coup.              */
/* ------------------------------------------------------------------ */
const CONGES_FIN = new Date("2026-10-12T00:00:00+02:00");
const CONGES_CLE = "goelette-conges-2026-10";

const CONGES_CSS = `
.gl-conges-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(14,28,21,.62);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);animation:gl-conges-fade .25s ease}
.gl-conges-card{position:relative;width:100%;max-width:440px;max-height:calc(100vh - 40px);overflow:auto;box-sizing:border-box;padding:38px 32px 30px;text-align:center;background:#FBF7EE;color:#1C3A2C;border-radius:14px;border-top:5px solid #C9A45C;box-shadow:0 24px 70px rgba(0,0,0,.35);font-family:'Lato',system-ui,sans-serif;animation:gl-conges-rise .3s ease}
.gl-conges-close{position:absolute;top:10px;right:10px;width:38px;height:38px;border:0;border-radius:50%;background:transparent;color:#1C3A2C;font-size:26px;line-height:1;cursor:pointer}
.gl-conges-close:hover{background:rgba(28,58,44,.08)}
.gl-conges-eyebrow{margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#9A7B3C}
.gl-conges-title{margin:0 0 18px;font-family:'Playfair Display',Georgia,serif;font-size:30px;line-height:1.15;font-weight:700;color:#1C3A2C}
.gl-conges-rule{width:56px;height:2px;margin:0 auto 18px;background:#C9A45C;border:0}
.gl-conges-text{margin:0 0 6px;font-size:16px;line-height:1.55}
.gl-conges-dates{margin:0 0 16px;font-family:'Playfair Display',Georgia,serif;font-size:21px;line-height:1.35;font-weight:600}
.gl-conges-reopen{margin:0 0 6px;font-size:16px;line-height:1.55;font-style:italic}
.gl-conges-tel{margin:0 0 24px;font-size:14px;color:#4b5f54}
.gl-conges-tel a{color:#1C3A2C;font-weight:700;text-decoration:none;white-space:nowrap}
.gl-conges-btn{display:inline-block;min-width:170px;padding:13px 28px;border:0;border-radius:999px;background:#1C3A2C;color:#FBF7EE;font-family:'Lato',system-ui,sans-serif;font-size:15px;font-weight:700;letter-spacing:.03em;cursor:pointer;transition:background .15s ease}
.gl-conges-btn:hover{background:#2a5640}
.gl-conges-btn:focus-visible,.gl-conges-close:focus-visible{outline:3px solid #C9A45C;outline-offset:2px}
@keyframes gl-conges-fade{from{opacity:0}to{opacity:1}}
@keyframes gl-conges-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@media (max-width:480px){.gl-conges-card{padding:34px 22px 26px}.gl-conges-title{font-size:26px}.gl-conges-dates{font-size:19px}}
@media (prefers-reduced-motion:reduce){.gl-conges-overlay,.gl-conges-card{animation:none}}
`;

function PopupConges() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Ouverture côté navigateur uniquement (évite tout décalage avec le rendu serveur)
  useEffect(() => {
    if (Date.now() >= CONGES_FIN.getTime()) return;
    try {
      if (sessionStorage.getItem(CONGES_CLE)) return;
    } catch {
      /* stockage indisponible : on affiche quand même */
    }
    setOpen(true);
  }, []);

  const fermer = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(CONGES_CLE, "1");
    } catch {
      /* ignoré */
    }
  };

  // Échap pour fermer, page figée derrière, focus sur le bouton
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fermer();
    };
    const overflowAvant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    btnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflowAvant;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <>
      <style>{CONGES_CSS}</style>
      <div
        className="gl-conges-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) fermer();
        }}
      >
        <div
          className="gl-conges-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gl-conges-titre"
        >
          <button
            type="button"
            className="gl-conges-close"
            aria-label="Fermer"
            onClick={fermer}
          >
            ×
          </button>
          <p className="gl-conges-eyebrow">Information</p>
          <h2 id="gl-conges-titre" className="gl-conges-title">
            Fermeture exceptionnelle
          </h2>
          <hr className="gl-conges-rule" />
          <p className="gl-conges-text">
            La Goëlette sera fermée pour congés
          </p>
          <p className="gl-conges-dates">
            du lundi 5 au dimanche 11 octobre 2026 inclus
          </p>
          <p className="gl-conges-reopen">
            Nous serons heureux de vous retrouver dès le lundi 12 octobre.
          </p>
          <p className="gl-conges-tel">
            Réservations : <a href="tel:+33251276488">02 51 27 64 88</a>
          </p>
          <button
            ref={btnRef}
            type="button"
            className="gl-conges-btn"
            onClick={fermer}
          >
            J’ai compris
          </button>
        </div>
      </div>
    </>
  );
}

function Index() {
  useEffect(() => {
    initGoelette();
  }, []);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <PopupConges />
    </>
  );
}
