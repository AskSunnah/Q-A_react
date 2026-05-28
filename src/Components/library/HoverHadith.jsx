import React, { useState, useEffect } from "react";

export default function HoverHadith({ text, topBarRef }) {
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
      {/* hover-wrapper-ar */}
      <div className="relative inline-block group">
        <h2 className="text-[clamp(1.25rem,3vw,2rem)] text-[#2b2b2b] cursor-pointer transition-colors duration-300 ease-in-out hover:text-[#c3a421]">
          {text}
        </h2>
        {/* hover-tooltip-ar */}
        <span
          className="
            absolute bottom-[90%] right-1/2 translate-x-1/2
            bg-black/80 text-white
            px-[10px] py-[6px] rounded-md
            text-[clamp(0.75rem,1.5vw,0.9rem)] whitespace-nowrap
            opacity-0 pointer-events-none
            transition-opacity duration-300 ease-in-out
            group-hover:opacity-100
          "
        >
          مرّر المؤشر للقراءة
        </span>
      </div>

      {show && (
        <div
          className="
            fixed right-[40px] bottom-[5vh]
            w-[min(400px,calc(100vw-80px))]
            overflow-y-auto
            bg-white/15 backdrop-blur-[20px]
            border-2 border-[rgba(195,164,33,0.5)] rounded-2xl
            p-5
            text-white text-[clamp(0.8rem,1.4vw,1rem)] text-right
            shadow-[0_8px_32px_rgba(0,0,0,0.3)]
            z-[999]
            hidden md:block
            [animation:fadeInLeft_0.6s_ease_forwards]
          "
          style={{
            top: `${topOffset}px`,
            direction: "ltr",
            unicodeBidi: "bidi-override",
            lineHeight: "1.6",
          }}
        >
          <p dir="rtl">
            أتيتُ رسولَ اللهِ صلَّى اللهُ عليهِ وسلَّمَ وهو مُتَّكِئٌ في المسجدِ
            على بُرْدٍ لهُ أحمرَ فقلتُ لهُ يا رسولَ اللهِ إني جئتُ أطلبُ
            العِلْمَ فقال{" "}
            <span className="relative text-[#3cb371] font-bold cursor-pointer transition-colors duration-300 ease-in-out group/hl">
              مرحبًا بطالبِ العِلْمِ
              <span className="absolute bottom-[120%] left-1/2 -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded-md text-[0.75rem] whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-300 text-left [direction:ltr] group-hover/hl:opacity-100">
                interactive
              </span>
              <span className="absolute bottom-[110%] left-1/2 -translate-x-1/2 w-0 h-0 border-[5px] border-solid border-t-black/80 border-x-transparent border-b-transparent opacity-0 transition-opacity duration-300 group-hover/hl:opacity-100" />
            </span>{" "}
            إنَّ طالبَ العِلْمِ لتحُفَّهُ الملائكةُ وتَظُلَّهُ بأجنحتِها ثم
            يركبُ بعضُهم بعضًا حتى يبلغوا السماءَ الدنيا من حُبِّهِمْ لما يطلبُ
            قال قال صفوانُ يا رسولَ اللهِ لا نزالُ نسافرُ بينَ مكةَ والمدينةَ
            فأَفْتِنَا عن المسحِ على الخُفَّيْنِ فقال لهُ رسولِ اللهِ صلَّى
            اللهُ عليهِ وسلَّمَ ثلاثةُ أيامٍ للمسافرِ ويومٌ وليلةٌ للمقيمِ
            <br />
            <br />
            <strong>الراوي:</strong> صفوان بن عسال
            <br />
            <strong>المحدث:</strong> الألباني
            <br />
            <strong>المصدر:</strong> السلسلة الصحيحة (7/1176)
            <br />
            <strong>خلاصة حكم المحدث:</strong> إسناده حسن
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
