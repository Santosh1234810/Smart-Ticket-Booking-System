import { useState, useEffect, useMemo } from "react";
import API from "../services/api";
import "../css/ResaleTicket.css";

function getCategoryIcon(name = "") {
  const n = name.toLowerCase();
  if (n.includes("ipl") || n.includes("match") || n.includes("cricket")) return "🏏";
  if (n.includes("live") || n.includes("concert") || n.includes("fest") || n.includes("music")) return "🎤";
  if (n.includes("comedy") || n.includes("standup")) return "🎭";
  if (n.includes("movie") || n.includes("film")) return "🎬";
  return "🎪";
}

export default function ResaleTicket() {
  const [activeTab, setActiveTab] = useState("available");
  const [bookings, setBookings] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceInputs, setPriceInputs] = useState({});
  const [listingId, setListingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          setError("Please log in to view your tickets.");
          return;
        }

        const [bookingResponse, resaleResponse] = await Promise.all([
          API.get("/bookings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get("/bookings/resale/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const all = bookingResponse.data.bookings || [];
        const myListings = resaleResponse.data.resaleTickets || [];

        setBookings(all.filter((b) => b.status === "Confirmed"));
        setListings(myListings);
      } catch (err) {
        console.error("Failed to load resale data:", err);
        setError("Unable to load tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const listedIds = useMemo(
    () => new Set(listings.filter((l) => l.status !== "Rejected").map((l) => l.bookingId)),
    [listings]
  );

  const availableTickets = useMemo(
    () => bookings.filter((b) => !listedIds.has(b.id || b._id)),
    [bookings, listedIds]
  );

  const handlePriceChange = (id, value) => {
    setPriceInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleListForResale = async (booking) => {
    const token = localStorage.getItem("access");
    const id = booking.id || booking._id;
    const price = parseFloat(priceInputs[id]);
    if (!price || price <= 0) {
      alert("Please enter a valid resale price.");
      return;
    }

    try {
      const response = await API.post(
        `/bookings/${id}/resale`,
        { resalePrice: price },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const created = response.data?.resale;
      if (created) {
        setListings((prev) => [created, ...prev]);
      }

    setPriceInputs((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    setListingId(id);
    setTimeout(() => setListingId(null), 2000);
    setActiveTab("listed");
    } catch (err) {
      console.error("Failed to submit resale request:", err);
      const message = err?.response?.data?.error || "Failed to submit resale request.";
      alert(message);
    }
  };

  const handleRemoveListing = async (resaleId) => {
    const token = localStorage.getItem("access");
    try {
      await API.delete(`/bookings/resale/${resaleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings((prev) => prev.filter((l) => l.id !== resaleId));
    } catch (err) {
      console.error("Failed to remove listing:", err);
      const message = err?.response?.data?.error || "Failed to remove listing.";
      alert(message);
    }
  };

  const getResaleStatusClass = (status) => {
    if (status === "Approved") return "resale-badge--approved";
    if (status === "Rejected") return "resale-badge--rejected";
    return "resale-badge--pending";
  };

  return (
    <main className="resale-page">
      <div className="resale-header">
        <div>
          <h1 className="resale-title">Resale Tickets</h1>
          <p className="resale-subtitle">List your tickets for resale or manage your active listings.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="resale-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === "available"}
          className={`resale-tab${activeTab === "available" ? " resale-tab--active" : ""}`}
          type="button"
          onClick={() => setActiveTab("available")}
        >
          Available to List
          <span className="resale-tab__count">{availableTickets.length}</span>
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "listed"}
          className={`resale-tab${activeTab === "listed" ? " resale-tab--active" : ""}`}
          type="button"
          onClick={() => setActiveTab("listed")}
        >
          My Resale Requests
          <span className="resale-tab__count">{listings.length}</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="resale-loading">Loading your tickets...</div>
      ) : error ? (
        <div className="resale-error">
          <p>{error}</p>
        </div>
      ) : activeTab === "available" ? (
        <section className="resale-grid" aria-label="Tickets available to list for resale">
          {availableTickets.length === 0 ? (
            <div className="resale-empty">
              <span className="resale-empty__icon">🎟️</span>
              <p>No confirmed tickets available for resale request.</p>
            </div>
          ) : (
            availableTickets.map((b) => {
              const id = b.id || b._id;
              const eventName =
                typeof b.event === "string" ? b.event : b.event?.name || "Event";
              const eventCity =
                typeof b.event === "string"
                  ? b.venue || b.city || "Location"
                  : b.event?.city || b.city || "Location";
              const icon = getCategoryIcon(eventName);
              const justListed = listingId === id;

              return (
                <article key={id} className="resale-card">
                  <div className="resale-card__left">
                    <span className="resale-card__icon">{icon}</span>
                  </div>
                  <div className="resale-card__body">
                    <div className="resale-card__top">
                      <div>
                        <p className="resale-card__event">{eventName}</p>
                        <p className="resale-card__venue">📍 {eventCity}</p>
                      </div>
                      <span className="resale-badge resale-badge--confirmed">Confirmed</span>
                    </div>

                    <div className="resale-card__pills">
                      {b.date && <span className="resale-pill">🗓 {b.date}</span>}
                      {b.time && <span className="resale-pill">🕐 {b.time}</span>}
                      {b.seats?.length > 0 && (
                        <span className="resale-pill">💺 {b.seats.join(", ")}</span>
                      )}
                    </div>

                    <div className="resale-card__footer">
                      <div className="resale-card__price-block">
                        <p className="resale-card__original">
                          Paid: <strong>Rs. {(b.total || 0).toLocaleString("en-IN")}</strong>
                        </p>
                        <div className="resale-price-row">
                          <label className="resale-price-label" htmlFor={`price-${id}`}>
                            Set Resale Price (Rs.)
                          </label>
                          <input
                            id={`price-${id}`}
                            className="resale-price-input"
                            type="number"
                            min="1"
                            placeholder="e.g. 1500"
                            value={priceInputs[id] || ""}
                            onChange={(e) => handlePriceChange(id, e.target.value)}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`resale-list-btn${justListed ? " resale-list-btn--success" : ""}`}
                        onClick={() => handleListForResale(b)}
                        disabled={justListed}
                      >
                        {justListed ? "✓ Requested!" : "Request Resale"}
                      </button>
                    </div>

                    <p className="resale-card__id">{id}</p>
                  </div>
                </article>
              );
            })
          )}
        </section>
      ) : (
        <section className="resale-grid" aria-label="Tickets listed for resale">
          {listings.length === 0 ? (
            <div className="resale-empty">
              <span className="resale-empty__icon">🏷️</span>
              <p>You have not submitted any resale requests yet.</p>
              <button
                type="button"
                className="resale-switch-btn"
                onClick={() => setActiveTab("available")}
              >
                Request Resale
              </button>
            </div>
          ) : (
            listings.map((listing) => (
              <article key={listing.id} className="resale-card resale-card--listed">
                <div className="resale-card__left">
                  <span className="resale-card__icon">{getCategoryIcon(listing.event?.name || "")}</span>
                </div>
                <div className="resale-card__body">
                  <div className="resale-card__top">
                    <div>
                      <p className="resale-card__event">{listing.event?.name || "Event"}</p>
                      <p className="resale-card__venue">📍 {listing.event?.city || listing.event?.venue || "Location"}</p>
                    </div>
                    <span className={`resale-badge ${getResaleStatusClass(listing.status)}`}>
                      {listing.status || "Pending"}
                    </span>
                  </div>

                  <div className="resale-card__pills">
                    {listing.event?.date && <span className="resale-pill">🗓 {listing.event.date}</span>}
                    {listing.event?.time && <span className="resale-pill">🕐 {listing.event.time}</span>}
                    {listing.seats?.length > 0 && (
                      <span className="resale-pill">💺 {listing.seats.join(", ")}</span>
                    )}
                  </div>

                  <div className="resale-card__price-summary">
                    <div className="resale-price-summary-row">
                      <span>Original Price</span>
                      <strong>Rs. {listing.originalPrice.toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="resale-price-summary-row resale-price-summary-row--highlight">
                      <span>Resale Price</span>
                      <strong>Rs. {listing.resalePrice.toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="resale-price-summary-row">
                      <span>Listed on</span>
                      <strong>
                        {new Date(listing.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </strong>
                    </div>
                  </div>

                  <div className="resale-card__actions">
                    <p className="resale-card__id">{listing.bookingId}</p>
                    <button
                      type="button"
                      className="resale-remove-btn"
                      onClick={() => handleRemoveListing(listing.id)}
                    >
                      Remove Request
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      )}
    </main>
  );
}
