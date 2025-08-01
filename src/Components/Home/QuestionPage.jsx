// src/Components/Home/QuestionPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';


function QuestionPage({
  fetchQuestionBySlug,
  direction = 'ltr',
  language = 'en',
  labels = {
    question: 'Question:',
    answer: 'Answer:',
    conclusion: 'Conclusion:',
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
    const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);

    const numberedListRegex = /^\d+[\).]\s+/;
    const bulletListRegex = /^[-•*]\s+/;

    const elements = [];
    let currentList = null;

    for (let line of lines) {
      if (numberedListRegex.test(line)) {
        if (!currentList || currentList.type !== 'ol') {
          currentList = { type: 'ol', items: [] };
          elements.push(currentList);
        }
        currentList.items.push(line.replace(numberedListRegex, ''));
      } else if (bulletListRegex.test(line)) {
        if (!currentList || currentList.type !== 'ul') {
          currentList = { type: 'ul', items: [] };
          elements.push(currentList);
        }
        currentList.items.push(line.replace(bulletListRegex, ''));
      } else {
        currentList = null;
        elements.push(line);
      }
    }

    return elements.map((el, idx) => {
      if (typeof el === 'string') {
        return (
          <p key={idx} style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', marginBottom: '1rem' }}>
            {el}
          </p>
        );
      } else if (el.type === 'ol') {
        return (
          <ol key={idx} style={{ paddingInlineStart: '1.5rem', marginBottom: '1.5rem' }}>
            {el.items.map((item, i) => (
              <li
                key={i}
                style={{
                  fontSize: '18px',
                  marginBottom: '1rem',
                  lineHeight: '1.6',
                }}
              >
                {item}
              </li>

            ))}
          </ol>
        );
      } else if (el.type === 'ul') {
        return (
          <ul key={idx} style={{ paddingInlineStart: '1.5rem', marginBottom: '1.5rem' }}>
            {el.items.map((item, i) => (
              <li
                key={i}
                style={{
                  fontSize: '18px',
                  marginBottom: '1rem',
                  lineHeight: '1.6',
                }}
              >
                {item}
              </li>

            ))}
          </ul>
        );
      }
    });

  };

  return (
    <>
      <style>{pageStyles}</style>
      <div className="content" dir={direction} lang={language}>
        <h1>{data.heading}</h1>
        <p><strong>{labels.question}</strong> <span>{data.question}</span></p>
        {/* <p><strong>{labels.answer}</strong> <span>{data.answer}</span></p> */}
        {/* <div style={{ marginBottom: '1.5rem' }}>
          <strong>{labels.answer}</strong>
          {data.answer &&
            data.answer
              .split(/\n\s*\n/) // splits at empty lines
              .map((paragraph, idx) => (
                <p key={idx} style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', marginBottom: '1rem' }}>
                  {paragraph}
                </p>
              ))}
        </div> */}
        <div style={{ marginBottom: '1.5rem' }}>
          <strong>{labels.answer}</strong>
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

        {data.conclusion && (
          <div id="conclusion">
            <h2>{labels.conclusion}</h2>
            <p style={{ whiteSpace: 'pre-wrap' }}>{data.conclusion}</p>
          </div>
        )}

        <p><strong>{labels.andAllahKnowsBest}</strong></p>
        <Link to={language === 'ar' ? '/ar' : '/'} className="back-link">{labels.back}</Link>
      </div>
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
    padding: 2rem;
    max-width: 887px;
    margin: auto;

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
    margin-bottom: 1.5rem;
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
    border: 8px solid #f3f3f3;
    border-top: 8px solid #1f6f3e;
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
