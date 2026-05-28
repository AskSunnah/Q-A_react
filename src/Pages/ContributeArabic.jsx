// ------------------------------
// FRONTEND - ContributePageAr.jsx
// ------------------------------

import React from "react";
import Navbar from "../Components/Navbar";
import Contribute from "../Components/Contribute/Contribute";
import Header from "../Components/Home/Header";

const ContributePageAr = () => {
  return (
    <>
      <Header title="ساهم معنا" dir="rtl" />
      <Navbar
        dir="rtl"
        navItems={[
          { label: "الرئيسية", href: "/ar", internal: true },
          { label: "المكتبة", href: "/library_ar", internal: true },
          { label: "عن الموقع", href: "/about-us/ar", internal: true },
          { label: "شاركنا رأيك", href: "/feedback-ar", internal: true },
          { label: "ساهم", href: "/ar/contribute", internal: true },
        ]}
        languageSwitcher={{ label: "English", href: "/contribute" }}
      />
      <Contribute lang="ar" />
    </>
  );
};

export default ContributePageAr;
