const IntroSection = ({ heading, description, buttonLabel, buttonLangLink, onOpenModal, lang = 'ltr' }) => {
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
      <a
        href={buttonLangLink}
        style={{
          margin: lang === 'rtl' ? '0 1rem 0 0' : '0 0 0 1rem',
          textDecoration: 'underline',
          color: 'inherit',
        }}
      >
        {lang === 'rtl' ? 'English' : 'العربية'}
      </a>
    </section>
  );
};

export default IntroSection;
