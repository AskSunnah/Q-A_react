import Header from "../../Components/Home/Header";
import AboutUs from "../../Components/About/AboutUs";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import aboutContent from "../../assets/Data/aboutContent";

const AboutArabic = () => {
  const data = aboutContent.ar;
  return (
    <>
      <Header
        title="اسأل السنة"
       subtitleLines={["اسأل. تعلم.", "واتبع السنة."]}
        dir="rtl"
      />
      <Navbar
        dir="rtl"
        navItems={[
          { label: "الرئيسية", href: "/ar", internal: true },
          { label: "المكتبة", href: "/library_ar", internal: true },
          { label: "عن الموقع", href: "/about-us/ar", internal: true },
          { label: "شاركنا رأيك", href: "/feedback-ar", internal: false },
          { label: "ساهم", href: "/ar/contribute", internal: false },
        ]}
        languageSwitcher={{ label: "English", href: "/about-us" }}
      />
      <AboutUs data={data} dir="rtl" />
      <Footer lang="ar" />
    </>
  );
};

export default AboutArabic;
