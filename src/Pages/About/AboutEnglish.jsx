
// import Header from '../../Components/About/Header';
import Header from '../../Components/Home/Header';
import AboutUs from "../../Components/About/AboutUs";
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import aboutContent from '../../assets/Data/aboutContent';

const AboutEnglish = () => {
  const data = aboutContent.en;
  return (
    <>
      {/* Use same inline style here if needed or keep separate */}
      <style>{`
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body, html {
          font-family: var(--font-family);
          background: var(--background);
          color: var(--text);
          line-height: 1.6;
        }
        
        
        main.container {
          max-width: 900px;
          margin: 2rem auto;
          padding: 0 1rem;
        }
        .card {
          background: var(--bg-main);
          border-left: 5px solid var(--bg-color-header);
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
          margin-bottom: 1.5rem;
        }
        .card h2 { color: var(--text-accent); margin-bottom: .75rem; }
        .card ul { list-style: disc inside; margin-top: .5rem; }
        .dua-section {
          background: var(--bg-main);
          border-radius: 8px;
          padding: 1.25rem;
          margin-top: 2rem;
          font-style: italic;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          text-align: center;
          font-size: 1.05rem;
        }


      `}</style>
      <Header
        title="About Us"
        subtitle="Authentic answers from Dr. Sheikh Falah Kurkully – grounded in Qur’an and Sunnah"
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
        languageSwitcher={{ label: "العربية", href: "/about-us/ar" }}
      />
      <AboutUs data={data} dir="ltr" />
      <Footer lang="en" />

    </>
  );
};

export default AboutEnglish;
