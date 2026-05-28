import React from "react";
import { Link } from "react-router-dom";

const Footer = ({ lang = "en" }) => {
  const isArabic = lang === "ar";

  const t = {
    logoText: isArabic ? "اسأل السنة" : "AskSunnah",
    tagline: isArabic
      ? "منصة للمعرفة الإسلامية المبنية على القرآن والسنة"
      : "A platform for Islamic knowledge based on the Qur’an and Sunnah.",
    copyright: isArabic
      ? "© 2025 اسأل السنة. جميع الحقوق محفوظة."
      : "© 2025 AskSunnah. All rights reserved.",
    terms: isArabic ? "الشروط والأحكام" : "Terms & Conditions",
    termsLink: isArabic ? "/ar/terms" : "/terms",
    dir: isArabic ? "rtl" : "ltr",
  };

  const socials = [
    {
      href: "https://www.youtube.com/@falah.kurkully",
      label: "YouTube",
      svg: (
        <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
          <path d="M21.8 8.001a2.752 2.752 0 0 0-1.938-1.938C18.23 6 12 6 12 6s-6.23 0-7.862.063A2.752 2.752 0 0 0 2.2 8.001 28.914 28.914 0 0 0 2 12a28.914 28.914 0 0 0 .2 3.999 2.752 2.752 0 0 0 1.938 1.938C5.77 18 12 18 12 18s6.23 0 7.862-.063a2.752 2.752 0 0 0 1.938-1.938A28.914 28.914 0 0 0 22 12a28.914 28.914 0 0 0-.2-3.999zM10 15V9l5 3-5 3z" />
        </svg>
      ),
    },
    {
      href: "https://www.tiktok.com/@falah.kurkully",
      label: "TikTok",
      svg: (
        <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
          <path d="M16.5 1a5.51 5.51 0 0 0 4.5 2V6a7.5 7.5 0 0 1-4.5-1.5V14a6.5 6.5 0 1 1-6.5-6.5c.5 0 1 .07 1.5.2v2.16a3.5 3.5 0 1 0 2 3.14V1h3z" />
        </svg>
      ),
    },
    {
      href: "https://instagram.com/falah.kurkully",
      label: "Instagram",
      svg: (
        <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
          <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm5 2.5A5.5 5.5 0 0 0 6.5 12 5.5 5.5 0 0 0 12 17.5 5.5 5.5 0 0 0 17.5 12 5.5 5.5 0 0 0 12 6.5zm0 2A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5zm4.75-2a.75.75 0 1 0 .75.75.75.75 0 0 0-.75-.75z" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      className="relative overflow-hidden text-white text-center px-4 sm:px-6 pt-6 pb-4"
      style={{
        background:
          "linear-gradient(180deg, #e1cb57 0%, #d0b640 30%, #c3a421 65%, #a67f0f 100%)",
        fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
        direction: t.dir,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[15px] bg-gradient-to-b from-white/20 to-transparent" />

      <div className="flex flex-col items-center text-center">
        {/* Logo */}
        <h2 className="font-bold text-[1.5rem] sm:text-[2rem] mb-2 text-white">
          {t.logoText}
        </h2>

        {/* Tagline */}
        <p className="text-[0.85rem] sm:text-[1rem] text-[#f0f0f0] mb-4 px-2 sm:px-0">
          {t.tagline}
        </p>

        {/* Social icons */}
        <div className="flex justify-center gap-4 sm:gap-5 flex-wrap items-center mb-2">
          {socials.map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              title={s.label}
              className="
                inline-block
                transition-transform duration-300 ease-in-out
                hover:scale-125
                hover:drop-shadow-[0_0_5px_white]
                [&_svg]:w-6
                [&_svg]:h-6
                sm:[&_svg]:w-7
                sm:[&_svg]:h-7
              "
            >
              {s.svg}
            </a>
          ))}
        </div>

        {/* Footer bottom */}
        <div className="border-t border-white/20 mt-6 pt-4 text-[0.75rem] sm:text-[0.85rem] text-[#cccccc] px-2">
          <span>{t.copyright}</span>
          <span className="mx-2">|</span>
          <Link
            to={t.termsLink}
            className="text-[#cccccc] no-underline hover:underline"
          >
            {t.terms}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
