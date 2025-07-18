import React, { useState } from "react";
import paypalIcon from "../../assets/paypal.png";
import cardIcon from "../../assets/card.png";
import { loadStripe } from "@stripe/stripe-js";
import { createCheckoutSession } from "../../api/stripe";

const stripePromise = loadStripe("pk_live_51RlSlOBaaF6tLrTwrOKCypgsYNxh7MVwmpbfMhWRdjSFyZjFXzsuWEceF7R7B98X5ANbvsHba3kqfBQLXUdevC5L00FGZGI4JC");

const getAmount = (customAmount, selectedAmount) => {
  const amount = customAmount !== "" ? parseFloat(customAmount) : selectedAmount;
  return Math.max(1, amount);
};

const Contribute = ({ lang = "en" }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [donationType, setDonationType] = useState("one-time");
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState("");
  const [email, setEmail] = useState("");
  const [maintenanceMsg, setMaintenanceMsg] = useState(false);

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
    window.open("https://www.paypal.me/asksunnah", "_blank");
  };

  const handleStripeDonate = async () => {
    if (!email) {
      alert("Please enter your email before proceeding.");
      return;
    }

    const data = await createCheckoutSession({
      email,
      amount: amountToSend,
      isRecurring: donationType === "recurring",
    });

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .contribute-container {
            flex-direction: column !important;
          }
          .contribute-formSide,
          .contribute-cardSide {
            width: 100% !important;
            padding: 20px !important;
          }
          .contribute-cardSide {
            margin-top: 10px;
          }
        }
      `}</style>
      {maintenanceMsg && (
      <div style={{
        background: "#fff3cd",
        color: "#856404",
        padding: "16px",
        textAlign: "center",
        fontWeight: "bold",
        borderRadius: "6px",
        marginBottom: "18px",
        border: "1px solid #ffeeba",
        fontSize: "17px",
  }}>
      Under Maintenance, please come back
  </div>
)}
      <div style={styles.pageWrapper} dir={isArabic ? "rtl" : "ltr"}>
        <div className="contribute-container" style={styles.container}>
          <div className="contribute-formSide" style={styles.formSide}>
            <h1 style={styles.heading}>{t.heading}</h1>
            <p style={styles.motivation}>{t.motivation}</p>

            <h3 style={styles.subheading}>{t.choosePayment}</h3>
            <div style={styles.methodButtons}>
              <button onClick={handlePayPalRedirect} style={styles.iconButton}>
                <img src={paypalIcon} alt="PayPal" style={styles.iconImg} />
              </button>
              <button onClick={() => {setSelectedMethod("card");
              setMaintenanceMsg(true); }} style={styles.iconButton}>
                <img src={cardIcon} alt="Card" style={styles.iconImg} />
              </button>
            </div>
          </div>

          {selectedMethod === "card" && (
            <div className="contribute-cardSide" style={styles.cardSide}>
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

              <div style={styles.summary}>
                {t.donating} <strong>${amountToSend}</strong>
              </div>

              <input
                type="email"
                placeholder={isArabic ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.emailInput}
              />

              <button onClick={handleStripeDonate} style={styles.primaryButton}>
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
    backgroundColor: "#f7f7f7",
    fontFamily: "Segoe UI, sans-serif",
    minHeight: "69vh",
    padding: "23px 51px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    borderRadius: "0px",
    overflow: "hidden",
    maxWidth: "1000px",
    width: "100%",
    flexWrap: "wrap",
  },
  formSide: {
    flex: 1,
    padding: "40px 30px",
  },
  cardSide: {
    flex: 1,
    padding: "40px 30px",
    backgroundColor: "#e9f5ec",
  },
  heading: {
    fontSize: "28px",
    color: "#2c3e50",
    marginBottom: "10px",
  },
  motivation: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "25px",
  },
  subheading: {
    fontSize: "18px",
    color: "#2c3e50",
    marginBottom: "12px",
  },
  methodButtons: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },
  iconButton: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
    padding: "10px 14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease-in-out",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  iconImg: {
    width: "24px",
    height: "24px",
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
    border: "1px solid #1f6f3e",
  },
  optionActive: {
    backgroundColor: "#1f6f3e",
    color: "white",
    padding: "9px 21px",
    border: "none",
    cursor: "pointer",
  },
  optionInactive: {
    backgroundColor: "#fff",
    color: "#2c3e50",
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
    backgroundColor: "#1f6f3e",
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
  emailInput: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  summary: {
    fontSize: "16px",
    marginTop: "10px",
    marginBottom: "10px",
  },
  primaryButton: {
    backgroundColor: "#1f6f3e",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
  },
};

export default Contribute;
