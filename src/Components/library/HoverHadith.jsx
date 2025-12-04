import React, { useState, useEffect } from "react";
import "./HoverHadith.css";

export default function HoverHadith({ text }) {
  const [show, setShow] = useState(false);
  const [timer, setTimer] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile or small screen
    const checkIfMobile = () => setIsMobile(window.innerWidth <= 768 || "ontouchstart" in window);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleEnter = () => {
    if (isMobile) return; // 🚫 skip on mobile
    const t = setTimeout(() => setShow(true), 2000);
    setTimer(t);
  };

  const handleLeave = () => {
    if (isMobile) return; // 🚫 skip on mobile
    clearTimeout(timer);
    setShow(false);
  };


   return (
    <div
      className="hover-hadith-container"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="hover-wrapper-ar">
        <h2 className="hover-hadith-text">{text}</h2>
        <span className="hover-tooltip-ar">تفاعلي</span>
      </div>

      {show && (
        <div className="hadith-box">
          <p dir="rtl">
            أتيتُ رسولَ اللهِ صلَّى اللهُ عليهِ وسلَّمَ وهو مُتَّكِئٌ في المسجدِ على بُرْدٍ لهُ أحمرَ فقلتُ لهُ يا رسولَ اللهِ إني جئتُ أطلبُ العِلْمَ فقال <span className="highlight-green">مرحبًا بطالبِ العِلْمِ</span>  إنَّ طالبَ العِلْمِ لتحُفَّهُ الملائكةُ وتَظُلَّهُ بأجنحتِها ثم يركبُ بعضُهم بعضًا حتى يبلغوا السماءَ الدنيا من حُبِّهِمْ لما يطلبُ قال قال صفوانُ يا رسولَ اللهِ لا نزالُ نسافرُ بينَ مكةَ والمدينةَ فأَفْتِنَا عن المسحِ على الخُفَّيْنِ فقال لهُ رسولِ اللهِ صلَّى اللهُ عليهِ وسلَّمَ ثلاثةُ أيامٍ للمسافرِ ويومٌ وليلةٌ للمقيمِ
            <br /><br />
            <strong>الراوي:</strong> صفوان بن عسال<br />
            <strong>المحدث:</strong> الألباني<br />
            <strong>المصدر:</strong> السلسلة الصحيحة (7/1176)<br />
            <strong>خلاصة حكم المحدث:</strong> إسناده حسن
          </p>
        </div>
      )}
    </div>
  );
}
