

import React from 'react';

const TermsContent = ({ data, dir = 'ltr' }) => {
  return (
    <main
      className="container"
      dir={dir}
      style={{
        maxWidth: "900px",
        margin: "2.5rem auto",
        padding: "1rem 1.25rem",
      }}
    >
      <style>{`

        .title{
           color: var(--bg-color-header);
        }
        h1 {
          font-size: 1.8rem;
          font-weight: 700;
        }

        .terms-updated {
          font-style: italic;
          color: #666;
          margin-bottom: 1.8rem;
          font-size: 0.9rem;
        }

        .terms-section {
          margin-bottom: 2.2rem;
        }

        .terms-section h2 {
          color: var(--bg-color-header);
          margin-bottom: 0.75rem;
          font-size: 1.25rem;
          font-weight: 600;
          padding-bottom: 0.4rem;
          border-bottom: 2px solid var(--bg-color-header);
        }

        .terms-section p,
        .terms-section div {
          line-height: 1.65;
          font-size: 0.98rem;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 1.5rem;
          }
          .terms-section h2 {
            font-size: 1.15rem;
          }
        }
      `}</style>

      <h1 style={{ textAlign: dir === "rtl" ? "right" : "left" , marginBottom : "15px"}} className="title">
        {data.pageTitle}
      </h1>


      {data.sections.map((sec) => (
        <section key={sec.id} className="terms-section">
          <h2 >{sec.title}</h2>

          <div dangerouslySetInnerHTML={{ __html: sec.content.replace(/\n/g, "<br />") }} />
        </section>
      ))}
    </main>
  );
};

export default TermsContent;
