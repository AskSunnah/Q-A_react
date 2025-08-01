const IntroSection = ({ heading, description, buttonLabel, buttonLangLink, onOpenModal, lang = 'ltr' }) => {
  return (

    <>
    <style>
      {`
       a.btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--bg-color-header);
  color: #fff;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.3s ease;
}

a.btn:hover {
  background: #a88c1e; /* a darker shade of var(--bg-color-header) */
}

      `}
    </style>
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
    </>
  );
};

export default IntroSection;
