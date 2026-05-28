import React, { useState } from "react";
import paypalIcon from "../../assets/paypal.png";
import cardIcon from "../../assets/card.png";
import { loadStripe } from "@stripe/stripe-js";
import { createCheckoutSession } from "../../api/stripe";

const stripePromise = loadStripe(
  "pk_live_51RlSlOBaaF6tLrTwrOKCypgsYNxh7MVwmpbfMhWRdjSFyZjFXzsuWEceF7R7B98X5ANbvsHba3kqfBQLXUdevC5L00FGZGI4JC",
);

const getAmount = (customAmount, selectedAmount) => {
  const amount =
    customAmount !== "" ? parseFloat(customAmount) : selectedAmount;
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
    heading: isArabic
      ? "ساهم في دعم منصة اسأل السنة"
      : "Contribute to AskSunnah",
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
      {maintenanceMsg && (
        <div className="bg-[#fff3cd] text-[#856404] p-4 text-center font-bold rounded-[6px] mb-[18px] border border-[#ffeeba] text-[17px]">
          Under Maintenance, please come back
        </div>
      )}

      {/* pageWrapper */}
      <div
        className="bg-[#f7f7f7] font-[Segoe_UI,sans-serif] min-h-[69vh] px-4 sm:px-8 md:px-[51px] py-[23px] flex justify-center items-center"
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* container */}
        <div className="flex flex-col md:flex-row bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-none overflow-hidden max-w-[1000px] w-full">
          {/* formSide */}
          <div className="flex-1 px-5 py-6 sm:px-7 sm:py-8 md:px-[30px] md:py-[40px]">
            <h1 className="text-[22px] sm:text-[25px] md:text-[28px] text-[#2c3e50] mb-[10px] font-bold">
              {t.heading}
            </h1>
            <p className="text-[15px] md:text-[16px] text-[#555] mb-[25px]">
              {t.motivation}
            </p>

            <h3 className="text-[16px] md:text-[18px] text-[#2c3e50] mb-[12px] font-bold">
              {t.choosePayment}
            </h3>

            {/* methodButtons */}
            <div className="flex gap-5 mb-5">
              <button
                onClick={handlePayPalRedirect}
                className="border border-[#ccc] rounded-[8px] bg-white px-[14px] py-[10px] cursor-pointer flex items-center justify-center transition-all duration-200 ease-in-out shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
              >
                <img
                  src={paypalIcon}
                  alt="PayPal"
                  className="w-6 h-6 object-contain"
                />
              </button>
              <button
                onClick={() => {
                  setSelectedMethod("card");
                  setMaintenanceMsg(false);
                }}
                className="border border-[#ccc] rounded-[8px] bg-white px-[14px] py-[10px] cursor-pointer flex items-center justify-center transition-all duration-200 ease-in-out shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
              >
                <img
                  src={cardIcon}
                  alt="Card"
                  className="w-6 h-6 object-contain"
                />
              </button>
            </div>
          </div>

          {/* cardSide */}
          {selectedMethod === "card" && (
            <div className="flex-1 px-5 py-6 sm:px-7 sm:py-8 md:px-[30px] md:py-[40px] bg-[var(--bg-light)] border-t md:border-t-0 md:border-l border-[#eee]">
              {/* optionGroupWrapper */}
              <div className="flex justify-center mb-[15px]">
                {/* optionGroup */}
                <div className="inline-flex rounded-[5px] overflow-hidden border border-[var(--bg-color-header)]">
                  <button
                    onClick={() => setDonationType("one-time")}
                    className={`px-4 sm:px-[21px] py-[9px] border-none cursor-pointer text-sm sm:text-base ${
                      donationType === "one-time"
                        ? "bg-[var(--bg-color-header)] text-white"
                        : "bg-white text-[#2c3e50]"
                    }`}
                  >
                    {t.oneTime}
                  </button>
                  <button
                    onClick={() => setDonationType("recurring")}
                    className={`px-4 sm:px-[21px] py-[9px] border-none cursor-pointer text-sm sm:text-base ${
                      donationType === "recurring"
                        ? "bg-[var(--bg-color-header)] text-white"
                        : "bg-white text-[#2c3e50]"
                    }`}
                  >
                    {t.monthly}
                  </button>
                </div>
              </div>

              {/* amountButtons */}
              <div className="flex flex-wrap gap-[10px] mb-[15px]">
                {[10, 25, 50].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount("");
                    }}
                    className={`px-4 sm:px-[21px] py-[9px] rounded-[5px] border-none cursor-pointer text-sm sm:text-base ${
                      selectedAmount === amt && customAmount === ""
                        ? "bg-[var(--bg-color-header)] text-white"
                        : "bg-[#f1f1f1] text-[#333]"
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
                <input
                  type="number"
                  min="1"
                  placeholder={isArabic ? "أخرى" : "Other"}
                  value={customAmount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || parseFloat(val) > 0) {
                      setCustomAmount(val);
                    }
                  }}
                  className="w-[80px] p-[10px] rounded-[5px] border border-[#ccc] text-sm sm:text-base"
                />
              </div>

              {/* summary */}
              <div className="text-[15px] md:text-[16px] mt-[10px] mb-[10px]">
                {t.donating} <strong>${amountToSend}</strong>
              </div>

              <input
                type="email"
                placeholder={
                  isArabic ? "أدخل بريدك الإلكتروني" : "Enter your email"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-[10px] mb-[10px] rounded-[5px] border border-[#ccc] text-sm sm:text-base"
              />

              <button
                onClick={handleStripeDonate}
                className="bg-[var(--bg-color-header)] text-white px-6 py-3 border-none rounded-[5px] text-[15px] md:text-[16px] cursor-pointer w-full"
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

export default Contribute;
