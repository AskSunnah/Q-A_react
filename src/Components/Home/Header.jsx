
import '../../styles/homepage.css';

const Header = ({ title, subtitle, dir = 'ltr' }) => {
  return (
    <header dir={dir}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
};

export default Header;

