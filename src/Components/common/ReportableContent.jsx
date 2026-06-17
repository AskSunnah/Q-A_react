
// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { Flag, X, Check } from "lucide-react";
// import { submitReport } from "../../api/reports";

// const QUESTION_REASON_KEYS = [
//   "academic_content",
//   "spelling_grammar",
//   "translation_error",
//   "broken_reference",
//   "contradiction",
//   "unclear",
//   "inappropriate",
//   "other",
// ];

// const BOOK_REASON_KEYS = [
//   "spelling_grammar",
//   "translation_error",
//   "wrong_reference",
//   "text_corruption",
//   "formatting_issue",
//   "inappropriate",
//   "other",
// ];

// const LABELS = {
//   en: {
//     startButton: "Report an issue",
//     exitButton: "Cancel",
//     title: "What's the issue?",
//     selectedTextLabel: "Reported text",
//     reasonLabel: "Reason",
//     notePlaceholder: "Add details (optional)",
//     emailPlaceholder: "Your email (optional)",
//     emailLabel: "Email",
//     submit: "Send report",
//     cancel: "Cancel",
//     success: "Report received — our team will review it.",
//     error: "Couldn't send. Please try again.",
//     selectReason: "Please choose a reason.",
//     tapToSelect: "Write or paste the text here (optional)",
//     generalIssue: "General issue",
//     questionReasons: {
//       academic_content: "Academic content issue",
//       spelling_grammar: "Spelling / grammar",
//       translation_error: "Translation error",
//       broken_reference: "Broken or wrong reference",
//       contradiction: "Contradicts another answer",
//       unclear: "Unclear or confusing",
//       inappropriate: "Inappropriate content",
//       other: "Other",
//     },
//     bookReasons: {
//       spelling_grammar: "Spelling / grammar",
//       translation_error: "Translation error",
//       wrong_reference: "Wrong or missing reference",
//       text_corruption: "Corrupted or garbled text",
//       formatting_issue: "Formatting / layout issue",
//       inappropriate: "Inappropriate content",
//       other: "Other",
//     },
//   },
//   ar: {
//     startButton: "الإبلاغ عن مشكلة",
//     exitButton: "إلغاء",
//     instruction: "الإبلاغ عن مشكلة في الصفحة",
//     title: "ما هي المشكلة؟",
//     selectedTextLabel: "النص المُبلَّغ عنه",
//     reasonLabel: "السبب",
//     notePlaceholder: "أضف تفاصيل (اختياري)",
//     emailPlaceholder: "بريدك الإلكتروني (اختياري)",
//     emailLabel: "البريد الإلكتروني",
//     submit: "إرسال البلاغ",
//     cancel: "إلغاء",
//     success: "تم استلام البلاغ — سيراجعه فريقنا.",
//     error: "تعذر الإرسال. حاول مرة أخرى.",
//     selectReason: "يرجى اختيار سبب.",
//    tapToSelect: "اكتب أو الصق النص هنا (اختياري)",
//     generalIssue: "إبلاغ عام",
//     questionReasons: {
//       academic_content: "مشكلة في المحتوى العلمي",
//       spelling_grammar: "إملاء / نحو",
//       translation_error: "خطأ في الترجمة",
//       broken_reference: "مرجع خاطئ أو مكسور",
//       contradiction: "يتعارض مع إجابة أخرى",
//       unclear: "غير واضح أو مُربك",
//       inappropriate: "محتوى غير مناسب",
//       other: "أخرى",
//     },
//     bookReasons: {
//       spelling_grammar: "إملاء / نحو",
//       translation_error: "خطأ في الترجمة",
//       wrong_reference: "مرجع خاطئ أو ناقص",
//       text_corruption: "نص تالف أو غير مقروء",
//       formatting_issue: "مشكلة في التنسيق",
//       inappropriate: "محتوى غير مناسب",
//       other: "أخرى",
//     },
//   },
// };


// export function ReportableContent({
//   lang = "en",
//   contentType,
//   slug,
//   bookId,
//   chapterNumber,
//   pageNumber,
//   bottomOffset = "5.5rem",
//   children,
// }) {
//   const t = LABELS[lang] || LABELS.en;
//   const isRTL = lang === "ar";
//   const isBook = contentType === "book_page";


//   const [panelOpen, setPanelOpen] = useState(false);
//   const [selectedText, setSelectedText] = useState("");
//   const [selectedReason, setSelectedReason] = useState(null);
//   const [note, setNote] = useState("");
//   const [email, setEmail] = useState("");
//   const [status, setStatus] = useState("idle");
//   const [errorMsg, setErrorMsg] = useState("");
 

//   const containerRef = useRef(null);


//   const reasonKeys = isBook ? BOOK_REASON_KEYS : QUESTION_REASON_KEYS;
//   const reasonLabels = isBook ? t.bookReasons : t.questionReasons;

//   const openPanel = (text = "") => {
//     setSelectedText(text);
//     setSelectedReason(null);
//     setNote("");
//     setEmail("");
//     setStatus("idle");
//     setErrorMsg("");
//     setPanelOpen(true);
//   };

//   const closePanel = () => {
//     setPanelOpen(false);
//     setSelectedText("");
//     setSelectedReason(null);
//     setNote("");
//     setEmail("");
//     setStatus("idle");
//     setErrorMsg("");
//   };

//   const exitReportMode = () => {
//     setReportMode(false);
//     closePanel();
//   };

//   const handleSubmit = async () => {
//     if (!selectedReason) {
//       setErrorMsg(t.selectReason);
//       return;
//     }
//    if (!selectedText.trim() && !note.trim()) {
//   setErrorMsg("Please describe the issue.");
//   return;
// }
//     setStatus("submitting");
//     setErrorMsg("");
//     const reasonLabel = reasonLabels[selectedReason];
//     const fullReason = note.trim()
//       ? `${reasonLabel}: ${note.trim()}`
//       : reasonLabel;
//     try {
//       await submitReport({
//         contentType,
//         lang,
//         slug,
//         bookId,
//         chapterNumber,
//         pageNumber,
//         reportedText: selectedText.trim(),
//         reason: fullReason,
//         email: email.trim() || undefined,
//       });
//       setStatus("success");
//       setTimeout(exitReportMode, 2000);
//     } catch (err) {
//       setStatus("error");
//       setErrorMsg(err.message || t.error);
//     }
//   };

//   return (
//     <>
//       <style>{`
//         .report-tap-flash {
//           animation: reportFlash 0.55s ease forwards;
//           border-radius: 4px;
//         }
//         @keyframes reportFlash {
//           0%   { background-color: rgba(195,164,33,0.35); outline: 2px solid rgba(195,164,33,0.7); outline-offset: 2px; }
//           60%  { background-color: rgba(195,164,33,0.12); }
//           100% { background-color: transparent; outline-color: transparent; }
//         }
//       `}</style>

//       <div ref={containerRef} className="relative">
//         {children}


//         {/* ── DESKTOP: floating flag ── */}
//         <div
//           dir={isRTL ? "rtl" : "ltr"}
//           className={`fixed z-[9999] flex-col gap-2 hidden md:flex ${isBook && isRTL ? "left-4 items-start" : "right-4 items-end"}`}
//           style={{ bottom: bottomOffset }}
//         >
//           {!reportMode ? (
//             <button
//               type="button"
//               onClick={() => openPanel("")}
//               className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f1f1f] text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:bg-[#333] transition-colors border-none cursor-pointer"
//               aria-label={t.startButton}
//             >
//               <Flag size={18} />
//             </button>
//           ) : (
//             <div className="flex items-center justify-between gap-3 bg-[#fff8e1] border border-[#e6cf7a] text-[#5c4712] text-[0.78rem] font-medium px-4 py-2.5 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.18)]">
//               <span className="flex items-center gap-1.5">
//                 <Flag size={13} />
//                 {t.instruction}
//               </span>
//               <div className="flex items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={() => openPanel("")}
//                   className="bg-[#5c4712] text-white text-[0.72rem] px-2.5 py-1 rounded-full border-none cursor-pointer hover:bg-[#7a5f1a] transition-colors whitespace-nowrap"
//                 >
//                   {t.generalIssue}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={exitReportMode}
//                   className="bg-transparent border-none cursor-pointer text-[#5c4712] hover:text-[#cc3333]"
//                   aria-label={t.exitButton}
//                 >
//                   <X size={15} />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── MOBILE: inline bar below content ── */}
//       <div
//   dir={isRTL ? "rtl" : "ltr"}
//   className="md:hidden mt-6 mb-2 px-1 flex justify-center"
// >
//           {!reportMode ? (
//             <button
//               type="button"
//               onClick={() => setReportMode(true)}
//               className="flex items-center gap-2 text-[0.82rem] font-medium text-[#5c4712] bg-[#fffaf0] border border-[#e6cf7a] rounded-full px-4 py-2 cursor-pointer hover:bg-[#fff3c4] transition-colors"
//             >
//               <Flag size={13} />
//               {t.startButton}
//             </button>
//           ) : (
//             <div className="flex items-center justify-between bg-[#fff8e1] border border-[#e6cf7a] px-4 py-2.5 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.12)]">
//               <button
//                 type="button"
//                 onClick={() => openPanel("")}
//                 className="flex-1 bg-[#5c4712] text-white text-[0.78rem] px-3 py-2 rounded-full border-none cursor-pointer"
//               >
//                 {t.generalIssue}
//               </button>

//               <button
//                 type="button"
//                 onClick={exitReportMode}
//                 className="ml-3 bg-transparent border-none cursor-pointer text-[#5c4712]"
//                 aria-label={t.exitButton}
//               >
//                 <X size={18} />
//               </button>
//             </div>
//           )}
//         </div>

//         {/* ── Report panel modal ── */}
//         {panelOpen && (
//           <div
//             className="fixed inset-0 z-[200] bg-black/40 flex items-end sm:items-center justify-center px-0 sm:px-4"
//             onClick={closePanel}
//           >
//             <div
//               dir={isRTL ? "rtl" : "ltr"}
//               onClick={(e) => e.stopPropagation()}
//               className={`bg-white w-full sm:max-w-[440px] sm:rounded-[14px] rounded-t-[14px] shadow-2xl overflow-y-auto max-h-[90vh] ${isRTL ? "text-right" : "text-left"}`}
//             >
//               <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f0f0]">
//                 <div className="flex items-center gap-2">
//                   <Flag size={14} className="text-[#c3a421]" />
//                   <span className="font-semibold text-[0.95rem] text-[#333]">
//                     {t.title}
//                   </span>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={closePanel}
//                   className="bg-transparent border-none cursor-pointer text-[#aaa] hover:text-[#666]"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>

//               {status === "success" ? (
//                 <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
//                   <div className="w-12 h-12 rounded-full bg-[#dcfce7] flex items-center justify-center">
//                     <Check size={22} className="text-[#166534]" />
//                   </div>
//                   <p className="font-semibold text-[0.95rem] text-[#1f6f3e] m-0">
//                     {t.success}
//                   </p>
//                 </div>
//               ) : (
//                 <div className="px-5 py-4 space-y-4">
//                   <div>
//                     <label className="text-[0.7rem] font-bold text-[#5c4712] uppercase tracking-wide block mb-1.5">
//                       {t.selectedTextLabel}
//                     </label>
//                     <textarea
//                       value={selectedText}
//                       onChange={(e) => setSelectedText(e.target.value)}
//                       placeholder={t.tapToSelect}
//                       rows={3}
//                       className={`w-full px-3 py-2.5 border rounded-[8px] text-[0.85rem] text-[#333] resize-none focus:outline-none leading-relaxed bg-white border-[#ddd] focus:border-[#c3a421] ${isRTL ? "text-right" : "text-left"}`}
//                       dir={isRTL ? "rtl" : "ltr"}
//                     />
//                   </div>

//                   <div>
//                     <label className="text-[0.7rem] font-bold text-[#5c4712] uppercase tracking-wide block mb-1.5">
//                       {t.reasonLabel}
//                     </label>
//                     <div className="flex flex-wrap gap-1.5">
//                       {reasonKeys.map((key) => (
//                         <button
//                           key={key}
//                           type="button"
//                           onClick={() => setSelectedReason(key)}
//                           className={`text-[0.73rem] px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
//                             selectedReason === key
//                               ? "bg-[#c3a421] text-white border-[#c3a421] font-semibold"
//                               : "bg-white text-[#666] border-[#ddd] hover:border-[#c3a421] hover:text-[#5c4712]"
//                           }`}
//                         >
//                           {reasonLabels[key]}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   <textarea
//                     value={note}
//                     onChange={(e) => setNote(e.target.value)}
//                     placeholder={t.notePlaceholder}
//                     rows={2}
//                     className={`w-full px-3 py-2 border border-[#ddd] rounded-[8px] text-[0.83rem] text-[#333] resize-none focus:outline-none focus:border-[#c3a421] ${isRTL ? "text-right" : "text-left"}`}
//                     dir={isRTL ? "rtl" : "ltr"}
//                   />

//                   <div>
//                     <label className="text-[0.7rem] font-bold text-[#5c4712] uppercase tracking-wide block mb-1.5">
//                       {t.emailLabel}
//                     </label>
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder={t.emailPlaceholder}
//                       className="w-full px-3 py-2 border border-[#ddd] rounded-[8px] text-[0.83rem] text-[#333] focus:outline-none focus:border-[#c3a421] bg-white"
//                       dir="ltr"
//                     />
//                   </div>

//                   {errorMsg && (
//                     <p className="text-[#cc3333] text-[0.78rem] m-0">
//                       {errorMsg}
//                     </p>
//                   )}

//                   <div
//                     className={`flex gap-2 pt-1 pb-1 ${isRTL ? "flex-row-reverse" : ""}`}
//                   >
//                     <button
//                       type="button"
//                       onClick={closePanel}
//                       className="flex-1 text-[0.85rem] px-4 py-2.5 rounded-[8px] border border-[#ddd] bg-white text-[#666] hover:bg-[#f5f5f5] transition cursor-pointer"
//                     >
//                       {t.cancel}
//                     </button>
//                     <button
//                       type="button"
//                       onClick={handleSubmit}
//                       disabled={status === "submitting"}
//                       className="flex-1 text-[0.85rem] px-4 py-2.5 rounded-[8px] bg-[var(--bg-color-header)] text-white hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
//                     >
//                       {status === "submitting" ? "…" : t.submit}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Flag, X, Check } from "lucide-react";
import { submitReport } from "../../api/reports";

const QUESTION_REASON_KEYS = [
  "academic_content",
  "spelling_grammar",
  "translation_error",
  "broken_reference",
  "contradiction",
  "unclear",
  "inappropriate",
  "other",
];

const BOOK_REASON_KEYS = [
  "spelling_grammar",
  "translation_error",
  "wrong_reference",
  "text_corruption",
  "formatting_issue",
  "inappropriate",
  "other",
];

const LABELS = {
  en: {
    startButton: "Report an issue",
    title: "What's the issue?",
    selectedTextLabel: "Reported text",
    reasonLabel: "Reason",
    notePlaceholder: "Add details (optional)",
    emailPlaceholder: "Your email (optional)",
    emailLabel: "Email",
    submit: "Send report",
    cancel: "Cancel",
    success: "Report received — our team will review it.",
    error: "Couldn't send. Please try again.",
    selectReason: "Please choose a reason.",
    tapToSelect: "Write or paste the text here (optional)",
    questionReasons: {
      academic_content: "Academic content issue",
      spelling_grammar: "Spelling / grammar",
      translation_error: "Translation error",
      broken_reference: "Broken or wrong reference",
      contradiction: "Contradicts another answer",
      unclear: "Unclear or confusing",
      inappropriate: "Inappropriate content",
      other: "Other",
    },
    bookReasons: {
      spelling_grammar: "Spelling / grammar",
      translation_error: "Translation error",
      wrong_reference: "Wrong or missing reference",
      text_corruption: "Corrupted or garbled text",
      formatting_issue: "Formatting / layout issue",
      inappropriate: "Inappropriate content",
      other: "Other",
    },
  },
  ar: {
    startButton: "الإبلاغ عن مشكلة",
    title: "ما هي المشكلة؟",
    selectedTextLabel: "النص المُبلَّغ عنه",
    reasonLabel: "السبب",
    notePlaceholder: "أضف تفاصيل (اختياري)",
    emailPlaceholder: "بريدك الإلكتروني (اختياري)",
    emailLabel: "البريد الإلكتروني",
    submit: "إرسال البلاغ",
    cancel: "إلغاء",
    success: "تم استلام البلاغ — سيراجعه فريقنا.",
    error: "تعذر الإرسال. حاول مرة أخرى.",
    selectReason: "يرجى اختيار سبب.",
    tapToSelect: "اكتب أو الصق النص هنا (اختياري)",
    questionReasons: {
      academic_content: "مشكلة في المحتوى العلمي",
      spelling_grammar: "إملاء / نحو",
      translation_error: "خطأ في الترجمة",
      broken_reference: "مرجع خاطئ أو مكسور",
      contradiction: "يتعارض مع إجابة أخرى",
      unclear: "غير واضح أو مُربك",
      inappropriate: "محتوى غير مناسب",
      other: "أخرى",
    },
    bookReasons: {
      spelling_grammar: "إملاء / نحو",
      translation_error: "خطأ في الترجمة",
      wrong_reference: "مرجع خاطئ أو ناقص",
      text_corruption: "نص تالف أو غير مقروء",
      formatting_issue: "مشكلة في التنسيق",
      inappropriate: "محتوى غير مناسب",
      other: "أخرى",
    },
  },
};

// ─── shared modal UI ──────────────────────────────────────────────────────────
function ReportModalUI({ open, onClose, t, isRTL, reasonKeys, reasonLabels, submitPayload }) {
  const [selectedText, setSelectedText] = useState("");
  const [selectedReason, setSelectedReason] = useState(null);
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const reset = () => {
    setSelectedText("");
    setSelectedReason(null);
    setNote("");
    setEmail("");
    setStatus("idle");
    setErrorMsg("");
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    if (!selectedReason) { setErrorMsg(t.selectReason); return; }
    if (!selectedText.trim() && !note.trim()) {
      setErrorMsg(isRTL ? "يرجى وصف المشكلة." : "Please describe the issue.");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    const reasonLabel = reasonLabels[selectedReason];
    const fullReason = note.trim() ? `${reasonLabel}: ${note.trim()}` : reasonLabel;
    try {
      await submitReport({ ...submitPayload, reportedText: selectedText.trim(), reason: fullReason, email: email.trim() || undefined });
      setStatus("success");
      setTimeout(handleClose, 2000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || t.error);
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      onClick={handleClose}
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        dir={isRTL ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "85vh", overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none", width: "100%", maxWidth: "440px" }}
        className={`bg-white rounded-[14px] shadow-2xl ${isRTL ? "text-right" : "text-left"}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-2">
            <Flag size={14} className="text-[#c3a421]" />
            <span className="font-semibold text-[0.95rem] text-[#333]">{t.title}</span>
          </div>
          <button type="button" onClick={handleClose} className="bg-transparent border-none cursor-pointer text-[#aaa] hover:text-[#666]">
            <X size={16} />
          </button>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[#dcfce7] flex items-center justify-center">
              <Check size={22} className="text-[#166534]" />
            </div>
            <p className="font-semibold text-[0.95rem] text-[#1f6f3e] m-0">{t.success}</p>
          </div>
        ) : (
          <div className="px-5 py-4 space-y-4">
            <div>
              <label className="text-[0.7rem] font-bold text-[#5c4712] uppercase tracking-wide block mb-1.5">{t.selectedTextLabel}</label>
              <textarea
                value={selectedText}
                onChange={(e) => setSelectedText(e.target.value)}
                placeholder={t.tapToSelect}
                rows={3}
                className={`w-full px-3 py-2.5 border rounded-[8px] text-[0.85rem] text-[#333] resize-none focus:outline-none leading-relaxed bg-white border-[#ddd] focus:border-[#c3a421] ${isRTL ? "text-right" : "text-left"}`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            <div>
              <label className="text-[0.7rem] font-bold text-[#5c4712] uppercase tracking-wide block mb-1.5">{t.reasonLabel}</label>
              <div className="flex flex-wrap gap-1.5">
                {reasonKeys.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedReason(key)}
                    className={`text-[0.73rem] px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                      selectedReason === key
                        ? "bg-[#c3a421] text-white border-[#c3a421] font-semibold"
                        : "bg-white text-[#666] border-[#ddd] hover:border-[#c3a421] hover:text-[#5c4712]"
                    }`}
                  >
                    {reasonLabels[key]}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.notePlaceholder}
              rows={2}
              className={`w-full px-3 py-2 border border-[#ddd] rounded-[8px] text-[0.83rem] text-[#333] resize-none focus:outline-none focus:border-[#c3a421] ${isRTL ? "text-right" : "text-left"}`}
              dir={isRTL ? "rtl" : "ltr"}
            />

            <div>
              <label className="text-[0.7rem] font-bold text-[#5c4712] uppercase tracking-wide block mb-1.5">{t.emailLabel}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full px-3 py-2 border border-[#ddd] rounded-[8px] text-[0.83rem] text-[#333] focus:outline-none focus:border-[#c3a421] bg-white"
                dir="ltr"
              />
            </div>

            {errorMsg && <p className="text-[#cc3333] text-[0.78rem] m-0">{errorMsg}</p>}

            <div className={`flex gap-2 pt-1 pb-1 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 text-[0.85rem] px-4 py-2.5 rounded-[8px] border border-[#ddd] bg-white text-[#666] hover:bg-[#f5f5f5] transition cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={status === "submitting"}
                className="flex-1 text-[0.85rem] px-4 py-2.5 rounded-[8px] bg-[var(--bg-color-header)] text-white hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
              >
                {status === "submitting" ? "…" : t.submit}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

// ─── For QuestionPage / Fatwa — wraps content, shows a trigger button ─────────
export function ReportableContent({
  lang = "en",
  contentType,
  slug,
  bookId,
  chapterNumber,
  pageNumber,
  bottomOffset = "5.5rem",
  children,
}) {
  const t = LABELS[lang] || LABELS.en;
  const isRTL = lang === "ar";
  const isBook = contentType === "book_page";
  const reasonKeys = isBook ? BOOK_REASON_KEYS : QUESTION_REASON_KEYS;
  const reasonLabels = isBook ? t.bookReasons : t.questionReasons;

  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <>
      <div className="relative">
        {children}

        {/* Desktop floating flag button */}
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className={`fixed z-[9999] hidden md:flex ${isBook && isRTL ? "left-4" : "right-4"}`}
          style={{ bottom: bottomOffset }}
        >
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f1f1f] text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:bg-[#333] transition-colors border-none cursor-pointer"
            aria-label={t.startButton}
          >
            <Flag size={18} />
          </button>
        </div>

        {/* Mobile inline button */}
        <div dir={isRTL ? "rtl" : "ltr"} className="md:hidden mt-6 mb-2 px-1 flex justify-center">
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="flex items-center gap-2 text-[0.82rem] font-medium text-[#5c4712] bg-[#fffaf0] border border-[#e6cf7a] rounded-full px-4 py-2 cursor-pointer hover:bg-[#fff3c4] transition-colors"
          >
            <Flag size={13} />
            {t.startButton}
          </button>
        </div>
      </div>

      <ReportModalUI
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        t={t}
        isRTL={isRTL}
        reasonKeys={reasonKeys}
        reasonLabels={reasonLabels}
        submitPayload={{ contentType, lang, slug, bookId, chapterNumber, pageNumber }}
      />
    </>
  );
}

// ─── For ReadBook — controlled externally, no trigger button ─────────────────
export function ReportModal({
  open,
  onClose,
  lang = "en",
  contentType,
  slug,
  bookId,
  chapterNumber,
  pageNumber,
}) {
  const t = LABELS[lang] || LABELS.en;
  const isRTL = lang === "ar";
  const isBook = contentType === "book_page";
  const reasonKeys = isBook ? BOOK_REASON_KEYS : QUESTION_REASON_KEYS;
  const reasonLabels = isBook ? t.bookReasons : t.questionReasons;

  return (
    <ReportModalUI
      open={open}
      onClose={onClose}
      t={t}
      isRTL={isRTL}
      reasonKeys={reasonKeys}
      reasonLabels={reasonLabels}
      submitPayload={{ contentType, lang, slug, bookId, chapterNumber, pageNumber }}
    />
  );
}