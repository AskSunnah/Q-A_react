import Navbar from "../Components/common/Navbar";
import Footer from "../Components/common/Footer";
import Header from "../Components/Home/Header";
import FeedbackForm from "../Components/FeedbackForm";

const ContributeP = () => {
  return (
    <>
      <Header
        title="FeedBack"
        buttonLabel="Ask a Question"
        buttonLangLink="/ar"
        onOpenModal={() => setIsModalOpen(true)}
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
        languageSwitcher={{ label: "العربية", href: "/feedback-ar" }}
      />
      <FeedbackForm lang="en" />
      <Footer />
    </>
  );
};

export default ContributeP;
