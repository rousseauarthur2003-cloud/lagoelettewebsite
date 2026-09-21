import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

function Index() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    initGoelette();

    // Afficher le pop-up une seule fois par visite, uniquement pour cette
    // ouverture exceptionnelle et jusqu'au dimanche 27 septembre 2026 au soir.
    const now = new Date();
    const endDate = new Date("2026-09-28T00:00:00+02:00");
    const alreadySeen = sessionStorage.getItem("goelette-opening-popup-seen");

    if (now < endDate && !alreadySeen) {
      setShowPopup(true);
    }
  }, []);

  const closePopup = () => {
    sessionStorage.setItem("goelette-opening-popup-seen", "1");
    setShowPopup(false);
  };

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />

      {showPopup && (
        <>
          <style>{`
            .goelette-popup-overlay {
              position: fixed;
              inset: 0;
              z-index: 99999;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
              background: rgba(18, 35, 27, 0.58);
              backdrop-filter: blur(4px);
              -webkit-backdrop-filter: blur(4px);
            }

            .goelette-popup {
              position: relative;
              width: min(560px, 100%);
              overflow: hidden;
              background: #f7f2e8;
              color: #1c3a2c;
              border: 1px solid rgba(184, 145, 72, 0.55);
              box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
              border-radius: 4px;
              text-align: center;
            }

            .goelette-popup-top {
              padding: 30px 28px 24px;
              border-bottom: 1px solid rgba(184, 145, 72, 0.35);
            }

            .goelette-popup-kicker {
              margin: 0 0 8px;
              font-family: Lato, Arial, sans-serif;
              font-size: 11px;
              font-weight: 900;
              letter-spacing: 0.22em;
              text-transform: uppercase;
              color: #b89148;
            }

            .goelette-popup h2 {
              margin: 0;
              font-family: "Playfair Display", Georgia, serif;
              font-size: clamp(28px, 6vw, 40px);
              line-height: 1.05;
              font-weight: 700;
              color: #1c3a2c;
            }

            .goelette-popup-subtitle {
              margin: 10px 0 0;
              font-family: Lato, Arial, sans-serif;
              font-size: 13px;
              font-weight: 700;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            }

            .goelette-popup-content {
              padding: 22px 28px 28px;
            }

            .goelette-popup-days {
              display: grid;
              gap: 10px;
              margin-bottom: 22px;
            }

            .goelette-popup-day {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 16px;
              padding: 13px 16px;
              background: #1c3a2c;
              color: #f7f2e8;
              text-align: left;
            }

            .goelette-popup-day strong {
              display: block;
              font-family: "Playfair Display", Georgia, serif;
              font-size: 18px;
              line-height: 1.1;
            }

            .goelette-popup-day span {
              display: block;
              margin-top: 4px;
              font-family: Lato, Arial, sans-serif;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              color: #e3c98c;
            }

            .goelette-popup-hours {
              flex: 0 0 auto;
              font-family: Lato, Arial, sans-serif;
              font-size: 15px;
              font-weight: 900;
              white-space: nowrap;
            }

            .goelette-popup-button {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              min-height: 48px;
              padding: 0 25px;
              background: #b89148;
              color: #fffdf7;
              text-decoration: none;
              font-family: Lato, Arial, sans-serif;
              font-size: 12px;
              font-weight: 900;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              transition: transform 0.2s ease, background 0.2s ease;
            }

            .goelette-popup-button:hover {
              transform: translateY(-1px);
              background: #9d793d;
            }

            .goelette-popup-phone {
              margin: 13px 0 0;
              font-family: Lato, Arial, sans-serif;
              font-size: 13px;
            }

            .goelette-popup-phone a {
              color: #1c3a2c;
              font-weight: 900;
              text-decoration: none;
            }

            .goelette-popup-close {
              position: absolute;
              top: 12px;
              right: 12px;
              width: 34px;
              height: 34px;
              border: 0;
              border-radius: 50%;
              background: rgba(247, 242, 232, 0.92);
              color: #1c3a2c;
              cursor: pointer;
              font-size: 23px;
              line-height: 1;
              z-index: 2;
            }

            .goelette-popup-close:hover {
              background: #fff;
            }

            @media (max-width: 520px) {
              .goelette-popup-overlay {
                padding: 14px;
              }

              .goelette-popup-top {
                padding: 28px 20px 20px;
              }

              .goelette-popup-content {
                padding: 18px 20px 22px;
              }

              .goelette-popup-day {
                padding: 12px 13px;
              }

              .goelette-popup-day strong {
                font-size: 16px;
              }

              .goelette-popup-hours {
                font-size: 13px;
              }
            }
          `}</style>

          <div
            className="goelette-popup-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="goelette-popup-title"
          >
            <div className="goelette-popup">
              <button
                className="goelette-popup-close"
                type="button"
                aria-label="Fermer"
                onClick={closePopup}
              >
                ×
              </button>

              <div className="goelette-popup-top">
                <p className="goelette-popup-kicker">La Goëlette · L'Aiguillon-sur-Mer</p>
                <h2 id="goelette-popup-title">Ouverture exceptionnelle</h2>
                <p className="goelette-popup-subtitle">
                  Vendredi &amp; samedi soir
                </p>
              </div>

              <div className="goelette-popup-content">
                <div className="goelette-popup-days">
                  <div className="goelette-popup-day">
                    <div>
                      <strong>Vendredi 25 septembre</strong>
                      <span>Restauration midi &amp; soir</span>
                    </div>
                    <div className="goelette-popup-hours">09h00 – 22h00</div>
                  </div>

                  <div className="goelette-popup-day">
                    <div>
                      <strong>Samedi 26 septembre</strong>
                      <span>Restauration midi &amp; soir</span>
                    </div>
                    <div className="goelette-popup-hours">09h00 – 22h00</div>
                  </div>

                  <div className="goelette-popup-day">
                    <div>
                      <strong>Dimanche 27 septembre</strong>
                      <span>Restauration uniquement le midi</span>
                    </div>
                    <div className="goelette-popup-hours">09h00 – 15h00</div>
                  </div>
                </div>

                <a className="goelette-popup-button" href="tel:+33251276488">
                  Réserver une table
                </a>

                <p className="goelette-popup-phone">
                  📞 <a href="tel:+33251276488">02 51 27 64 88</a>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
