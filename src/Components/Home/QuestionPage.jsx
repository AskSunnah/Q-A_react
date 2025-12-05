// src/Components/Home/QuestionPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../Footer'; // 
import Navbar from '../Navbar';




function QuestionPage({
  fetchQuestionBySlug,
  direction = 'ltr',
  language = 'en',
  labels = {
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
}) {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFatwa = async () => {
      setLoading(true);
      const result = await fetchQuestionBySlug(slug);
      if (result) {
        setData(result);
        document.title = result.heading;
      }
      setLoading(false);
    };
    loadFatwa();
  }, [slug]);

  if (loading) {
    return (
      <>
        <style>{spinnerStyles}</style>
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <div className="spinner" />
        </div>
      </>

    );
  }

  if (!data) {
    console.error(`No data found for slug: ${slug}`);
  }

  const sectionTitleMap = {
    quran: labels.fromQuran,
    sunnah: labels.fromSunnah,
    salaf: labels.fromSalaf,
    scholar: labels.fromScholars,
    normal: ''
  };

  const renderAnswer = (text) => {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);

  const numberedHeadingRegex = /^\d+[\).]\s*/;
  const bulletRegex = /^[-•*]\s*/;

  const elements = [];
  let currentSection = null;

  lines.forEach((line) => {
    if (numberedHeadingRegex.test(line)) {
      // Push any previous section
      if (currentSection) elements.push(currentSection);
      // Start new section
      currentSection = {
        type: 'section',
        heading: line.replace(numberedHeadingRegex, '').trim(),
        bullets: []
      };
    } else if (bulletRegex.test(line)) {
      if (currentSection) {
        currentSection.bullets.push(line.replace(bulletRegex, '').trim());
      } else {
        // Orphan bullet outside of any section
        elements.push({
          type: 'ul',
          items: [line.replace(bulletRegex, '').trim()]
        });
      }
    } else {
      // Plain paragraph or end of section
      if (currentSection) {
        elements.push(currentSection);
        currentSection = null;
      }
      elements.push(line);
    }
  });

  if (currentSection) {
    elements.push(currentSection);
  }

  // Rendering logic
  let manualSectionCounter = 1;

  return elements.map((el, idx) => {
    if (typeof el === 'string') {
      return (
        <p key={idx} style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', marginBottom: '1rem' }}>
          {el}
        </p>
      );
    }

    if (el.type === 'section') {
      const sectionNumber = manualSectionCounter++;
      return (
        <div key={idx} style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '18px', marginBottom: '0.5rem' }}>
            {`${sectionNumber}. ${el.heading}`}
          </p>
          <ul style={{ paddingInlineStart: '1.5rem' }}>
            {el.bullets.map((b, i) => (
              <li key={i} style={{ fontSize: '17px', marginBottom: '' }}>{b}</li>
            ))}
          </ul>
        </div>
      );
    }

    if (el.type === 'ul') {
      return (
        <ul key={idx} style={{  }}>
          {el.items.map((item, i) => (
            <li key={i} style={{ fontSize: '17px' }}>{item}</li>
          ))}
        </ul>
      );
    }

    return null;
  });
};


  return (
  <>
    <Navbar
      navItems={[
        { label: 'Home', href: '/', internal: true },
        { label: 'Library', href: '/library', internal: true },
        { label: 'About Us', href: '/about', internal: true },
        { label: 'Feedback', href: '/feedback', internal: true }
      ]}
      languageSwitcher={{
        href: language === 'ar' ? '/' : '/ar',
        label: language === 'ar' ? 'English' : 'العربية'
      }}
      dir={direction}
    />

    <style>{pageStyles}</style>
      
    <div className="content" dir={direction} lang={language}>
        <h1>{data.heading}</h1>
        <p><strong>{labels.question}</strong> <span>{data.question}</span></p>
       {data.conclusion && (
    <div className="">
      <h2 className="summary-title">{labels.conclusion}</h2>
      <div className='summary-box'>
      
      <p className="summary-text">
        {data.conclusion}
      </p>
    </div></div>
  )}
        <div style={{ marginBottom: '1.5rem' }}>
           <p><strong>{labels.answer}</strong></p>
          {data.answer && renderAnswer(data.answer)}
        </div>


        <div id="dynamic-content">
          {data.content?.map((section, idx) => {
            const sectionTitle = sectionTitleMap[section.type] || '';

            if (section.type === 'normal') {
              return <p key={idx} style={{ whiteSpace: 'pre-wrap' }}>{section.text}</p>;
            }

            const items = Array.isArray(section.items) ? section.items : [section];
            return (
              <div key={idx}>
                {sectionTitle && <h2>{sectionTitle}</h2>}
                <ul>
                  {items.map((item, i) => (
                    <li key={i} style={{ marginBottom: '1.5rem' }}>
                      {item.reference && (
                        <strong style={{ display: 'block', marginBottom: '0.3rem' }}>{item.reference}</strong>
                      )}
                      {item.narrator && (
                        <em style={{ display: 'block', marginBottom: '0.3rem' }}>{item.narrator}</em>
                      )}
                      <blockquote style={{ marginBottom: '0.5rem' }}>{item.text}</blockquote>
                      {item.commentary && (
                        <p style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>{item.commentary}</p>
                      )}
                    </li>
                  ))}
                </ul>

              </div>
            );
          })}
        </div>
        <div className="question-end" ></div>
        <p><strong>{labels.andAllahKnowsBest}</strong></p>
        <Link to={language === 'ar' ? '/ar' : '/'} className="back-link">{labels.back}</Link>
        

      </div>
      <Footer lang={language} />
    </>
  );
}

export default QuestionPage;


const pageStyles = `
  body {
  font-family: 'Segoe UI', sans-serif;
  background-color: #f7f7f7;
  color: #2c3e50;
  line-height: 1.7;
  margin: 0;
  padding: 0;
}

.content {
  padding: 2rem;
  max-width: 887px;
  margin: auto;
}
 .summary-box {
    margin: 1rem 0 1rem;
    padding: 20px;
    border-radius: 16px;
    background: none;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 2px solid rgba(195, 164, 33, 0.5); /* gold-ish like your hadith box */
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
    position: relative;
  }

  .summary-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #c3a421; /* same vibe as hover gold */
  }

  .summary-text {
    margin: 0;
    line-height: 1.7;
    color: #2b2b2b;
    white-space: pre-wrap;
  }

  h1 {
    color: var(--bg-color-header);
    font-size: 2rem;
    margin-bottom: 1rem;
    text-align: left;
  }

  h2 {
    color: var(--bg-color-header);
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.3rem;
    text-align: left;
  }

  p {
    margin-bottom: 1.3rem;
    font-size: 18px;
  }

  ul {
    padding-inline-start: 1.2rem;
    list-style-type: disc;
  }

  li {
    margin-bottom: 1rem;
  }

  blockquote {
    background-color: var(--bg-light);
    border-inline-start: 5px solid var(--bg-color-header);
    margin: 1.5rem 0;
    padding: 1rem 1.25rem;
    font-style: italic;
    font-size: 17.5px;
  }

  .back-link {
    display: inline-block;
    margin-top: 2rem;
    color: var(--bg-color-header);
    text-decoration: none;
    font-weight: bold;
  }

  .back-link:hover {
    text-decoration: underline;
  }
   
  ul li {
    margin-bottom: 0.75rem;
  }
  [dir="rtl"] ul {
    padding-inline-end: 1.2rem;
    padding-inline-start: 0;
  }
  .question-end {
  height: 1px;
  background-color: #2b2b2b;
  margin: 2rem 0;
  opacity: 0.6;
}

  /* ============================
     RESPONSIVE STYLES
  ============================ */

  /* Tablets and small laptops (768px - 1024px) */
  @media (max-width: 1024px) {
    body {
      padding: 1.5rem;
    }

    .content {
      padding: 1.5rem;
      max-width: 90%;
    }

    h1 {
      font-size: 1.875rem;
      line-height: 1.3;
      margin-bottom: 1rem;
    }

    h2 {
      font-size: 1.25rem;
      line-height: 1.3;
      margin-top: 1.5rem;
      margin-bottom: 0.7rem;
    }

    p {
      font-size:1.125rem;
      margin-bottom: 1.1rem;
    }

    blockquote {
      font-size:1.125rem;
      padding: 0.9rem 1.2rem;
      margin: 1.2rem 0;
    }
  }

   /* Phones and smaller tablets (≤768px) */
  @media (max-width: 900px) {
    body {
      padding: 2rem;
    }

    .content {
      padding: 1rem;
      max-width: 95%;
    }

    h1 {
      font-size: 1.7rem;
      line-height: 1.3;
      margin-bottom: 0.8rem;
    }

    h2 {
      font-size: 1.2rem;
      line-height: 1.3;
      margin-top: 1.2rem;
      margin-bottom: 0.6rem;
    }

    p {
      font-size: 17px;
      margin-bottom: 1rem;
    }

    blockquote {
      font-size: 16.5px;
      padding: 0.8rem 1rem;
      margin: 1.1rem 0;
    }
  }

  /* Phones and smaller tablets (≤768px) */
  @media (max-width: 768px) {
    body {
      padding: 1.4rem;
    }

    .content {
      padding: 1rem;
      max-width: 95%;
    }

    h1 {
      font-size: 1.4rem;
      line-height: 1.3;
      margin-bottom: 0.8rem;
    }

    h2 {
      font-size: 1.2rem;
      line-height: 1.3;
      margin-top: 1.2rem;
      margin-bottom: 0.6rem;
    }

    p {
      font-size: 17px;
      margin-bottom: 1rem;
    }

    blockquote {
      font-size: 16.5px;
      padding: 0.8rem 1rem;
      margin: 1.1rem 0;
    }
  }


    @media (max-width: 550px) {
    body {
      padding: 23px;
      margin-top: -10px;
    }


    h1 {
      font-size: 1.4rem;
      line-height: 1.3;
      margin-bottom: 0.8rem;
    }

    h2 {
      font-size: 1.2rem;
      line-height: 1.3;
      margin-top: 1.2rem;
      margin-bottom: 0.6rem;
    }

    p {
      font-size: 17px;
      margin-bottom: 1rem;
    }

    blockquote {
      font-size: 16.5px;
      padding: 0.8rem 1rem;
      margin: 1.1rem 0;
    }
  }
  

  /* Small phones (≤480px) */
  @media (max-width: 480px) {
    .content {
      padding: 0.8rem;
    }

    h1 {
      font-size: 1.2rem;
      line-height: 1.38;
      margin-bottom: 0.7rem;
    }

    h2 {
      font-size: 0.8rem;
      line-height: 1.25;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 14px;
      margin-bottom: 0.9rem;
    }

    blockquote {
      font-size: 14px;
      padding: 0.6rem 0.9rem;
      margin: 1rem 0;
    }
  }

  /* RTL (Arabic) Support */
[dir="rtl"] h1,
[dir="rtl"] h2,
[dir="rtl"] p,
[dir="rtl"] li,
[dir="rtl"] blockquote {
  text-align: right;
}

[dir="rtl"] ul {
  padding-inline-end: 1.2rem;
  padding-inline-start: 0;
}

`;




const spinnerStyles = `
  .spinner {
    border: 8px solid var(--bg-color-header);
    border-top: 8px solid var(--text-accent);
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
    margin: auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
