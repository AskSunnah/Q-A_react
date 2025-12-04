import React, { useState, useEffect } from "react";
import "./HoverHadithEn.css";

export default function HoverHadithEn({ text }) {
  const [show, setShow] = useState(false);
  const [timer, setTimer] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth <= 768 || "ontouchstart" in window);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleEnter = () => {
    if (isMobile) return;
    const t = setTimeout(() => setShow(true), 2000);
    setTimer(t);
  };

  const handleLeave = () => {
    if (isMobile) return;
    clearTimeout(timer);
    setShow(false);
  };

 return (
  <div
    className="hover-hadith-container"
    
    onMouseEnter={handleEnter}
    onMouseLeave={handleLeave}
  >
    <div className="hover-wrapper">
      <h2 className="hover-hadith-text">{text}</h2>
      <span className="hover-tooltip">Hover to read</span>
    </div>
      {!isMobile && show && (
  <div className="hadith-box">
    <p className="hadith-text-en">
            I came to the Messenger of Allah, peace and blessings be upon him, while he was reclining in the mosque on a red cloak of his. I said to him, ‘O Messenger of Allah, I have come seeking knowledge.’ He said, <span className="highlight-green">“Welcome, seeker of knowledge.”</span> Indeed, the seeker of knowledge is surrounded by the angels and shaded by their wings, then they mount one upon another until they reach the lowest heaven, out of their love for what he is seeking.
            Safwan said, ‘O Messenger of Allah, we are constantly traveling between Mecca and Medina, so give us a ruling about wiping over the leather socks.’
            The Messenger of Allah, peace and blessings be upon him, said to him, ‘Three days for the traveler, and one day and one night for the resident.’
            <br /><br />
<strong>Narrator:</strong> Safwan ibn Assal<br />
<strong>Scholar:</strong> al-Albani<br />
<strong>Source:</strong> al-Silsilah al-Sahihah (7/1176)<br />
<strong>Ruling:</strong> hasan (sound)

          </p>
        </div>
      )}
    </div>
  );
}
