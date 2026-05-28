import React, { useState, useEffect, useRef } from "react";

export default function HoverHadithEn({ text, topBarRef }) {
  const [show, setShow] = useState(false);
  const [timer, setTimer] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [topOffset, setTopOffset] = useState(120);

  useEffect(() => {
    const checkIfMobile = () =>
      setIsMobile(window.innerWidth <= 768 || "ontouchstart" in window);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Measure the real height of header + navbar
  useEffect(() => {
    const measure = () => {
      if (topBarRef?.current) {
        setTopOffset(topBarRef.current.getBoundingClientRect().bottom + 8);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [topBarRef]);

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
      className="relative inline-block text-center"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* hover-wrapper */}
      <div className="relative inline-block group">
        <h2 className="text-[clamp(1.25rem,3vw,2rem)] text-[#2b2b2b] cursor-pointer transition-colors duration-300 ease-in-out hover:text-[#c3a421]">
          {text}
        </h2>
        {/* hover-tooltip */}
        <span
          className="
            absolute bottom-[80%] left-1/2 -translate-x-1/2
            bg-black/80 text-white
            px-[10px] py-[6px] rounded-md
            text-[clamp(0.75rem,1.5vw,0.9rem)] whitespace-nowrap
            opacity-0 pointer-events-none
            transition-opacity duration-300 ease-in-out
            text-left [direction:ltr]
            group-hover:opacity-100
          "
        >
          Hover to read
        </span>
      </div>

      {!isMobile && show && (
        <div
          className="
            fixed right-[40px] bottom-[5vh]
            w-[min(400px,calc(100vw-80px))]
            overflow-y-auto
            bg-white/15 backdrop-blur-[20px]
            border-2 border-[rgba(195,164,33,0.5)] rounded-2xl
            p-5
            text-white
            [direction:ltr] [unicode-bidi:bidi-override] text-left leading-[1.6]
            shadow-[0_8px_32px_rgba(0,0,0,0.3)]
            z-[999]
            [animation:fadeInLeft_0.6s_ease_forwards]
          "
          style={{ top: `${topOffset}px` }}
        >
          <p
            className="
              [direction:ltr] [unicode-bidi:normal]
              text-left
              text-[clamp(0.85rem,1.4vw,1.05rem)] leading-[1.7]
              text-white text-justify [text-justify:inter-word]
            "
            style={{ fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif" }}
          >
            I came to the Messenger of Allah, peace and blessings be upon him,
            while he was reclining in the mosque on a red cloak of his. I said
            to him, 'O Messenger of Allah, I have come seeking knowledge.' He
            said,{" "}
            <span className="relative text-[#3cb371] font-bold cursor-pointer transition-colors duration-300 ease-in-out group/hl">
              "Welcome, seeker of knowledge."
              <span className="absolute bottom-[120%] left-1/2 -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded-md text-[0.75rem] whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-300 text-left [direction:ltr] group-hover/hl:opacity-100">
                interactive
              </span>
              <span className="absolute bottom-[110%] left-1/2 -translate-x-1/2 w-0 h-0 border-[5px] border-solid border-t-black/80 border-x-transparent border-b-transparent opacity-0 transition-opacity duration-300 group-hover/hl:opacity-100" />
            </span>{" "}
            Indeed, the seeker of knowledge is surrounded by the angels and
            shaded by their wings, then they mount one upon another until they
            reach the lowest heaven, out of their love for what he is seeking.
            Safwan said, 'O Messenger of Allah, we are constantly traveling
            between Mecca and Medina, so give us a ruling about wiping over the
            leather socks.' The Messenger of Allah, peace and blessings be upon
            him, said to him, 'Three days for the traveler, and one day and one
            night for the resident.'
            <br />
            <br />
            <strong>Narrator:</strong> Safwan ibn Assal
            <br />
            <strong>Scholar:</strong> al-Albani
            <br />
            <strong>Source:</strong> al-Silsilah al-Sahihah (7/1176)
            <br />
            <strong>Ruling:</strong> hasan (sound)
          </p>
        </div>
      )}

      <style>{`
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeOutLeft {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(-60px); }
        }
      `}</style>
    </div>
  );
}
