import React from 'react';
import QuestionPage from '../../Components/Home/QuestionPage';
import { fetchFatwaBySlug } from '../../api/fatwa';

const QuestionPageEnglish = () => {
  return (
    <QuestionPage
      fetchQuestionBySlug={(slug) => fetchFatwaBySlug(slug, 'en')}
      direction="ltr"
      language="en"
      labels={{
        question: 'Question:',
        answer: 'Answer:',
        conclusion: 'Conclusion:',
        back: '← Back to Questions',
        andAllahKnowsBest: 'And Allah knows best.',
        fromQuran: 'From the Qur’an:',
        fromSunnah: 'From the Sunnah:',
        fromSalaf: 'From the Salaf:',
        fromScholars: 'From the Scholars:',
      }}
    />
  );
};

export default QuestionPageEnglish;
