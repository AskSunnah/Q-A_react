const IntroSection = ({ heading, description, buttonLabel, buttonLangLink, onOpenModal, lang = 'ltr' }) => {
  return (

    <>
      <style>
        {`

        section{
          color: var(--text-main);
          }

        a.btn {
          display: inline-block;
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background: var(--button-gradient);
          color: var(--button-text-color);
          font-weight:600;
          text-decoration: none;
          border-radius: 6px;
          transition: background 0.3s ease;
  
          }

          h2{
            padding: 0.5rem 0;
            color: var(--bg-color-header);
          }

          a.btn:hover {
          background: var(--button-hover); /* darker golden gradient */

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
