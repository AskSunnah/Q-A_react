// // ------------------------------
// // FRONTEND - Contribute.jsx
// // Location: src/Components/Contribute.jsx
// // ------------------------------

// import React, { useState } from "react";
// import paypalIcon from "../assets/paypal.png";
// import cardIcon from "../assets/card.png";
// // import donateBanner from "../assets/donate-banner.jpg"; // Optional banner image
// import { loadStripe } from "@stripe/stripe-js";
// import Navbar from "../Components/Navbar"; // Assuming this path is correct

// const stripePromise = loadStripe("your-publishable-key");

// const getAmount = (customAmount, selectedAmount) => {
//   const amount = customAmount !== "" ? parseFloat(customAmount) : selectedAmount;
//   return Math.max(1, amount);
// };

// const handleStripeDonate = async ({ donationType, amount }) => {
//   const stripe = await stripePromise;
//   const response = await fetch(`/api/donate/create-${donationType}-session`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ amount }),
//   });
//   const data = await response.json();
//   if (data.url) {
//     window.location.href = data.url;
//   } else {
//     alert("Failed to initiate payment.");
//   }
// };

// const Contribute = ({ lang = "en" }) => {
//   const [selectedMethod, setSelectedMethod] = useState(null);
//   const [donationType, setDonationType] = useState("one-time");
//   const [selectedAmount, setSelectedAmount] = useState(10);
//   const [customAmount, setCustomAmount] = useState("");

//   const amountToSend = getAmount(customAmount, selectedAmount);
//   const isArabic = lang === "ar";

//   const t = {
//     heading: isArabic ? "ساهم في دعم منصة اسأل السنة" : "Contribute to AskSunnah",
//     motivation: isArabic
//       ? "دعمك يساعدنا في الحفاظ على هذه المنصة ونشر المعرفة الإسلامية الصحيحة."
//       : "Your support enables us to maintain and grow this platform of authentic Islamic knowledge.",
//     choosePayment: isArabic ? "اختر وسيلة الدفع" : "Choose a Payment Method",
//     oneTime: isArabic ? "مرة واحدة" : "One-Time",
//     monthly: isArabic ? "شهرياً" : "Monthly",
//     paypal: isArabic ? "أكمل عبر باي بال" : "Continue to PayPal",
//     card: isArabic ? "أكمل الدفع بالبطاقة" : "Continue to Card Checkout",
//     donating: isArabic ? "أنت تساهم بمبلغ:" : "You are donating:",
//   };

//   return (
//     <>
//       <style>
//         {`
//           :root {
//             --primary: #1f6f3e;
//             --secondary: #2e8b57;
//             --background: #f7f7f7;
//             --card-bg: #ffffff;
//             --accent-bg: #f0f4fa;
//             --text-color: #2c3e50;
//             --font-family: "Segoe UI", sans-serif;
//           }
//         `}
//       </style>

//       <Navbar
//         dir={isArabic ? "rtl" : "ltr"}
//         navItems={[
//           { label: isArabic ? "الرئيسية" : "Home", href: "/", internal: true },
//           { label: isArabic ? "المكتبة" : "Library", href: "/library", internal: true },
//           { label: isArabic ? "عن الموقع" : "About Us", href: "/about-us", internal: true },
//           { label: isArabic ? "ملاحظات" : "Feedback", href: "https://forms.gle/e5jGuDBJhZAyCP448", internal: false },
//           { label: isArabic ? "ساهم" : "Contribute", href: isArabic ? "/ar/contribute" : "/contribute", internal: true }
//         ]}
//         languageSwitcher={{ label: isArabic ? "English" : "العربية", href: isArabic ? "/contribute" : "/ar/contribute" }}
//       />

//       <div style={styles.pageWrapper} dir={isArabic ? "rtl" : "ltr"}>
//         <div style={styles.container}>
//           <div style={styles.imageSide}>
//             {/* <img src={donateBanner} alt="Donate Banner" style={styles.bannerImg} /> */}
//           </div>

//           <div style={styles.formSide}>
//             <h1 style={styles.heading}>{t.heading}</h1>
//             <p style={styles.motivation}>{t.motivation}</p>

//             <h3 style={styles.subheading}>{t.choosePayment}</h3>
//             <div style={styles.methodButtons}>
//               <button onClick={() => setSelectedMethod("paypal")} style={styles.iconButton}>
//                 <img src={paypalIcon} alt="PayPal" style={{ ...styles.iconImg, width: "30px", height: "30px" }} />
//               </button>
//               <button onClick={() => setSelectedMethod("card")} style={styles.iconButton}>
//                 <img src={cardIcon} alt="Card" style={{ ...styles.iconImg, width: "30px", height: "30px" }} />
//               </button>
//             </div>

//             {selectedMethod === "paypal" && (
//               <form
//                 action="https://www.paypal.com/donate"
//                 method="post"
//                 target="_blank"
//                 style={{ marginTop: "20px" }}
//               >
//                 <input type="hidden" name="business" value="your-paypal-email@example.com" />
//                 <input type="hidden" name="currency_code" value="CAD" />
//                 <input type="hidden" name="amount" value={amountToSend} />
//                 <button type="submit" style={styles.primaryButton}>{t.paypal}</button>
//               </form>
//             )}

//             {selectedMethod === "card" && (
//               <div style={{ marginTop: "20px" }}>
//                 <div style={styles.optionGroup}>
//                   <button
//                     onClick={() => setDonationType("one-time")}
//                     style={donationType === "one-time" ? styles.optionActive : styles.optionInactive}
//                   >
//                     {t.oneTime}
//                   </button>
//                   <button
//                     onClick={() => setDonationType("recurring")}
//                     style={donationType === "recurring" ? styles.optionActive : styles.optionInactive}
//                   >
//                     {t.monthly}
//                   </button>
//                 </div>

//                 <div style={styles.amountButtons}>
//                   {[10, 25, 50].map((amt) => (
//                     <button
//                       key={amt}
//                       onClick={() => {
//                         setSelectedAmount(amt);
//                         setCustomAmount("");
//                       }}
//                       style={selectedAmount === amt && customAmount === "" ? styles.amountActive : styles.amountInactive}
//                     >
//                       ${amt}
//                     </button>
//                   ))}
//                   <input
//                     type="number"
//                     placeholder={isArabic ? "أخرى" : "Other"}
//                     value={customAmount}
//                     onChange={(e) => setCustomAmount(e.target.value)}
//                     style={styles.customInput}
//                   />
//                 </div>

//                 <div style={styles.summary}>{t.donating} <strong>${amountToSend}</strong></div>
//                 <button
//                   onClick={() => handleStripeDonate({ donationType, amount: amountToSend })}
//                   style={styles.primaryButton}
//                 >
//                   {t.card}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// const styles = {
//   pageWrapper: {
//     backgroundColor: "var(--background)",
//     fontFamily: "var(--font-family)",
//     minHeight: "100vh",
//     padding: "40px 20px",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   container: {
//     display: "flex",
//     flexDirection: "row",
//     backgroundColor: "var(--card-bg)",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//     borderRadius: "0px",
//     overflow: "hidden",
//     maxWidth: "900px",
//     width: "100%",
//   },
//   imageSide: {
//     flex: 1,
//     backgroundColor: "var(--accent-bg)",
//   },
//   bannerImg: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//   },
//   formSide: {
//     flex: 1,
//     padding: "40px 30px",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//   },
//   heading: {
//     fontSize: "28px",
//     color: "var(--text-color)",
//     marginBottom: "10px",
//   },
//   motivation: {
//     fontSize: "16px",
//     color: "#555",
//     marginBottom: "25px",
//   },
//   subheading: {
//     fontSize: "18px",
//     color: "var(--text-color)",
//     marginBottom: "12px",
//   },
//   methodButtons: {
//     display: "flex",
//     gap: "20px",
//     marginBottom: "20px",
//   },
//   iconButton: {
//     border: "1px solid var(--primary)",
//     borderRadius: "0px",
//     backgroundColor: "#fff",
//     padding: "6px",
//     cursor: "pointer",
//   },
//   iconImg: {
//     objectFit: "contain",
//   },
//   optionGroup: {
//     display: "flex",
//     gap: "10px",
//     marginBottom: "15px",
//   },
//   optionActive: {
//     backgroundColor: "var(--primary)",
//     color: "white",
//     padding: "8px 20px",
//     borderRadius: "0px",
//     border: "none",
//     cursor: "pointer",
//   },
//   optionInactive: {
//     backgroundColor: "#ddd",
//     color: "#333",
//     padding: "8px 20px",
//     borderRadius: "0px",
//     border: "none",
//     cursor: "pointer",
//   },
//   amountButtons: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "10px",
//     marginBottom: "15px",
//   },
//   amountActive: {
//     backgroundColor: "var(--primary)",
//     color: "white",
//     padding: "10px 16px",
//     borderRadius: "0px",
//     border: "none",
//   },
//   amountInactive: {
//     backgroundColor: "#f1f1f1",
//     color: "#333",
//     padding: "10px 16px",
//     borderRadius: "0px",
//     border: "none",
//   },
//   customInput: {
//     width: "80px",
//     padding: "10px",
//     borderRadius: "0px",
//     border: "1px solid #ccc",
//   },
//   summary: {
//     fontSize: "16px",
//     marginTop: "10px",
//     marginBottom: "10px",
//   },
//   primaryButton: {
//     backgroundColor: "var(--primary)",
//     color: "white",
//     padding: "12px 24px",
//     border: "none",
//     borderRadius: "0px",
//     fontSize: "16px",
//     cursor: "pointer",
//   },
// };

// export default Contribute;


// ------------------------------
// FRONTEND - ContributePageEn.jsx
// ------------------------------

import React from "react";
// import Header from "../Components/Contribute/Header";
import Navbar from "../Components/Navbar";
import Contribute from "../Components/Contribute/Contribute";
import Header from '../Components/Home/Header';

const ContributeP = () => {


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

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-family);
      background-color: var(--background);
      color: var(--text-color);
      line-height: 1.6;
    }

    header {
      background-color: var(--primary);
      color: #fff;
      padding: 2.5rem 1.25rem;
      text-align: center;
    }

    header h1 {
      font-size: 2.5rem;
    }

    header p {
      margin-top: 0.5rem;
      font-size: 1.1rem;
    }

    main {
      max-width: 900px;
      margin: 2rem auto;
      padding: 1.5rem;
      background: var(--card-bg);
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    section {
      margin-bottom: 2rem;
    }

    h2, h3 {
      color: var(--primary);
    }

    
    

     @media (max-width: 768px) {
      header h1 {
        font-size: 1.8rem;
      }

      header {
        padding: 2rem 1rem;
      }

      header p {
        font-size: 1rem;
      }

   
      
    }

   

  
    
  `}
            </style>
            <Header
                title="Contribute to AskSunnah"
            // subtitle="Authentic answers from Dr. Sheikh Falah Kurkully – grounded in Qur’an and Sunnah"
            />
            <Navbar
                dir="ltr"
                navItems={[
                    { label: "Home", href: "/", internal: true },
                    { label: "Library", href: "/library", internal: true },
                    { label: "About Us", href: "/about-us", internal: true },
                    { label: "Feedback", href: "https://forms.gle/e5jGuDBJhZAyCP448", internal: false },
                    { label: "Contribute", href: "/contribute", internal: true }
                ]}
                languageSwitcher={{ label: "العربية", href: "/ar/contribute" }}
            />
            <Contribute lang="en" />
        </>
    );
};

export default ContributeP;
