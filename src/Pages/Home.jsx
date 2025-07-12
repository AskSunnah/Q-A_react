import React, { useState } from 'react';

import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

import Header from '../Components/Home/Header';
import IntroSection from '../Components/Home/IntroSection';
import RecentAnswers from '../Components/Home/RecentAnswers';
import AskQuestionModal from '../Components/Home/AskQuestionModal';

import { fetchAllFatwas } from "../api/fatwa"

import '../styles/homepage.css'; // Shared CSS file

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Header
        title="Ask Sunnah"
        subtitle="Authentic answers from Dr. Sheikh Falah Kurkully – grounded in Qur’an and Sunnah"
      />
      <Navbar
        dir="ltr"
        navItems={[
          { label: "Home", href: "/", internal: true },
          { label: "Library", href: "/library", internal: true },
          { label: "About Us", href: "/about-us", internal: true },
          { label: "Feedback", href: "https://forms.gle/e5jGuDBJhZAyCP448", internal: false },
          { label: "Contribute", href: "https://www.paypal.me/asksunnah", internal: false }
        ]}
        languageSwitcher={{ label: "العربية", href: "/ar" }}
      />



      <main aria-label="Main Content Area">
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
      <Footer />
    </>
  );
}

export default Home;
