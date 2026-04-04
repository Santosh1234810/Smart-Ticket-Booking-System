import { useState } from "react";
import "../css/Dashboard.css";

const offersData = [
  {
    id: "OFF-001",
    title: "Festival Fever",
    description: "Get 20% off on all music festival tickets this season. Limited seats - book before they run out!",
    discount: "20% OFF",
    category: "Music Festival",
    icon: "🎪",
    code: "FEST20",
    validTill: "2026-04-30",
    isNew: true,
    theme: "purple",
  },
  {
    id: "OFF-002",
    title: "Sports Mania",
    description: "Flat Rs. 300 off on IPL and all cricket match tickets. Catch the live action at a steal!",
    discount: "Rs. 300 OFF",
    category: "Sports",
    icon: "🏏",
    code: "IPL300",
    validTill: "2026-05-15",
    isNew: false,
    theme: "blue",
  },
  {
    id: "OFF-003",
    title: "Concert Special",
    description: "Buy 2 concert tickets and get 1 absolutely free on select live shows across India.",
    discount: "BUY 2 GET 1",
    category: "Concert",
    icon: "🎤",
    code: "LIVE3FOR2",
    validTill: "2026-04-20",
    isNew: true,
    theme: "rose",
  },
  {
    id: "OFF-004",
    title: "Weekend Blast",
    description: "15% off on all weekend event tickets. New offer drops every Friday - do not miss out.",
    discount: "15% OFF",
    category: "All Events",
    icon: "🎟️",
    code: "WKND15",
    validTill: "2026-04-07",
    isNew: false,
    theme: "orange",
  },
];

export default function Offers() {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const formatOfferDate = (value) =>
    new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <main className="dashboard-page" aria-label="Offers page">
      <section className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Exclusive Offers</h1>
          <p className="dashboard-subtitle">All active event offers in one place.</p>
        </div>
        <span className="dashboard-pill">{offersData.length} active deals</span>
      </section>

      <section className="offers-section" aria-label="Exclusive offers">
        <div className="offers-grid">
          {offersData.map((offer) => (
            <div className={`offer-card offer-card--${offer.theme}`} key={offer.id}>
              <div className="offer-card__header">
                <span className="offer-card__icon">{offer.icon}</span>
                <div className="offer-card__badges">
                  {offer.isNew && <span className="offer-card__new-badge">NEW</span>}
                  <span className="offer-card__category">{offer.category}</span>
                </div>
              </div>

              <div className="offer-card__discount">{offer.discount}</div>
              <h3 className="offer-card__title">{offer.title}</h3>
              <p className="offer-card__desc">{offer.description}</p>

              <div className="offer-card__code-row">
                <div className="offer-card__code">
                  <span className="offer-card__code-label">COUPON</span>
                  <span className="offer-card__code-value">{offer.code}</span>
                </div>
                <button
                  className={`offer-card__copy-btn ${copiedCode === offer.code ? "offer-card__copy-btn--copied" : ""}`}
                  type="button"
                  onClick={() => handleCopy(offer.code)}
                  aria-label={`Copy coupon ${offer.code}`}
                >
                  {copiedCode === offer.code ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="offer-card__footer">
                <span className="offer-card__validity">Valid till {formatOfferDate(offer.validTill)}</span>
                <button className="offer-card__cta" type="button">Grab Deal</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
