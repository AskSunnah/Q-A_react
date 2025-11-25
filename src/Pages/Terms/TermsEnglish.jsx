import React from 'react';
import Header from '../../Components/Home/Header';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import TermsContent from '../../Components/TermsContent';
import termsContent from '../../assets/Data/termsContent';

const TermsEnglish = () => {
  const data = termsContent.en;

  return (
    <>
      <style>{`
        /* Same global styles you use everywhere */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body, html { font-family: var(--font-family); background: var(--background); color: var(--text); line-height: 1.6; }
        .card { border-left: 5px solid var(--bg-color-header); }
      `}</style>

      <Header
        title="Terms & Conditions"
        subtitle="AskSunnah – Authentic Islamic Knowledge from Qur’an & Sunnah"
      />
<Navbar
  dir="ltr"
  navItems={[
    { label: "Home", href: "/", internal: true },
    { label: "Library", href: "/library", internal: true },
    { label: "About Us", href: "/about-us", internal: true },
    { label: "Feedback", href: "https://forms.gle/e5jGuDBJhZAyCP448", internal: false },
    { label: "Contribute", href: "/contribute", internal: false }
  ]}
  languageSwitcher={{ label: "العربية", href: "/ar/terms" }}
/>


      <TermsContent data={data} dir="ltr" />

      <Footer lang="en" />
    </>
  );
};

export default TermsEnglish;