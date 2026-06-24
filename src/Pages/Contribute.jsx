// ------------------------------
// FRONTEND - ContributePageEn.jsx
// ------------------------------

import React from "react";
import Navbar from "../Components/Navbar";
import Contribute from "../Components/Contribute/Contribute";
import Header from "../Components/Home/Header";

const ContributeP = () => {
  return (
    <>
      <Header title="Contribute to AskSunnah"  buttonLabel="Ask a Question"
        buttonLangLink="/ar"
        onOpenModal={() => setIsModalOpen(true)} />
      <Navbar
        dir="ltr"
        navItems={[
          { label: "Home", href: "/", internal: true },
          { label: "Library", href: "/library", internal: true },
          { label: "About Us", href: "/about-us", internal: true },
          { label: "Feedback", href: "/feedback", internal: true },
          { label: "Contribute", href: "/contribute", internal: true },
        ]}
        languageSwitcher={{ label: "العربية", href: "/ar/contribute" }}
      />
      <Contribute lang="en" />
    </>
  );
};

export default ContributeP;
