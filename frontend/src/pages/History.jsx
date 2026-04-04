import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../css/Dashboard.css";

const bookingHistory = [
  {
    id: "TK-9012",
    event: "Sunburn Festival 2026",
    venue: "Vagator Beach, Goa",
    eventDate: "2026-04-10T18:30:00",
    category: "Music Festival",
    icon: "🎪",
    status: "Confirmed",
    amount: 2499,
  },
  {
    id: "TK-8741",
    event: "IPL 2026 - MI vs CSK",
    venue: "Wankhede Stadium, Mumbai",
    eventDate: "2026-04-22T19:30:00",
    category: "Sports",
    icon: "🏏",
    status: "Confirmed",
    amount: 1800,
  },
  {
    id: "TK-7654",
    event: "Arijit Singh Live",
    venue: "Jawaharlal Nehru Stadium, Delhi",
    eventDate: "2026-03-25T20:00:00",
    category: "Concert",
    icon: "🎤",
    status: "Completed",
    amount: 3500,
  },
  {
    id: "TK-5521",
    event: "Stand-up Night Live",
    venue: "Shanmukhananda Hall, Mumbai",
    eventDate: "2026-03-05T19:00:00",
    category: "Comedy",
    icon: "🎭",
    status: "Canceled",
    amount: 1299,
  },
];

const initialNotifications = [
  {
    id: 1,
    title: "Ticket confirmed",
    message: "Your ticket for Sunburn Festival 2026 has been confirmed.",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    isRead: false,
  },
  {
    id: 2,
    title: "Event reminder",
    message: "IPL 2026 - MI vs CSK starts in 2 days. Download your e-ticket.",
    createdAt: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    isRead: false,
  },
  {
    id: 3,
    title: "Refund processed",
    message: "Refund for ticket TK-5521 was processed successfully.",
    createdAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    isRead: true,
  },
];

const liveTemplates = [
  "Venue gate entry time updated for your upcoming event.",
  "New seat category added - upgrade your ticket now.",
  "Price drop alert: tickets for a saved event are now cheaper.",
  "Organiser shared an important update for your booked event.",
];

export default function History() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const notifRef = useRef(null);

  const unreadCount = useMemo(
    () => notifications.filter((note) => !note.isRead).length,
    [notifications]
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomMessage = liveTemplates[Math.floor(Math.random() * liveTemplates.length)];
      const nextNote = {
        id: Date.now(),
        title: "Live update",
        message: randomMessage,
        createdAt: new Date().toISOString(),
        isRead: false,
      };

      setNotifications((prev) => [nextNote, ...prev].slice(0, 12));
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((note) => ({ ...note, isRead: true })));
  };

  const toggleExpand = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const filters = ["All", "Confirmed", "Completed", "Canceled"];
  const filteredBookings = activeFilter === "All"
    ? bookingHistory
    : bookingHistory.filter((b) => b.status === activeFilter);

  const getStatusLabel = (status) => {
    if (status === "Confirmed") return "✔ Confirmed";
    if (status === "Completed") return "✓ Completed";
    return "✕ Canceled";
  };

  const formatDate = (value) =>
    new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <main className="dashboard-page" aria-label="Booking history page">
      <section className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Booking History</h1>
          <p className="dashboard-subtitle">View all your confirmed, completed, and canceled bookings.</p>
        </div>
        <div className="dashboard-header__actions">
          <span className="dashboard-pill">{bookingHistory.length} records</span>
          <div className="notif-wrapper" ref={notifRef}>
            <button
              className="notif-bell"
              type="button"
              aria-label="Notifications"
              onClick={() => setShowNotifications((v) => !v)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="notif-dropdown">
                <div className="notif-dropdown__head">
                  <span>Notifications</span>
                  <div className="dashboard-card__actions">
                    <span className="dashboard-pill dashboard-pill--alert">{unreadCount} unread</span>
                    <button className="dashboard-link" type="button" onClick={markAllAsRead}>
                      Mark all read
                    </button>
                  </div>
                </div>
                <div className="notification-list">
                  {notifications.map((notification) => (
                    <div
                      className={`notification-item ${notification.isRead ? "" : "notification-item--new"}`}
                      key={notification.id}
                    >
                      <div className="notification-item__top">
                        <p>{notification.title}</p>
                        {!notification.isRead && <span className="notification-dot" />}
                      </div>
                      <p className="notification-item__message">{notification.message}</p>
                      <p className="notification-item__time">{formatDate(notification.createdAt)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="history-filters" role="tablist">
        {filters.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={activeFilter === f}
            className={`history-filter-tab ${activeFilter === f ? "history-filter-tab--active" : ""}`}
            type="button"
            onClick={() => setActiveFilter(f)}
          >
            {f}
            <span className="history-filter-tab__count">
              {f === "All" ? bookingHistory.length : bookingHistory.filter((b) => b.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Ticket cards */}
      <section className="ticket-list" aria-label="Ticket cards">
        {filteredBookings.map((booking) => (
          <article
            key={booking.id}
            className={`ticket-card ticket-card--${booking.status.toLowerCase()} ${expandedId === booking.id ? "ticket-card--expanded" : ""}`}
          >
            <div className="ticket-card__left" aria-hidden="true">
              <span className="ticket-card__icon">{booking.icon}</span>
            </div>

            <div className="ticket-card__body">
              <div className="ticket-card__top">
                <div>
                  <p className="ticket-card__event">{booking.event}</p>
                  <p className="ticket-card__category">{booking.category}</p>
                </div>
                <span className={`ticket-card__status ticket-status--${booking.status.toLowerCase()}`}>
                  {getStatusLabel(booking.status)}
                </span>
              </div>

              <div className="ticket-card__info">
                <span className="ticket-card__info-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {booking.venue}
                </span>
                <span className="ticket-card__info-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {formatDate(booking.eventDate)}
                </span>
              </div>

              <div className="ticket-card__divider">
                <span className="ticket-card__notch ticket-card__notch--left" />
                <span className="ticket-card__dashes" />
                <span className="ticket-card__notch ticket-card__notch--right" />
              </div>

              <div className="ticket-card__footer">
                <div>
                  <p className="ticket-card__id">{booking.id}</p>
                  <p className="ticket-card__amount">Rs. {booking.amount.toLocaleString("en-IN")}</p>
                </div>
                <button
                  className="ticket-card__btn"
                  type="button"
                  onClick={() => toggleExpand(booking.id)}
                  aria-expanded={expandedId === booking.id}
                >
                  {expandedId === booking.id ? "Hide Details" : "View Ticket"}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expandedId === booking.id ? "rotate(180deg)" : "none", transition: "transform 0.25s" }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
              </div>

              {expandedId === booking.id && (
                <div className="ticket-card__detail">
                  <div className="ticket-detail-row">
                    <span className="ticket-detail-label">Booking ID</span>
                    <span className="ticket-detail-value">{booking.id}</span>
                  </div>
                  <div className="ticket-detail-row">
                    <span className="ticket-detail-label">Event</span>
                    <span className="ticket-detail-value">{booking.event}</span>
                  </div>
                  <div className="ticket-detail-row">
                    <span className="ticket-detail-label">Venue</span>
                    <span className="ticket-detail-value">{booking.venue}</span>
                  </div>
                  <div className="ticket-detail-row">
                    <span className="ticket-detail-label">Date &amp; Time</span>
                    <span className="ticket-detail-value">{formatDate(booking.eventDate)}</span>
                  </div>
                  <div className="ticket-detail-row">
                    <span className="ticket-detail-label">Category</span>
                    <span className="ticket-detail-value">{booking.category}</span>
                  </div>
                  <div className="ticket-detail-row">
                    <span className="ticket-detail-label">Amount Paid</span>
                    <span className="ticket-detail-value ticket-detail-value--amount">Rs. {booking.amount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}

        {filteredBookings.length === 0 && (
          <div className="history-empty">
            <span>🎟️</span>
            <p>No {activeFilter.toLowerCase()} tickets found.</p>
          </div>
        )}
      </section>
    </main>
  );
}
