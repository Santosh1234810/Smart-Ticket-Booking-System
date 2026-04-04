import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/Payment.css";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNo, setCardNo] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [bank, setBank] = useState("");
  const [saveDetails, setSaveDetails] = useState(false);
  const [formError, setFormError] = useState("");
  const [paying, setPaying] = useState(false);

  if (!state) return <p>No booking data found.</p>;

  const { name, seats, total } = state;
  const seatCount = Array.isArray(seats) ? seats.length : 1;
  const subTotal = total || 0;
  const convenienceFee = Math.round(subTotal * 0.02);
  const gst = Math.round(convenienceFee * 0.18);
  const finalAmount = subTotal + convenienceFee + gst;

  const normalizedCard = cardNo.replace(/\s+/g, "").replace(/\D/g, "");
  const upiValid = /^[A-Za-z0-9._-]{2,}@[A-Za-z]{2,}$/.test(upiId.trim());
  const cardValid =
    normalizedCard.length === 16 &&
    /^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry) &&
    /^\d{3}$/.test(cvv);
  const netBankingValid = bank.trim().length > 0;

  const canPay =
    method === "upi"
      ? upiValid
      : method === "card"
        ? cardValid
        : netBankingValid;

  const maskedCard = normalizedCard
    ? `**** **** **** ${normalizedCard.slice(-4)}`
    : "**** **** **** ****";

  const formatCardNo = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length < 3) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const handlePay = (e) => {
    e.preventDefault();
    setFormError("");

    if (!canPay) {
      setFormError("Please complete valid payment details to continue.");
      return;
    }

    setPaying(true);

    const transactionId = `TXN${Date.now()}`;
    const receiptId = `RCPT${Math.floor(100000 + Math.random() * 900000)}`;

    setTimeout(() => {
      toast.success("Payment successful!");
      navigate("/success", {
        state: {
          ...state,
          total: finalAmount,
          method: method === "upi" ? "UPI" : method === "card" ? "Card" : "Net Banking",
          transactionId,
          receiptId,
          saveDetails,
        },
      });
    }, 1500);
  };

  return (
    <main className="payment-page">
      <div className="payment-layout">
        <section className="payment-box">
          <div className="payment-head">
            <h1 className="payment-title">Complete Payment</h1>
            <span className="payment-secure-badge">256-bit Secure Checkout</span>
          </div>

          <div className="payment-summary">
            <p className="payment-summary__event">{name}</p>
            <p className="payment-summary__seats">
              Seats: {Array.isArray(seats) ? seats.join(", ") : seats}
            </p>
            <p className="payment-summary__meta">Tickets: {seatCount}</p>
          </div>

          <div className="payment-progress" aria-label="Payment steps">
            <span className="payment-progress__step payment-progress__step--active">1. Select Method</span>
            <span className="payment-progress__step payment-progress__step--active">2. Enter Details</span>
            <span className="payment-progress__step">3. Confirm</span>
          </div>

          <div className="payment-methods">
            {[
              { id: "upi", label: "UPI", icon: "📱" },
              { id: "card", label: "Card", icon: "💳" },
              { id: "netbanking", label: "Net Banking", icon: "🏦" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                className={`payment-method-btn${method === m.id ? " payment-method-btn--active" : ""}`}
                onClick={() => {
                  setMethod(m.id);
                  setFormError("");
                }}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          <form className="payment-form" onSubmit={handlePay}>
            {method === "upi" && (
              <div className="payment-field">
                <label htmlFor="upi">UPI ID</label>
                <input
                  id="upi"
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                />
                <small className={`payment-hint${upiId && !upiValid ? " payment-hint--error" : ""}`}>
                  {upiId && !upiValid
                    ? "Enter valid UPI ID format, e.g. alex@okhdfcbank"
                    : "Instant payment via UPI apps"}
                </small>
              </div>
            )}

            {method === "card" && (
              <>
                <div className="payment-card-preview" aria-label="Card preview">
                  <p className="payment-card-preview__chip">CARD</p>
                  <p className="payment-card-preview__number">{maskedCard}</p>
                  <p className="payment-card-preview__name">Ticket Booking User</p>
                </div>

                <div className="payment-field">
                  <label htmlFor="cardNo">Card Number</label>
                  <input
                    id="cardNo"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNo}
                    onChange={(e) => setCardNo(formatCardNo(e.target.value))}
                    required
                  />
                </div>

                <div className="payment-field-row">
                  <div className="payment-field">
                    <label htmlFor="expiry">Expiry</label>
                    <input
                      id="expiry"
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      required
                    />
                  </div>
                  <div className="payment-field">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      id="cvv"
                      type="password"
                      placeholder="•••"
                      maxLength={3}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      required
                    />
                  </div>
                </div>

                <small className={`payment-hint${cardNo && !cardValid ? " payment-hint--error" : ""}`}>
                  {cardNo && !cardValid
                    ? "Card details look incomplete or invalid"
                    : "Your card details are encrypted and secure"}
                </small>
              </>
            )}

            {method === "netbanking" && (
              <div className="payment-field">
                <label htmlFor="bank">Select Bank</label>
                <select
                  id="bank"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  required
                >
                  <option value="">-- Choose Bank --</option>
                  <option>SBI</option>
                  <option>HDFC</option>
                  <option>ICICI</option>
                  <option>Axis</option>
                  <option>Kotak</option>
                </select>
              </div>
            )}

            <label className="payment-check">
              <input
                type="checkbox"
                checked={saveDetails}
                onChange={(e) => setSaveDetails(e.target.checked)}
              />
              Save payment preference for faster checkout
            </label>

            {formError && <p className="payment-form-error">{formError}</p>}

            <button type="submit" className="payment-pay-btn" disabled={paying || !canPay}>
              {paying ? "Processing..." : `Pay Rs. ${finalAmount.toLocaleString("en-IN")}`}
            </button>
          </form>
        </section>

        <aside className="payment-order-box" aria-label="Order summary">
          <h2 className="payment-order-title">Order Summary</h2>
          <div className="payment-order-row">
            <span>Ticket Amount</span>
            <strong>Rs. {subTotal.toLocaleString("en-IN")}</strong>
          </div>
          <div className="payment-order-row">
            <span>Convenience Fee</span>
            <strong>Rs. {convenienceFee.toLocaleString("en-IN")}</strong>
          </div>
          <div className="payment-order-row">
            <span>GST</span>
            <strong>Rs. {gst.toLocaleString("en-IN")}</strong>
          </div>
          <div className="payment-order-row payment-order-row--total">
            <span>Total Payable</span>
            <strong>Rs. {finalAmount.toLocaleString("en-IN")}</strong>
          </div>

          <p className="payment-order-note">
            By continuing, you agree to our Terms and refund policy.
          </p>

          <div className="payment-trust">
            <span>Secure Payments</span>
            <span>Instant Confirmation</span>
            <span>24x7 Support</span>
          </div>
        </aside>
        </div>
    </main>
  );
}
