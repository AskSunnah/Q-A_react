import { useState } from "react";

import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import Header from "../../Components/Home/Header";
import IntroSection from "../../Components/Home/IntroSection";
import RecentAnswers from "../../Components/Home/RecentAnswers";
import AskQuestionModal from "../../Components/Home/AskQuestionModal";
import { fetchAllFatwas } from "../../api/fatwa";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Header
        title="Ask Sunnah"
        subtitle="Authentic answers from Dr. Sheikh Falah Kurkully , grounded in Qur'an and Sunnah"
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
        languageSwitcher={{ label: "العربية", href: "/ar" }}
      />

      <main
        aria-label="Main Content Area"
        className="
          max-w-[900px] mx-auto my-8 px-6 py-6
          bg-[var(--bg-main)] text-[var(--text-main)]
          rounded-[10px] shadow-[2px_3px_12px_rgba(0,0,0,0.14)]
          [&>section]:mb-8
          [&_h2]:text-[var(--bg-color-header)] [&_h3]:text-[var(--bg-color-header)]
          max-md:px-4 max-md:py-4 max-md:mx-4 max-md:bg-white max-md:rounded-none max-md:shadow-none
        "
      >
        <IntroSection
          heading="Ask a Question!"
          description="Have a question about Islam? Submit it and get a response directly from Dr. Sheikh Falah Kurkully, based on one clear opinion from trusted scholars."
          buttonLabel="Submit Your Question"
          buttonLangLink="/ar/"
          onOpenModal={() => setIsModalOpen(true)}
          lang="ltr"
        />

        <RecentAnswers
          fetchFatwas={fetchAllFatwas}
          sectionTitle="Recent Answers"
          searchPlaceholder="Search..."
          questionLabel="Q"
          direction="ltr"
        />

        <AskQuestionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </main>

      <Footer lang="en" />
    </>
  );
}

export default Home;
