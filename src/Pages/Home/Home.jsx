import { useState } from 'react';

import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import Header from '../../Components/Home/Header';
import IntroSection from '../../Components/Home/IntroSection';
import RecentAnswers from '../../Components/Home/RecentAnswers';
import AskQuestionModal from '../../Components/Home/AskQuestionModal';
import { fetchAllFatwas } from "../../api/fatwa";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <style>
  {`
    
* {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
     

    }

    body {
      font-family: var(--font-family);
      background-color: white
      line-height: 1.6;

    }
    main {
      max-width: 900px;
      margin: 2rem auto;
      padding: 1.5rem;
      background: var(--bg-main);
      border-radius: 10px;
      box-shadow: 2px 3px 12px rgba(0, 0, 0, 0.14);
       color: var(--text-main);
    }

    section {
      margin-bottom: 2rem;
    }

    h2, h3 {
      color: var(--bg-color-header);
 } 
   

     @media (max-width: 768px) {
      header h1 {
        font-size: 1.8rem;
      }

      header {
        padding: 2rem 1rem;
      }

      header p {
        font-size: 1rem;
      }

      main {
        padding: 1rem;
        margin: 1rem;
        background: white;
      border-radius: 0px;
      box-shadow: none;
      }

      .question-item {
        font-size: 0.95rem;
        padding: 0.75rem;
      }

      a.btn {
        padding: 0.6rem 1.2rem;
        font-size: 0.95rem;
      }

      .modal-content {
        margin-top: 20%;
        padding: 1.5rem;
      }

      input#fatwaSearch {
        font-size: 0.95rem;
      }

      .pagination a {
        font-size: 0.8rem;
        padding: 0.6rem 0.6rem;
      }

      footer h4 {
        font-size: 1.1rem;
      }

      footer a {
        font-size: 0.85rem;
      }
    }

   

    body.dark {
      --background: #0f172a;
      --card-bg: #1e293b;
      --accent-bg: #334155;
      --text-color: #f1f5f9;
    }

    body.dark .modal-content input,
    body.dark .modal-content textarea {
      background-color: #334155;
      color: #f1f5f9;
      border: 1px solid #475569;
    }

    body.dark .modal-content button {
      background-color: #22c55e;
      color: #fff;
    }

    body.dark .question-item:hover {
      color: #1e293b;
    }

    body.dark #answerCount {
      color:black;
    }

    .dark-toggle-btn {
      margin: 1rem;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: var(--text-color);
      cursor: pointer;
      font-weight: bold;
      transition: background 0.3s ease;
    }

    body.dark .dark-toggle-btn {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }

    body.dark header {
      background-color: var(--bg-color-header);
    }


    
  `}
</style>

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
          { label: "Feedback", href: "/feedback", internal: true },
          { label: "Contribute", href: "/contribute", internal: true }
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
      <Footer lang="en" />

    </>
  );
}

export default Home;
