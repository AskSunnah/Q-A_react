import React from "react";
import donateBanner from "../../assets/banner.jpg";

const Header = ({ lang = "en" }) => {
  const headingText = lang === "ar" ? "ساهم معنا" : "Contribute";

  return (
    <div className="relative w-full text-center">
      <img
        src={donateBanner}
        alt={headingText}
        className="
          w-full
          max-h-[170px]
          object-cover
          brightness-50
        "
      />

      <h1
        className="
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2

          text-white
          font-bold
          font-[Segoe_UI,sans-serif]

          text-[1.5rem]
          sm:text-[2rem]
          md:text-[2.25rem]

          m-0
          text-center

          drop-shadow-[1px_1px_4px_rgba(0,0,0,0.6)]
        "
        style={{
          direction: lang === "ar" ? "rtl" : "ltr",
        }}
      >
        {headingText}
      </h1>
    </div>
  );
};

export default Header;
