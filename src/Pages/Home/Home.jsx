import React, { useState } from 'react';

import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

import Header from '../../Components/Home/Header';
import IntroSection from '../../Components/Home/IntroSection';
import RecentAnswers from '../../Components/Home/RecentAnswers';
import AskQuestionModal from '../../Components/Home/AskQuestionModal';

import { fetchAllFatwas } from "../../api/fatwa"


function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <style>
  {`
    :root {
      --primary: #1f6f3e;
      --secondary: #2e8b57;
      --background: #f7f7f7;
      --card-bg: #ffffff;
      --accent-bg: #f0f4fa;
      --text-color: #2c3e50;
      --font-family: "Segoe UI", sans-serif;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-family);
      background-color: var(--background);
      color: var(--text-color);
      line-height: 1.6;
    }

    header h1 {
      font-size: 2.5rem;
    }

    header p {
      margin-top: 0.5rem;
      font-size: 1.1rem;
    }

    main {
      max-width: 900px;
      margin: 2rem auto;
      padding: 1.5rem;
      background: var(--card-bg);
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    section {
      margin-bottom: 2rem;
    }

    h2, h3 {
      color: var(--primary);
    }

    a.btn {
      display: inline-block;
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      background-color: var(--primary);
      color: #fff;
      text-decoration: none;
      border-radius: 6px;
      transition: background-color 0.3s ease;
    }

    a.btn:hover {
      background-color: var(--secondary);
    }

    .question-item {
      display: block;
      margin-top: 1.5rem;
      padding: 1rem;
      border-left: 5px solid var(--primary);
      background-color: var(--accent-bg);
      border-radius: 5px;
      text-decoration: none;
      color: inherit;
      transition: background-color 0.2s;
    }

    .question-item:hover {
      background-color: #e0f2f1;
      cursor: pointer;
    }

    .modal {
      display: none;
      position: fixed;
      z-index: 9999;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.4);
    }

    .modal.open {
      display: block;
    }

    .modal-content {
      background-color: var(--card-bg);
      margin: 10% auto;
      padding: 2rem;
      border: 1px solid #888;
      width: 90%;
      max-width: 500px;
      border-radius: 10px;
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
    }

    .modal-content h3 {
      margin-bottom: 1rem;
      color: var(--primary);
    }

    .modal-content input,
    .modal-content textarea {
      width: 100%;
      padding: 0.75rem;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-family: var(--font-family);
    }

    .modal-content button {
      padding: 0.75rem 1.25rem;
      background-color: var(--primary);
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }

    .modal-content button:hover {
      background-color: var(--secondary);
    }

    .close {
      color: #aaa;
      float: right;
      font-size: 1.5rem;
      font-weight: bold;
      cursor: pointer;
    }

    [dir="rtl"] .close {
      float: left;
    }

    [dir="rtl"] .modal-content,
    [dir="rtl"] .modal-content h3 {
      text-align: right;
    }


      
    .pagination a,
    .pagination span {
      display: inline-block;
      padding: 0.5rem 0.75rem;
      margin: 0 0.15rem;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      font-family: inherit;
      color: var(--primary);
      background: #fff;
      transition: background 0.2s, color 0.2s;
    }

    .pagination a[aria-current="page"],
    .pagination a.active,
    .pagination a.selected {
      background: var(--primary);
      color: #fff;
      font-weight: bold;
      pointer-events: none;
    }

    .pagination a:hover:not([aria-current="page"]):not(.active) {
      background: var(--secondary);
      color: #fff;
      cursor: pointer;
    }

    .pagination span {
      background: transparent !important;
      color: #555 !important;
      border: none !important;
      cursor: default;
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

     @media (max-width: 500px) {
  .pagination {
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    scrollbar-width: none; /* Firefox */
  }

  .pagination::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }

  .pagination a,
  .pagination span {
    font-size: 0.75rem !important;
    padding: 0.4rem 0.4rem !important;
    flex-shrink: 0; /* prevent shrinking text */
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
      color: var(--text-color);
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
      color: #f1f5f9;
    }

    body.dark header {
      background-color: var(--primary) !important;
    }

    .navbar {
      background: #e9f5ec;
      padding: 1rem 1.5rem;
      position: relative;
      z-index: 10;
    }

    .navbar ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem;
    }

    .nav-link {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background 0.2s;
      display: inline-block;
    }

    .nav-link:hover,
    .nav-link:focus {
      background: var(--secondary);
      color: #fff;
    }

    .nav-toggle {
      display: none;
      font-size: 1.3rem;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--primary);
      position: absolute;
      top: 9px;
      right: 1rem;
      z-index: 11;
    }

    @media (max-width: 768px) {
      .navbar {
        padding: 1.5rem 0;
      }

      .nav-toggle {
        display: block;
      }

      .nav-menu {
        display: none;
        width: 100%;
      }

      .nav-menu.open {
        display: block;
      }

      .navbar ul {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }
    }

    body.dark .navbar {
      background: #183c25;
    }

    body.dark .nav-link:hover,
    body.dark .nav-link:focus {
      background: #25603a;
    }

    body.dark .nav-link {
      color: white;
    }

    .custom-footer {
      background: linear-gradient(to top, #1f6f3e, #2e8b57 98%, transparent);
      color: white;
      padding: 2rem 1rem;
      text-align: center;
      font-family: "Arial", sans-serif;
      margin-top: 3rem;
    }

    .footer-icons {
      display: flex;
      justify-content: center;
      gap: 1.2rem;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .footer-handle {
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
    }

    .footer-button {
      display: inline-block;
      background-color: white;
      color: #1a1a1a;
      padding: 0.4rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      text-decoration: none;
      font-weight: bold;
      transition: background-color 0.3s;
      margin-bottom: 1.5rem;
    }

    .footer-button:hover {
      background-color: #e2e2e2;
    }

    .footer-share {
      margin-top: 1.5rem;
      font-size: 0.9rem;
      color: #cccccc;
      font-style: italic;
    }

    .social-icon {
      display: inline-block;
      transition: transform 0.3s ease, filter 0.3s ease;
    }

    .social-icon:hover {
      transform: scale(1.2);
      filter: drop-shadow(0 0 5px white);
    }

    @media (max-width: 600px) {
      footer svg {
        width: 24px;
        height: 24px;
      }

      footer a.social-icon {
        margin-bottom: 10px;
      }
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
          { label: "Feedback", href: "https://forms.gle/e5jGuDBJhZAyCP448", internal: false },
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
