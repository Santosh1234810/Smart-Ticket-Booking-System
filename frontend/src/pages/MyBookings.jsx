import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "../css/MyBookings.css";

const STATUS_META = {
  Confirmed: { cls: "mb-status--confirmed", icon: "✅" },
  Completed: { cls: "mb-status--completed", icon: "🏁" },
  Canceled:  { cls: "mb-status--canceled",  icon: "❌" },
};

function getCategoryIcon(name = "") {
  const n = name.toLowerCase();
  if (n.includes("ipl") || n.includes("match") || n.includes("cup")) return "⚽";
  if (n.includes("live") || n.includes("concert") || n.includes("fest")) return "🎤";
  return "🎬";
}

const DEMO_BOOKINGS = [
  {
    id: "TK-9012",
    event: { name: "Pushpa 2", city: "Bangalore" },
    seats: ["A4", "A5"],
    total: 2499,
    date: "Mar 28, 2026",
    time: "6:30 PM",
    method: "UPI",
    status: "Confirmed",
    transactionId: "UPI20260328001",
    receiptId: "REC-9012",
  },
  {
    id: "TK-8741",
    event: { name: "Arijit Singh Live", city: "Bangalore" },
    seats: ["B12"],
    total: 1800,
    date: "Mar 15, 2026",
    time: "8:00 PM",
    method: "Card",
    status: "Confirmed",
    transactionId: "CRD20260315042",
    receiptId: "REC-8741",
  },
  {
    id: "TK-7654",
    event: { name: "IPL Match", city: "Mumbai" },
    seats: ["D3", "D4", "D5"],
    total: 3500,
    date: "Feb 20, 2026",
    time: "3:30 PM",
    method: "Net Banking",
    status: "Completed",
    transactionId: "NET20260220087",
    receiptId: "REC-7654",
  },
];

export default function MyBookings() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);

  const stored = localStorage.getItem("bookings");
  const bookings = (stored ? JSON.parse(stored) : null) || DEMO_BOOKINGS;

  const totalSpent = bookings.reduce((s, b) => s + (b.total || 0), 0);
  const confirmedCount = bookings.filter((b) => b.status === "Confirmed").length;

  return (
    <main className="mb-page">
      <div className="mb-page-header">
        <div>
          <h1 className="mb-page-title">My Bookings</h1>
          <p className="mb-page-sub">All your tickets, organized in one place.</p>
        </div>
        <button type="button" className="mb-browse-btn" onClick={() => navigate("/events")}>
          + Book More
        </button>
      </div>

      <div className="mb-stats">
        <div className="mb-stat">
          <span className="mb-stat__value">{bookings.length}</span>
          <span className="mb-stat__label">Total Bookings</span>
        </div>
        <div className="mb-stat-divider" />
        <div className="mb-stat">
          <span className="mb-stat__value">{confirmedCount}</span>
          <span className="mb-stat__label">Confirmed</span>
        </div>
        <div className="mb-stat-divider" />
        <div className="mb-stat">
          <span className="mb-stat__value">Rs. {totalSpent.toLocaleString("en-IN")}</span>
          <span className="mb-stat__label">Total Spent</span>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="mb-empty">
          <span className="mb-empty__icon">🎟️</span>
          <p className="mb-empty__text">No bookings yet. Start exploring!</p>
          <button type="button" className="mb-browse-btn" onClick={() => navigate("/events")}>
            Browse Events
          </button>
        </div>
      ) : (
        <div className="mb-grid">
          {bookings.map((b) => {
            const sm = STATUS_META[b.status] || STATUS_META.Confirmed;
            const catIcon = getCategoryIcon(b.event?.name);
            const isExpanded = expandedId === b.id;
            const qrValue = `${b.id}|${b.event?.name}|${b.seats?.join(",")}`;

            return (
              <div key={b.id} className={`mb-card${isExpanded ? " mb-card--expanded" : ""}`}>
                <div className="mb-card__body">
                  <div className="mb-card__top">
                    <span className="mb-card__cat-icon">{catIcon}</span>
                    <div className="mb-card__title-block">
                      <p className="mb-card__event">{b.event?.name}</p>
                      <p className="mb-card__city">📍 {b.event?.city}</p>
                    </div>
                    <span className={`mb-status ${sm.cls}`}>
                      {sm.icon} {b.status}
                    </span>
                  </div>

                  <div className="mb-card__pills">
                    <span className="mb-pill">🗓 {b.date}</span>
                    <span className="mb-pill">🕐 {b.time}</span>
                    <span className="mb-pill">💺 {b.seats?.join(", ")}</span>
                    <span className="mb-pill">💳 {b.method}</span>
                  </div>

                  <div className="mb-card__footer">
                    <div>
                      <p className="mb-card__id">{b.id}</p>
                      <p className="mb-card__txn">Txn: {b.transactionId}</p>
                    </div>
                    <p className="mb-card__amount">Rs. {(b.total || 0).toLocaleString("en-IN")}</p>
                  </div>

                  <button
                    type="button"
                    className="mb-card__toggle"
                    onClick={() => setExpandedId(isExpanded ? null : b.id)}
                  >
                    {isExpanded ? "Hide QR ▲" : "Show QR & Details ▼"}
                  </button>

                  {isExpanded && (
                    <div className="mb-card__detail">
                      <div className="mb-qr-box">
                        <QRCodeCanvas value={qrValue} size={100} fgColor="#7f1d1d" />
                        <p className="mb-qr-label">Scan at Venue</p>
                      </div>
                      <div className="mb-detail-rows">
                        <div className="mb-detail-row">
                          <span>Receipt ID</span>
                          <strong>{b.receiptId}</strong>
                        </div>
                        <div className="mb-detail-row">
                          <span>Transaction</span>
                          <strong>{b.transactionId}</strong>
                        </div>
                        <div className="mb-detail-row">
                          <span>Payment</span>
                          <strong>{b.method}</strong>
                        </div>
                        <div className="mb-detail-row">
                          <span>Seats</span>
                          <strong>{b.seats?.join(", ")}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}