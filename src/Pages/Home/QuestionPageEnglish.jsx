import React from 'react';
import { useSearchParams } from 'react-router-dom';
import QuestionPage from '../../Components/Home/QuestionPage';
import { fetchFatwaBySlug } from '../../api/fatwa';

const QuestionPageEnglish = () => {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get('lang') || 'en';

  // 🔍 detect Arabic
  const isArabic = lang === 'ar';

  return (
    <QuestionPage
      fetchQuestionBySlug={(slug) =>
        fetchFatwaBySlug(slug, isArabic ? 'ar' : 'en')
      }
      direction={isArabic ? 'rtl' : 'ltr'}
      language={lang}
      labels={
        isArabic
          ? {
              question: 'السؤال:',
              answer: 'الجواب:',
              conclusion: 'الملخص:',
              back: '← العودة إلى الأسئلة',
              andAllahKnowsBest: 'والله أعلم.',
              fromQuran: 'من القرآن:',
              fromSunnah: 'من السنة:',
              fromSalaf: 'من السلف:',
              fromScholars: 'من العلماء:',
            }
          : {
              question: 'Question:',
              answer: 'Answer:',
              conclusion: 'Summary:',
              back: '← Back to Questions',
              andAllahKnowsBest: 'And Allah knows best.',
              fromQuran: 'From the Qur’an:',
              fromSunnah: 'From the Sunnah:',
              fromSalaf: 'From the Salaf:',
              fromScholars: 'From the Scholars:',
            }
      }
    />
  );
};

export default QuestionPageEnglish;
