import React from 'react';

const Footer = () => {
  return (
    <footer className="custom-footer">
      <h4>Connect With Us!</h4>

      {/* Social Icons */}
      <div className="footer-icons">
        <a href="https://instagram.com/falah.kurkully" target="_blank" className="social-icon" rel="noreferrer">
          <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
            <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm5 2.5A5.5 5.5 0 0 0 6.5 12 5.5 5.5 0 0 0 12 17.5 5.5 5.5 0 0 0 17.5 12 5.5 5.5 0 0 0 12 6.5zm0 2A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5zm4.75-2a.75.75 0 1 0 .75.75.75.75 0 0 0-.75-.75z" />
          </svg>
        </a>

        <a href="https://www.tiktok.com/@falah.kurkully" target="_blank" className="social-icon" rel="noreferrer">
          <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
            <path d="M16.5 1a5.51 5.51 0 0 0 4.5 2V6a7.5 7.5 0 0 1-4.5-1.5V14a6.5 6.5 0 1 1-6.5-6.5c.5 0 1 .07 1.5.2v2.16a3.5 3.5 0 1 0 2 3.14V1h3z" />
          </svg>
        </a>

        <a href="https://www.youtube.com/@falah.kurkully" target="_blank" className="social-icon" rel="noreferrer">
          <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
            <path d="M21.8 8.001a2.752 2.752 0 0 0-1.938-1.938C18.23 6 12 6 12 6s-6.23 0-7.862.063A2.752 2.752 0 0 0 2.2 8.001 28.914 28.914 0 0 0 2 12a28.914 28.914 0 0 0 .2 3.999 2.752 2.752 0 0 0 1.938 1.938C5.77 18 12 18 12 18s6.23 0 7.862-.063a2.752 2.752 0 0 0 1.938-1.938A28.914 28.914 0 0 0 22 12a28.914 28.914 0 0 0-.2-3.999zM10 15V9l5 3-5 3z" />
          </svg>
        </a>
      </div>

      <div className="footer-handle">@falah.kurkully</div>

      <a href="/about-us" className="footer-button">About Us</a>

      <div className="footer-share">
        Share this website with others so the benefit may spread and you may earn ongoing reward, In sha Allah.
      </div>
    </footer>
  );
};

export default Footer;
