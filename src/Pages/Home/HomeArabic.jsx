import { useState } from "react";

import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import Header from "../../Components/Home/Header";
import IntroSection from "../../Components/Home/IntroSection";
import RecentAnswers from "../../Components/Home/RecentAnswers";
import AskQuestionModal from "../../Components/Home/AskQuestionModal";
import { fetchAllFatwasArabic } from "../../api/fatwa";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Header
        title="اسأل السنة"
        subtitle="احصل على إجابات شرعية موثوقة من الشيخ الدكتور فلاح كركولي — مستندة من القرآن والسنة"
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
        languageSwitcher={{ label: "English", href: "/" }}
      />

      <main
        aria-label="Main Content Area"
        className="
          max-w-[900px] mx-auto my-8 px-6 py-6
          bg-[var(--bg-main)] text-[var(--text-main)]
          rounded-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.08)]
          [&>section]:mb-8
          [&_h2]:text-[var(--bg-color-header)] [&_h3]:text-[var(--bg-color-header)]
          max-md:px-4 max-md:py-4 max-md:mx-4 max-md:bg-white max-md:rounded-none max-md:shadow-none
        "
      >
        <IntroSection
          heading="أرسل سؤالك"
          description="هل لديك سؤال عن الإسلام؟ أرسله الآن وستتلقى الرد من د. الشيخ فلاح كركولي وفق رأي موثوق من العلماء."
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
          language="ar"
          direction="rtl"
          placeholders={{
            name: "اسمك",
            email: "بريدك الإلكتروني",
            question: "سؤالك",
          }}
          labels={{
            title: "أرسل سؤالك",
            submit: "إرسال السؤال",
            success: "✅ تم إرسال سؤالك. جزاك الله خيرًا!",
            error: "❌ حدث خطأ. حاول مجددًا.",
            connectionError: "❌ هناك مشكلة في الإرسال.",
            close: "إغلاق",
          }}
        />
      </main>

      <Footer lang="ar" />
    </>
  );
}

export default Home;
