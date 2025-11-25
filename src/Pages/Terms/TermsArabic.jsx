import React from 'react';
import Header from '../../Components/Home/Header';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import TermsContent from '../../Components/TermsContent';
import termsContent from '../../assets/Data/termsContent';

const TermsArabic = () => {
  const data = termsContent.ar;

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body, html { font-family: var(--font-family-ar, var(--font-family)); background: var(--background); color: var(--text); line-height: 1.8; }
        .card { border-right: 5px solid var(--bg-color-header); }
      `}</style>

      <Header
        title="الشروط والأحكام"
        subtitle="اسأل السنة – معرفة إسلامية أصيلة من القرآن والسنة"
        dir="rtl"
      />

    <Navbar
  dir="rtl"
  navItems={[
    { label: "الرئيسية", href: "/ar", internal: true },
    { label: "المكتبة", href: "/library_ar", internal: true },
    { label: "عن الموقع", href: "/about-us/ar", internal: true },
    { label: "شاركنا رأيك", href: "https://forms.gle/e5jGuDBJhZAyCP448", internal: false },
    { label: "ساهم", href: "/ar/contribute", internal: false }
  ]}
  languageSwitcher={{ label: "English", href: "/terms" }}
/>


      <TermsContent data={data} dir="rtl" />

      <Footer lang="ar" />
    </>
  );
};

export default TermsArabic;