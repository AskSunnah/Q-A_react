import React, { useState } from 'react';

import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';

import Header from '../../Components/Home/Header';
import IntroSection from '../../Components/Home/IntroSection';
import RecentAnswers from '../../Components/Home/RecentAnswers';
import AskQuestionModal from '../../Components/Home/AskQuestionModal';
import { fetchAllFatwasArabic } from "../../api/fatwa";


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
        font-size: 0.9rem;
        padding: 0.4rem 0.6rem;
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


 
  `}
</style>
            <Header
                title="اسأل السنة"
                subtitle="احصل على إجابات شرعية موثوقة من الشيخ الدكتور فلاح كركولي — مستندة من القرآن والسنة (نسخة تجريبية)"
                dir="rtl"
            />
            <Navbar
                dir="rtl"
                navItems={[
                    { label: "الرئيسية", href: "/ar", internal: true },
                    { label: "المكتبة", href: "/library_ar", internal: true },
                    { label: "عن الموقع", href: "/about-us/ar", internal: false },
                    { label: "شاركنا رأيك", href: "https://forms.gle/e5jGuDBJhZAyCP448", internal: false },
                    { label: "ساهم", href: "/ar/contribute", internal: true }
                ]}
                languageSwitcher={{ label: "English", href: "/" }}
            />


            <main aria-label="Main Content Area">
                <IntroSection
                    heading="أرسل سؤالك"
                    description="هل لديك سؤال عن الإسلام؟ أرسله الآن وستتلقى الرد من الشيخ فلاح كركولي وفق رأي موثوق من العلماء."
                    buttonLabel="أرسل سؤالك"
                    buttonLangLink="/"
                    onOpenModal={() => setIsModalOpen(true)}
                    lang="rtl"
                />

                <RecentAnswers
                    fetchFatwas={fetchAllFatwasArabic}
                    sectionTitle="الاجابات الجديدة"
                    searchPlaceholder="ابحث..."
                    questionLabel="س"
                    direction="rtl"
                />

                <AskQuestionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    formAction="https://formspree.io/f/meoayqbd"
                    language="ar"
                    direction="rtl"
                    placeholders={{
                        name: 'اسمك',
                        email: 'بريدك الإلكتروني',
                        question: 'سؤالك',
                    }}
                    labels={{
                        title: 'أرسل سؤالك',
                        submit: 'إرسال السؤال',
                        success: '✅ تم إرسال سؤالك. جزاك الله خيرًا!',
                        error: '❌ حدث خطأ. حاول مجددًا.',
                        connectionError: '❌ هناك مشكلة في الإرسال.',
                        close: 'إغلاق',
                    }}
                />


            </main>
           <Footer lang="ar" />
        </>
    );
}

export default Home;
