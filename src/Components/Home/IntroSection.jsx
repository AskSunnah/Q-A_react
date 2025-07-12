import React from 'react';
import '../../styles/homepage.css'; // Shared CSS file

const IntroSection = ({ onOpenModal }) => {
  return (
    <section aria-labelledby="ask-question">
      <h2 id="ask-question">Ask a Question!</h2>
      <p>
        Have a question about Islam? Submit it and get a response directly from
        Dr. Sheikh Falah Kurkully, based on one clear opinion from trusted scholars.
      </p>
      <a
        href="#"
        className="btn"
        id="openModalBtn"
        aria-label="Submit your question"
        onClick={(e) => {
          e.preventDefault();
          onOpenModal(); // triggers modal open from parent
        }}
      >
        Submit Your Question
      </a>
      <a
        href="/ar/"
        style={{
          marginLeft: '1rem',
          textDecoration: 'underline',
          color: 'inherit',
        }}
      >
        العربية
      </a>
    </section>
  );
};

export default IntroSection;
