import React, { useState, useRef, useEffect } from "react";
import { submitQuestion } from "../../api/questions";

const AskQuestionModal = ({
  isOpen = false,
  onClose = () => {},
  language = "en",
  direction = "ltr",
  placeholders = {
    name: "Your Name",
    email: "Your Email",
    question: "Your Question",
  },
  labels = {
    title: "Submit Your Question",
    submit: "Send Question",
    success: "Your question has been submitted. JazakAllah Khair!",
    error: "Something went wrong. Please try again.",
    connectionError: "Failed to submit. Please check your connection.",
    close: "Close",
  },
}) => {
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef();

  useEffect(() => {
    if (isOpen) setSubmitted(false);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const name = formData.get("name");
    const email = formData.get("email");
    const question = formData.get("question");

    try {
      await submitQuestion({ name, email, question, language });
      setSubmitted(true);
      formRef.current.reset();
    } catch (err) {
      alert(labels.connectionError);
    }
  };

  if (!isOpen) return null;

  const isRTL = direction === "rtl";

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center overflow-hidden"
        onClick={onClose}
      >
        {/* MODAL */}
        <div
          className={`
      bg-[var(--bg-main)]
      p-8
      w-[90%] max-w-[500px]
      rounded-[10px]
      shadow-[0_6px_15px_rgba(0,0,0,0.3)]
      ${direction === "rtl" ? "text-right" : "text-left"}
    `}
          dir={direction}
          lang={language}
          onClick={(e) => e.stopPropagation()}
        >
          {/* CLOSE BUTTON (RTL-safe without float issues) */}
          <div className="flex justify-end">
            <span
              className="text-[#aaa] text-2xl font-bold cursor-pointer"
              onClick={onClose}
              role="button"
              aria-label={labels.close}
            >
              &times;
            </span>
          </div>

          {/* TITLE */}
          <h3 className="mb-4 text-[var(--text-accent)] text-[17px] font-bold">
            {labels.title}
          </h3>

          {/* FORM */}
          {!submitted ? (
            <form ref={formRef} onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder={placeholders.name}
                required
                className={`w-full px-3 py-3 mb-4 border border-[#ccc] rounded-[6px] text-[var(--text-primary)] text-[14px]
                  ${isRTL ? "text-right" : "text-left"}
                `}
              />

              <input
                type="email"
                name="email"
                placeholder={placeholders.email}
                required
                className={`w-full px-3 py-3 mb-4 border border-[#ccc] rounded-[6px] text-[var(--text-primary)] text-[14px]
                  ${isRTL ? "text-right" : "text-left"}
                `}
              />

              <textarea
                name="question"
                rows="5"
                placeholder={placeholders.question}
                required
                className={`w-full px-3 py-3 mb-4 border border-[#ccc] rounded-[6px] text-[var(--text-primary)] text-[14px]
                  ${isRTL ? "text-right" : "text-left"}
                `}
              />

              <button
                type="submit"
                className="px-5 py-3 bg-[var(--bg-color-header)] text-white rounded-[6px] hover:bg-[#a88c1e] transition"
              >
                {labels.submit}
              </button>
            </form>
          ) : (
            <div className="mt-4 text-green-600">{labels.success}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default AskQuestionModal;
