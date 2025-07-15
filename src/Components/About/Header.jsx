const Header = ({ title, subtitle, dir }) => {
   return (
    <header className="hero" dir={dir}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
};

export default Header;
