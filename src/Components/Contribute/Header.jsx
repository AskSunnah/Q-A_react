import React from "react";
import donateBanner from "../../assets/banner.jpg"; // Adjust path as needed

const Header = ({ lang = "en" }) => {
  const headingText = lang === "ar" ? "ساهم معنا" : "Contribute";

  return (
    <div style={{ position: "relative", width: "100%", textAlign: "center" }}>
      <img
        src={donateBanner}
        alt={headingText}
        style={{
          width: "100%",
          maxHeight: "170px",
          objectFit: "cover",
          filter: "brightness(0.5)", // dim the image
        }}
      />

      <h1
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          fontSize: "32px",
          fontWeight: "bold",
          fontFamily: `"Segoe UI", sans-serif`,
          textShadow: "1px 1px 4px rgba(0, 0, 0, 0.6)",
          margin: 0,
          direction: lang === "ar" ? "rtl" : "ltr",
        }}
      >
        {headingText}
      </h1>
    </div>
  );
};

export default Header;
