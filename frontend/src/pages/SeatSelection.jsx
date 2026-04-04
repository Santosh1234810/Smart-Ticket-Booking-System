import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import "../css/SeatSelection.css";

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const SEATS_PER_ROW = 12;
const TIMES = ["10:00 AM", "02:00 PM", "06:00 PM", "09:30 PM"];

const SEAT_META = {
  PLATINUM: { price: 400, color: "platinum", label: "Platinum" },
  GOLD:     { price: 250, color: "gold",     label: "Gold"     },
  SILVER:   { price: 150, color: "silver",   label: "Silver"   },
};

function getSeatType(row) {
  if (["A", "B"].includes(row)) return "PLATINUM";
  if (["C", "D", "E"].includes(row)) return "GOLD";
  return "SILVER";
}

export default function SeatSelection() {
  const { state: event } = useLocation();
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSeats, setBookedSeats] = useState([]);

  const maxTickets = 10;

  useEffect(() => {
    if (event) {
      const stored = JSON.parse(localStorage.getItem(`booked_${event.id}`)) || [];
      setBookedSeats(stored);
    }
  }, [event]);

  const total = useMemo(
    () =>
      selectedSeats.reduce((sum, seatId) => {
        const type = getSeatType(seatId.charAt(0));
        return sum + SEAT_META[type].price;
      }, 0),
    [selectedSeats],
  );

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= maxTickets) return;
      setSelectedSeats((prev) => [...prev, seatId]);
    }
  };

  const handleProceed = () => {
    if (!selectedSeats.length || !selectedTime) return;
    const updatedBooked = [...bookedSeats, ...selectedSeats];
    localStorage.setItem(`booked_${event.id}`, JSON.stringify(updatedBooked));
    navigate("/payment", { state: { event, seats: selectedSeats, total, time: selectedTime } });
  };

  if (!event)
    return (
      <div className="ss-empty">
        <p>No event selected.</p>
        <button onClick={() => navigate("/events")}>Browse Events</button>
      </div>
    );

  const canProceed = selectedSeats.length > 0 && !!selectedTime;

  return (
    <main className="ss-page">
      {/* ── Header ── */}
      <div className="ss-header">
        <button className="ss-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="ss-header__info">
          <h1 className="ss-title">{event.name}</h1>
          <span className="ss-subtitle">
            {event.venue || "Cineplex"} &bull; {event.date || "Today"}
          </span>
        </div>
        <div className="ss-header__badges">
          <span className="ss-badge ss-badge--ua">U/A</span>
          <span className="ss-badge ss-badge--format">2D</span>
        </div>
      </div>

      {/* ── Show-Time Row ── */}
      <div className="ss-time-section">
        <p className="ss-section-label">Select Show Time</p>
        <div className="ss-time-row">
          {TIMES.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => setSelectedTime(time)}
              className={`ss-time-btn${selectedTime === time ? " ss-time-btn--active" : ""}`}
            >
              <span className="ss-time-btn__time">{time}</span>
              <span className="ss-time-btn__tag">Available</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="ss-layout">
        {/* Seat Map */}
        <div className="ss-map-area">
          {/* Screen */}
          <div className="ss-screen-wrapper">
            <div className="ss-screen-glow" />
            <div className="ss-screen">SCREEN</div>
            <p className="ss-screen-label">All eyes this way please!</p>
          </div>

          {/* Legend */}
          <div className="ss-legend">
            {Object.entries(SEAT_META).map(([type, meta]) => (
              <div key={type} className="ss-legend-item">
                <span className={`ss-swatch ss-swatch--${meta.color}`} />
                <span className="ss-legend-text">
                  {meta.label} <strong>₹{meta.price}</strong>
                </span>
              </div>
            ))}
            <div className="ss-legend-item">
              <span className="ss-swatch ss-swatch--booked" />
              <span className="ss-legend-text">Booked</span>
            </div>
            <div className="ss-legend-item">
              <span className="ss-swatch ss-swatch--selected" />
              <span className="ss-legend-text">Selected</span>
            </div>
          </div>

          {/* Seat Count Bar */}
          <div className="ss-count-bar">
            <span>
              <strong>{selectedSeats.length}</strong> / {maxTickets} seats selected
            </span>
            {selectedSeats.length >= maxTickets && (
              <span className="ss-count-bar__warn">Maximum reached</span>
            )}
          </div>

          {/* Seat Grid */}
          <div className="ss-seat-map">
            {ROWS.map((row, rowIndex) => {
              const type = getSeatType(row);
              const meta = SEAT_META[type];
              const half = SEATS_PER_ROW / 2;

              return (
                <div key={row} className="ss-row-block">
                  <span className={`ss-row-label ss-row-label--${meta.color}`}>{row}</span>

                  <div className={`ss-seat-row ss-seat-row--${rowIndex}`}>
                    {/* Left half */}
                    {Array.from({ length: half }, (_, i) => {
                      const seatId = `${row}${i + 1}`;
                      const isSelected = selectedSeats.includes(seatId);
                      const isBooked = bookedSeats.includes(seatId);
                      return (
                        <button
                          key={seatId}
                          type="button"
                          disabled={isBooked}
                          onClick={() => toggleSeat(seatId)}
                          title={`${seatId} · ${meta.label} · ₹${meta.price}`}
                          className={[
                            "ss-seat",
                            `ss-seat--${meta.color}`,
                            isBooked ? "ss-seat--booked" : "",
                            isSelected ? "ss-seat--selected" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {i + 1}
                        </button>
                      );
                    })}

                    {/* Aisle */}
                    <span className="ss-aisle" />

                    {/* Right half */}
                    {Array.from({ length: half }, (_, i) => {
                      const seatNum = half + i + 1;
                      const seatId = `${row}${seatNum}`;
                      const isSelected = selectedSeats.includes(seatId);
                      const isBooked = bookedSeats.includes(seatId);
                      return (
                        <button
                          key={seatId}
                          type="button"
                          disabled={isBooked}
                          onClick={() => toggleSeat(seatId)}
                          title={`${seatId} · ${meta.label} · ₹${meta.price}`}
                          className={[
                            "ss-seat",
                            `ss-seat--${meta.color}`,
                            isBooked ? "ss-seat--booked" : "",
                            isSelected ? "ss-seat--selected" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {seatNum}
                        </button>
                      );
                    })}
                  </div>

                  <span className={`ss-row-label ss-row-label--${meta.color}`}>{row}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Sticky Sidebar ── */}
        <aside className="ss-sidebar">
          <div className="ss-sidebar__inner">
            <h3 className="ss-sidebar__heading">Booking Summary</h3>

            {/* Event snippet */}
            <div className="ss-sidebar__event">
              {event.image && (
                <img
                  src={event.image}
                  alt={event.name}
                  className="ss-sidebar__poster"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
              <div>
                <p className="ss-sidebar__event-name">{event.name}</p>
                <p className="ss-sidebar__event-venue">{event.venue || "Cineplex"}</p>
              </div>
            </div>

            {/* Details rows */}
            <div className="ss-info-rows">
              <div className="ss-info-row">
                <span>Show Time</span>
                <span className={selectedTime ? "ss-val--set" : "ss-val--muted"}>
                  {selectedTime || "—"}
                </span>
              </div>
              <div className="ss-info-row">
                <span>Seats</span>
                <span className={selectedSeats.length ? "ss-val--set" : "ss-val--muted"}>
                  {selectedSeats.length ? `${selectedSeats.length} selected` : "—"}
                </span>
              </div>
            </div>

            {/* Seat tags */}
            {selectedSeats.length > 0 && (
              <div className="ss-seat-tags">
                {selectedSeats.map((s) => (
                  <span key={s} className="ss-seat-tag">{s}</span>
                ))}
                <button
                  className="ss-clear-btn"
                  onClick={() => setSelectedSeats([])}
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="ss-divider" />

            {/* Total */}
            <div className="ss-total-row">
              <span>Total Amount</span>
              <span className="ss-total-amount">₹{total}</span>
            </div>

            {/* Proceed Button */}
            <button
              className={`ss-pay-btn${canProceed ? "" : " ss-pay-btn--disabled"}`}
              disabled={!canProceed}
              onClick={handleProceed}
            >
              Proceed to Payment →
            </button>

            {!canProceed && (
              <p className="ss-pay-hint">
                {!selectedTime
                  ? "⏰ Please select a show time"
                  : "🪑 Please select at least one seat"}
              </p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
