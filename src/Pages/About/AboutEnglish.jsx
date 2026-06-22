import Header from "../../Components/Home/Header";
import AboutUs from "../../Components/About/AboutUs";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import aboutContent from "../../assets/Data/aboutContent";

const AboutEnglish = () => {
  const data = aboutContent.en;
  return (
    <>
      <Header
        title="About Us"
          subtitleLines={["Ask. Learn.", "Follow the Sunnah."]}
      />
      <Navbar
        dir="ltr"
        navItems={[
          { label: "Home", href: "/", internal: true },
          { label: "Library", href: "/library", internal: true },
          { label: "About Us", href: "/about-us", internal: true },
          { label: "Feedback", href: "/feedback", internal: true },
          { label: "Contribute", href: "/contribute", internal: true },
        ]}
        languageSwitcher={{ label: "العربية", href: "/about-us/ar" }}
      />
      <AboutUs data={data} dir="ltr" />
      <Footer lang="en" />
    </>
  );
};

export default AboutEnglish;
