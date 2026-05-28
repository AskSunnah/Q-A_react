import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ navItems, languageSwitcher, dir = "ltr" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const goingDown = currentY > lastScrollY.current;
      const pastThreshold = currentY > 80;

      if (goingDown && pastThreshold) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass = `
    text-[var(--text-main)] no-underline font-medium
    px-4 py-2 rounded-[4px] inline-block
    transition-all duration-200
    hover:text-white hover:[background:var(--button-hover)]
  `;

  return (
    <nav
      aria-label="Main Navigation"
      dir={dir}
      className={`
        relative
        bg-white sticky top-0 z-[1000]
        py-6 px-4 md:py-4 md:px-0
        shadow-[0_2px_6px_rgba(0,0,0,0.05)]
        border-b border-[#f0f0f0]
        font-[var(--font-family)]
        text-[var(--text-main)]
        transition-transform duration-300 ease-in-out
        ${hidden ? "-translate-y-full" : "translate-y-0"}
      `}
    >
      {/* Hamburger — mobile only, top-aligned */}
      <button
        aria-label="Toggle Navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="
          text-[1.3rem] bg-transparent border-none cursor-pointer
          text-[var(--text-main)] absolute top-2 right-4 z-[1100]
          md:hidden
        "
      >
        ☰
      </button>

      {/* Menu */}
      <div className={`w-full ${isOpen ? "block" : "hidden"} md:block`}>
        <ul
          className={`
            list-none m-0 p-0
            flex flex-col items-center gap-4
            md:flex-row md:flex-wrap md:justify-center md:gap-6
          `}
          style={{
            direction: dir,
            textAlign: dir === "rtl" ? "right" : "left",
          }}
        >
          {navItems.map((item, index) =>
            item.internal ? (
              <li key={index}>
                <Link to={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ) : (
              <li key={index}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener"
                  className={linkClass}
                >
                  {item.label}
                </a>
              </li>
            ),
          )}

          {languageSwitcher && (
            <li>
              <a href={languageSwitcher.href} className={linkClass}>
                {languageSwitcher.label}
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
