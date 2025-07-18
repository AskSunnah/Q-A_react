// ------------------------------
// FRONTEND - Contribute.jsx (Main Form Component)
// ------------------------------

import React, { useState } from "react";
import paypalIcon from "../../assets/paypal.png";
import cardIcon from "../../assets/card.png";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("your-publishable-key");

const getAmount = (customAmount, selectedAmount) => {
  const amount = customAmount !== "" ? parseFloat(customAmount) : selectedAmount;
  return Math.max(1, amount);
};

const handleStripeDonate = async ({ donationType, amount }) => {
  const stripe = await stripePromise;
  const response = await fetch(`/api/donate/create-${donationType}-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  const data = await response.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert("Failed to initiate payment.");
  }
};

const Contribute = ({ lang = "en" }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [donationType, setDonationType] = useState("one-time");
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState("");

  const amountToSend = getAmount(customAmount, selectedAmount);
  const isArabic = lang === "ar";

  const t = {
    heading: isArabic ? "ساهم في دعم منصة اسأل السنة" : "Contribute to AskSunnah",
    motivation: isArabic
      ? "دعمك يساعدنا في الحفاظ على هذه المنصة ونشر المعرفة الإسلامية الصحيحة."
      : "Your support enables us to maintain and grow this platform of authentic Islamic knowledge.",
    choosePayment: isArabic ? "اختر وسيلة الدفع" : "Choose a Payment Method",
    oneTime: isArabic ? "مرة واحدة" : "One-Time",
    monthly: isArabic ? "شهرياً" : "Monthly",
    paypal: isArabic ? "أكمل عبر باي بال" : "Continue to PayPal",
    card: isArabic ? "أكمل الدفع بالبطاقة" : "Continue to Card Checkout",
    donating: isArabic ? "أنت تساهم بمبلغ:" : "You are donating:",
  };

  const handlePayPalRedirect = () => {
    window.open(
      `https://www.paypal.com/donate?business=your-paypal-email@example.com&currency_code=CAD&amount=${amountToSend}`,
      "_blank"
    );
  };

  return (
    <>
      <style>
        {`
          :root {
            --primary: #1f6f3e;
            --secondary: #2e8b57;
            --background: #f7f7f7;
            --card-bg: #ffffff;
            --accent-bg: #f0f4fa;
            --text-color: #2c3e50;
            --font-family: "Segoe UI", sans-serif;
          }

          body, html {
            margin: 0;
            padding: 0;
          }

          @media (max-width: 768px) {
            .contribute-container {
              flex-direction: column;
            }

            .card-details {
              width: 100%;
              margin-top: 20px;
            }
          }
        `}
      </style>

      <div style={styles.pageWrapper} dir={isArabic ? "rtl" : "ltr"}>
        <div className="contribute-container" style={styles.container}>
          <div style={styles.formSide}>
            <h1 style={styles.heading}>{t.heading}</h1>
            <p style={styles.motivation}>{t.motivation}</p>

            <h3 style={styles.subheading}>{t.choosePayment}</h3>
            <div style={styles.methodButtons}>
              <button onClick={handlePayPalRedirect} style={styles.iconButton}>
                <img src={paypalIcon} alt="PayPal" style={styles.iconImg} />
              </button>
              <button onClick={() => setSelectedMethod("card")} style={styles.iconButton}>
                <img src={cardIcon} alt="Card" style={styles.iconImg} />
              </button>
            </div>
          </div>

          {selectedMethod === "card" && (
            <div className="card-details" style={styles.cardSide}>
              <div style={styles.optionGroupWrapper}>
                <div style={styles.optionGroup}>
                  <button
                    onClick={() => setDonationType("one-time")}
                    style={donationType === "one-time" ? styles.optionActive : styles.optionInactive}
                  >
                    {t.oneTime}
                  </button>
                  <button
                    onClick={() => setDonationType("recurring")}
                    style={donationType === "recurring" ? styles.optionActive : styles.optionInactive}
                  >
                    {t.monthly}
                  </button>
                </div>
              </div>

              <div style={styles.amountButtons}>
                {[10, 25, 50].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount("");
                    }}
                    style={selectedAmount === amt && customAmount === "" ? styles.amountActive : styles.amountInactive}
                  >
                    ${amt}
                  </button>
                ))}
                <input
                  type="number"
                  placeholder={isArabic ? "أخرى" : "Other"}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  style={styles.customInput}
                />
              </div>

              <div style={styles.summary}>{t.donating} <strong>${amountToSend}</strong></div>
              <button
                onClick={() => handleStripeDonate({ donationType, amount: amountToSend })}
                style={styles.primaryButton}
              >
                {t.card}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  pageWrapper: {
    backgroundColor: "var(--background)",
    fontFamily: "var(--font-family)",
    minHeight: "69vh",
    padding: "23px 51px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "var(--card-bg)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    borderRadius: "0px",
    overflow: "hidden",
    maxWidth: "1000px",
    width: "100%",
  },
  formSide: {
    flex: 1,
    padding: "40px 30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  cardSide: {
    flex: 1,
    padding: "40px 30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#e9f5ec",
  },
  heading: {
    fontSize: "28px",
    color: "var(--text-color)",
    marginBottom: "10px",
  },
  motivation: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "25px",
  },
  subheading: {
    fontSize: "18px",
    color: "var(--text-color)",
    marginBottom: "12px",
  },
  methodButtons: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },
  iconButton: {
    border: "1px solid var(--primary)",
    borderRadius: "5px",
    backgroundColor: "#fff",
    padding: "9px 21px",
    cursor: "pointer",
  },
  iconImg: {
    width: "30px",
    height: "30px",
    objectFit: "contain",
  },
  optionGroupWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "15px",
  },
  optionGroup: {
    display: "inline-flex",
    borderRadius: "5px",
    overflow: "hidden",
    border: "1px solid var(--primary)",
  },
  optionActive: {
    backgroundColor: "var(--primary)",
    color: "white",
    padding: "9px 21px",
    border: "none",
    cursor: "pointer",
  },
  optionInactive: {
    backgroundColor: "#fff",
    color: "var(--text-color)",
    padding: "9px 21px",
    border: "none",
    cursor: "pointer",
  },
  amountButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "15px",
  },
  amountActive: {
    backgroundColor: "var(--primary)",
    color: "white",
    padding: "9px 21px",
    borderRadius: "5px",
    border: "none",
  },
  amountInactive: {
    backgroundColor: "#f1f1f1",
    color: "#333",
    padding: "9px 21px",
    borderRadius: "5px",
    border: "none",
  },
  customInput: {
    width: "80px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  summary: {
    fontSize: "16px",
    marginTop: "10px",
    marginBottom: "10px",
  },
  primaryButton: {
    backgroundColor: "var(--primary)",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Contribute;
