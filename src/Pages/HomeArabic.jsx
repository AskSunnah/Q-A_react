import React, { useState } from 'react';

import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

import Header from '../Components/Home/Header';
import IntroSection from '../Components/Home/IntroSection';
import RecentAnswers from '../Components/Home/RecentAnswers';
import AskQuestionModal from '../Components/Home/AskQuestionModal';
import { fetchAllFatwasArabic } from "../api/fatwa";

import '../styles/homepage.css'; // Shared CSS file

function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Header
                title="اسأل السنة"
                subtitle="احصل على إجابات شرعية موثوقة من الشيخ الدكتور فلاح كركولي — مستندة من القرآن والسنة (نسخة تجريبية)"
                dir="rtl"
            />
            <Navbar
                dir="rtl"
                navItems={[
                    { label: "الرئيسية", href: "/ar", internal: true },
                    { label: "المكتبة", href: "/library/library_ar/library.html", internal: false },
                    { label: "عن الموقع", href: "/ar/about-us_ar.html", internal: false },
                    { label: "شاركنا رأيك", href: "https://forms.gle/e5jGuDBJhZAyCP448", internal: false },
                    { label: "ساهم", href: "https://www.paypal.me/asksunnah", internal: false }
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
            <Footer />
        </>
    );
}

export default Home;
