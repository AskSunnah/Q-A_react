const Header = ({ title, subtitle, dir = 'ltr' }) => {
  return (

    <>
    <style>
        {`
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    header {
      background-color: var(--bg-color-header);
      color: var(--text-main);
      padding: 2.5rem 1.25rem;
      text-align: center;
    }
    header h1 {
      font-size: 2.5rem;
    }
    header p {
      margin-top: 0.5rem;
      font-size: 1.1rem;
    }
     @media (max-width: 768px) {
      header h1 {
        font-size: 1.8rem;
      }
      header {
        padding: 2rem 1rem;
      }
      header p {
        font-size: 1rem;
      }
      
      a.btn {
        padding: 0.6rem 1.2rem;
        font-size: 0.95rem;
      }
      
    }
  `}
      </style>
      <header className="hero" dir={dir}>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>
    </>
  );
};

export default Header;

