import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ navItems, languageSwitcher, dir = 'ltr' }) => {
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
    <nav className="navbar" aria-label="Main Navigation" dir={dir}>
      <button
        className="nav-toggle"
        aria-label="Toggle Navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>
      <div className={`nav-menu ${isOpen ? 'open' : ''}`}>
        <ul style={{ direction: dir, textAlign: dir === 'rtl' ? 'right' : 'left' }}>
          {navItems.map((item, index) =>
            item.internal ? (
              <li key={index}>
                <Link to={item.href} className="nav-link">{item.label}</Link>
              </li>
            ) : (
              <li key={index}>
                <a href={item.href} className="nav-link" target="_blank" rel="noopener">
                  {item.label}
                </a>
              </li>
            )
          )}
          {languageSwitcher && (
            <li>
              <a href={languageSwitcher.href} className="nav-link">
                {languageSwitcher.label}
              </a>
            </li>
          )}
          <li className="nav-darkmode" style={{ marginTop: '10px' }}>
            <i
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
