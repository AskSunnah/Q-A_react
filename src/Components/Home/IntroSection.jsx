import React from 'react';
import '../../styles/homepage.css'; // Shared CSS file

const IntroSection = ({ heading, description, buttonLabel, onOpenModal, lang = 'ltr' }) => {
  return (
    <section aria-labelledby="ask-question" dir={lang === 'rtl' ? 'rtl' : 'ltr'}>
      <h2 id="ask-question">{heading}</h2>
      <p>{description}</p>
      <a
        href="#"
        className="btn"
        id="openModalBtn"
        aria-label={buttonLabel}
        onClick={(e) => {
          e.preventDefault();
          onOpenModal();
        }}
      >
        {buttonLabel}
      </a>
      
    </section>
  );
};

export default IntroSection;
