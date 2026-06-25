import Navbar from "../Components/common/Navbar";
import Footer from "../Components/common/Footer";
import Header from "../Components/Home/Header";
import FeedbackForm from "../Components/FeedbackForm";

const ContributeP = () => {
  return (
    <>
      <Header title=" نقدر رأيك" 
        buttonLabel="أرسل سؤالك"
        buttonLangLink="/"
        onOpenModal={() => setIsModalOpen(true)}
        dir="rtl"
        />
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
