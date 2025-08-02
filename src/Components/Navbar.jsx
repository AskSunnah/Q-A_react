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

    <>
      <style>
        {`
    .navbar {
      background: var(--bg-main);
      padding: 1rem 1.5rem;
      position: relative;
      z-index: 10;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .navbar ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem;
    }

    .nav-link {
      color: var(--text-main);
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background 0.2s;
      display: inline-block;
    }

    .nav-link:hover,
    .nav-link:focus {
      background: var( --button-gradient);
      color:var(--text-main);
    }

    .nav-toggle {
      display: none;
      font-size: 1.3rem;
      background: none;
      border: none;
      cursor: pointer;
      color:  var(--text-main);
      position: absolute;
      top: 9px;
      right: 1rem;
      z-index: 11;
    }

    @media (max-width: 768px) {
      .navbar {
        padding: 1.5rem 0;
      }

      .nav-toggle {
        display: block;
      }

      .nav-menu {
        display: none;
        width: 100%;
      }

      .nav-menu.open {
        display: block;
      }

      .navbar ul {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }
    }

    body.dark .navbar {
      background: var(--bg-color-header);
    }

    body.dark .nav-link:hover,
    body.dark .nav-link:focus {
      background: var(--bg-color-header);
    }

    body.dark .nav-link {
      color: white;
    }

  `}
      </style>
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
                style={{ cursor: 'pointer', fontSize: '1.3rem', display: 'inline-block', color: "var(--bg-color-header)" }}
              ></i>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};
export default Navbar;