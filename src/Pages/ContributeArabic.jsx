// ------------------------------
// FRONTEND - ContributePageAr.jsx
// ------------------------------

import React from "react";
import Header from "../Components/Contribute/Header";
import Navbar from "../Components/Navbar";
import Contribute from "../Components/Contribute/Contribute";

const ContributePageAr = () => {


    return (
        <>
            <Header lang="ar" />
            <Navbar
                dir="rtl"
                navItems={[
                    { label: "الرئيسية", href: "/ar", internal: true },
                    { label: "المكتبة", href: "/library_ar", internal: true },
                    { label: "عن الموقع", href: "/about-us/ar", internal: false },
                    { label: "شاركنا رأيك", href: "https://forms.gle/e5jGuDBJhZAyCP448", internal: false },
                    { label: "ساهم", href: "https://www.paypal.me/asksunnah", internal: false }
                ]}
                languageSwitcher={{ label: "English", href: "/" }}
            />
            <Contribute lang="ar" />
        </>
    );
};

export default ContributePageAr;
