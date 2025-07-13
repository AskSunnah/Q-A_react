
import Header from '../../Components/About/Header';
import AboutUs from "../../Components/About/AboutUs";
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import aboutContent from '../../assets/Data/aboutContent';

const AboutArabic = () => {
    const data = aboutContent.ar;
    return (
        <>
            {/* Use same inline style here if needed or keep separate */}
            <style>{`
        :root {
          --primary: #1f6f3e;
          --secondary: #2e8b57;
          --background: #f7f7f7;
          --card-bg: #ffffff;
          --text: #2c3e50;
          --font: 'Segoe UI', sans-serif;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body, html {
          font-family: var(--font);
          background: var(--background);
          color: var(--text);
          line-height: 1.6;
        }
        header.hero {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: #fff;
          padding: 4rem 1rem;
          text-align: center;
        }
        header.hero h1 { font-size: 2.75rem; margin-bottom: .5rem; }
        header.hero p { font-size: 1.1rem; opacity: .9; }
        main.container {
          max-width: 900px;
          margin: 2rem auto;
          padding: 0 1rem;
        }
        .card {
          background: var(--card-bg);
          border-right: 5px solid var(--primary);
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
          margin-bottom: 1.5rem;
        }
        .card h2 { color: var(--primary); margin-bottom: .75rem; }
        .card ul { list-style: disc inside; margin-top: .5rem; }
        .dua-section {
          background: var(--card-bg);
          border-radius: 8px;
          padding: 1.25rem;
          margin-top: 2rem;
          font-style: italic;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          text-align: center;
          font-size: 1.05rem;
        }
          .custom-footer {
      background: linear-gradient(to top, #1f6f3e, #2e8b57 98%, transparent);
      color: white;
      padding: 2rem 1rem;
      text-align: center;
      font-family: "Arial", sans-serif;
      margin-top: 3rem;
    }

    .footer-icons {
      display: flex;
      justify-content: center;
      gap: 1.2rem;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .footer-handle {
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
    }

    .footer-button {
      display: inline-block;
      background-color: white;
      color: #1a1a1a;
      padding: 0.4rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      text-decoration: none;
      font-weight: bold;
      transition: background-color 0.3s;
      margin-bottom: 1.5rem;
    }

    .footer-button:hover {
      background-color: #e2e2e2;
    }

    .footer-share {
      margin-top: 1.5rem;
      font-size: 0.9rem;
      color: #cccccc;
      font-style: italic;
    }

    .social-icon {
      display: inline-block;
      transition: transform 0.3s ease, filter 0.3s ease;
    }

    .social-icon:hover {
      transform: scale(1.2);
      filter: drop-shadow(0 0 5px white);
    }

    @media (max-width: 600px) {
      footer svg {
        width: 24px;
        height: 24px;
      }

      footer a.social-icon {
        margin-bottom: 10px;
      }
    }
      `}</style>
            <Header title={data.headerTitle} subtitle={data.headerSubtitle} dir="rtl" />
            <Navbar
                dir="rtl"
                navItems={[
                    { label: "الرئيسية", href: "/ar", internal: true },
                    { label: "المكتبة", href: "/library_ar", internal: true },
                    { label: "عن الموقع", href: "/about-us/ar", internal: false },
                    { label: "شاركنا رأيك", href: "https://forms.gle/e5jGuDBJhZAyCP448", internal: false },
                    { label: "ساهم", href: "https://www.paypal.me/asksunnah", internal: false }
                ]}
                languageSwitcher={{ label: "English", href: "/about-us" }}
            />
            <AboutUs data={data} dir="rtl" />
            <Footer lang="ar" />

        </>
    );
};

export default AboutArabic;
