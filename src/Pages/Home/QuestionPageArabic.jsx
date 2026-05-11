import React from 'react';
import QuestionPage from '../../Components/Home/QuestionPage';
import { fetchFatwaBySlug } from '../../api/fatwa';

const QuestionPageArabic = () => {
  return (
    <QuestionPage
      fetchQuestionBySlug={(slug) => fetchFatwaBySlug(slug, 'ar')}
      direction="rtl"
      language="ar"
      labels={{
        question: 'السؤال:',
        answer: 'الجواب:',
        conclusion: 'ملخص الجواب:',
        back: '← العودة إلى الأسئلة',
        andAllahKnowsBest: 'والله أعلم.',
        fromQuran: 'من القرآن الكريم:',
        fromSunnah: 'من السنة النبوية:',
        fromSalaf: 'من السلف الصالح:',
        fromScholars: 'من أقوال العلماء:',
      }}
    />
  );
};

export default QuestionPageArabic;
