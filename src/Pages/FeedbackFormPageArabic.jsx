import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Header from "../Components/Home/Header";
import FeedbackForm from "../Components/FeedbackForm";

const ContributeP = () => {
  return (
    <>
      <Header title="FeedBack" />
      <Navbar
        dir="rtl"
        navItems={[
          { label: "الرئيسية", href: "/ar", internal: true },
          { label: "المكتبة", href: "/library_ar", internal: true },
          { label: "عن الموقع", href: "/about-us/ar", internal: true },
          { label: "شاركنا رأيك", href: "/feedback-ar", internal: true },
          { label: "ساهم", href: "/ar/contribute", internal: true },
        ]}
        languageSwitcher={{ label: "English", href: "/feedback" }}
      />
      <FeedbackForm lang="ar" />
      <Footer lang="arabic" />
    </>
  );
};

export default ContributeP;
