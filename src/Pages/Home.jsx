import React, { useState } from 'react';

import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

import Header from '../Components/Home/Header';
import IntroSection from '../Components/Home/IntroSection';
import RecentAnswers from '../Components/Home/RecentAnswers';
import AskQuestionModal from '../Components/Home/AskQuestionModal';

import '../styles/homepage.css'; // Shared CSS file

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

 return (
  <>
    <Header />
    <Navbar />
    <main aria-label="Main Content Area">
      <IntroSection onOpenModal={() => setIsModalOpen(true)} />
      <RecentAnswers />
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
