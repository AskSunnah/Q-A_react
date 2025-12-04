import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ lang = 'en' }) => {
  const isArabic = lang === 'ar';

  const t = {
    logoText: isArabic ? 'اسأل السنة' : 'AskSunnah',
    tagline: isArabic
      ? 'منصة للمعرفة الإسلامية المبنية على القرآن والسنة'
      : 'A platform for Islamic knowledge based on the Qur’an and Sunnah.',
    copyright: isArabic
      ? '© 2025 اسأل السنة. جميع الحقوق محفوظة.'
      : '© 2025 AskSunnah. All rights reserved.',
    terms: isArabic ? 'الشروط والأحكام' : 'Terms & Conditions',
    termsLink: isArabic ? '/ar/terms' : '/terms',

    dir: isArabic ? 'rtl' : 'ltr',
  };

  const socials = [
    {
      href: 'https://www.youtube.com/@falah.kurkully',
      label: 'YouTube',
      svg: (
        <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
          <path d="M21.8 8.001a2.752 2.752 0 0 0-1.938-1.938C18.23 6 12 6 12 6s-6.23 0-7.862.063A2.752 2.752 0 0 0 2.2 8.001 28.914 28.914 0 0 0 2 12a28.914 28.914 0 0 0 .2 3.999 2.752 2.752 0 0 0 1.938 1.938C5.77 18 12 18 12 18s6.23 0 7.862-.063a2.752 2.752 0 0 0 1.938-1.938A28.914 28.914 0 0 0 22 12a28.914 28.914 0 0 0-.2-3.999zM10 15V9l5 3-5 3z" />
        </svg>
      ),
    },
    {
      href: 'https://www.tiktok.com/@falah.kurkully',
      label: 'TikTok',
      svg: (
        <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
          <path d="M16.5 1a5.51 5.51 0 0 0 4.5 2V6a7.5 7.5 0 0 1-4.5-1.5V14a6.5 6.5 0 1 1-6.5-6.5c.5 0 1 .07 1.5.2v2.16a3.5 3.5 0 1 0 2 3.14V1h3z" />
        </svg>
      ),
    },
    {
      href: 'https://instagram.com/falah.kurkully',
      label: 'Instagram',
      svg: (
        <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
          <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm5 2.5A5.5 5.5 0 0 0 6.5 12 5.5 5.5 0 0 0 12 17.5 5.5 5.5 0 0 0 17.5 12 5.5 5.5 0 0 0 12 6.5zm0 2A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5zm4.75-2a.75.75 0 1 0 .75.75.75.75 0 0 0-.75-.75z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>
        {`
          .custom-footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 15px;
            background: linear-gradient(to bottom, rgba(255,255,255,0.2), transparent);
          }

          .custom-footer {
            position: relative;
            overflow: hidden;
          }

          /* Make footer full-width and RTL-safe on mobile */
@media (max-width: 768px) {
  .custom-footer {
    width: 100%;
    margin: 0;
    transform: none;
    border-radius: 0;
  }
}

          .footer-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .footer-icons {
            display: flex;
            justify-content: center;
            gap: 1.2rem;
            flex-wrap: wrap;
            align-items: center;
            margin-bottom: 0.5rem;
          }

          .footer-handle {
            margin-bottom: 1.5rem;
            font-size: 0.95rem;
          }

          .footer-button {
            display: inline-block;
            background-color: white;
            color: #1a1a1a;
            padding: 0.4rem 1rem;
            border-radius: 6px;
            font-size: 0.9rem;
            text-decoration: none;
            font-weight: bold;
            transition: background-color 0.3s;
            margin-bottom: 1.5rem;
          }

          .footer-button:hover {
            background-color: #e2e2e2;
          }

          .footer-share {
            margin-top: 1.5rem;
            font-size: 0.9rem;
            color: #cccccc;
            font-style: italic;
          }

          .social-icon {
            display: inline-block;
            transition: transform 0.3s ease, filter 0.3s ease;
          }

          .social-icon:hover {
            transform: scale(1.2);
            filter: drop-shadow(0 0 5px white);
          }

          @media (max-width: 600px) {
            footer svg {
              width: 24px;
              height: 24px;
            }

            footer a.social-icon {
              margin-bottom: 10px;
            }
          }
        `}
      </style>

      <footer
        className="custom-footer"
        style={{
          background: 'linear-gradient(180deg, #e1cb57 0%, #d0b640 30%, #c3a421 65%, #a67f0f 100%)',



          color: 'white',
          padding: '1.5rem 1.5rem 1rem',
          fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
          direction: t.dir,
          textAlign: 'center',
        }}
      >
        <div className="footer-container">
          <h2
            style={{
              fontWeight: '700',
              fontSize: '2rem',
              marginBottom: '0.5rem',
              color: 'white',
            }}
          >
            {t.logoText}
          </h2>

          <p
            style={{
              fontSize: '1rem',
              color: '#f0f0f0',
              marginBottom: '1rem',
            }}
          >
            {t.tagline}
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1.2rem',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginBottom: '0.5rem',
            }}
          >
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                title={s.label}
                className="social-icon"
                style={{
                  display: 'inline-block',
                  transition: 'transform 0.3s ease, filter 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.2)';
                  e.currentTarget.style.filter = 'drop-shadow(0 0 5px white)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.filter = 'none';
                }}
              >
                {s.svg}
              </a>
            ))}
          </div>

          <div
            style={{
              borderTop: '1px solid #eeeeee33',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              fontSize: '0.85rem',
              color: '#cccccc',
            }}
          >
            <span>{t.copyright}</span>
            <span style={{ margin: '0 0.5rem' }}>|</span>
            <Link
              to={t.termsLink}
              style={{ color: '#cccccc', textDecoration: 'none' }}
            >
              {t.terms}
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
