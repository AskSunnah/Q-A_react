
import Header from '../../Components/Home/Header';
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
          border-right: 5px solid var(--bg-color-header);
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
                title="اسأل السنة"
                subtitle="احصل على إجابات شرعية موثوقة من الشيخ الدكتور فلاح كركولي — مستندة من القرآن والسنة (نسخة تجريبية)"
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
                languageSwitcher={{ label: "English", href: "/about-us" }}
            />
            <AboutUs data={data} dir="rtl" />
            <Footer lang="ar" />

        </>
    );
};

export default AboutArabic;
