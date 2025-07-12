import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mode');
    if (saved === 'dark') {
      document.body.classList.add('dark');
      setDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark');
    const isDarkNow = document.body.classList.contains('dark');
    localStorage.setItem('mode', isDarkNow ? 'dark' : 'light');
    setDark(isDarkNow);
  };

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <button
        className="nav-toggle"
        aria-label="Toggle Navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>
      <div className={`nav-menu ${isOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/library" className="nav-link">Library</Link></li>
          <li><Link to="/about-us" className="nav-link">About Us</Link></li>
          <li>
            <a href="https://forms.gle/e5jGuDBJhZAyCP448" className="nav-link" target="_blank" rel="noopener">
              Feedback
            </a>
          </li>
          <li>
            <a href="https://www.paypal.me/asksunnah" className="nav-link" target="_blank" rel="noopener">
              Contribute
            </a>
          </li>
          <li className="nav-darkmode" style={{ marginTop: '10px' }}>
            <i
              id="toggleDarkMode"
              className={`dark-toggle-icon fa-solid ${dark ? 'fa-sun' : 'fa-moon'}`}
              title="Toggle dark mode"
              tabIndex={0}
              onClick={toggleDarkMode}
              style={{ cursor: 'pointer', fontSize: '1.3rem', display: 'inline-block' }}
            ></i>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
