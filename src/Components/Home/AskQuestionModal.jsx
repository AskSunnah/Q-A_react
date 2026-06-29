import React, { useState, useRef, useEffect } from "react";
import { submitQuestion } from "../../api/questions";

const MAX_QUESTION_LENGTH = 800;

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
    questionHint:
      "Please keep your question concise (max 800 characters). If you have more than one question, submit them separately.",
  },
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [questionLength, setQuestionLength] = useState(0);
  const formRef = useRef();

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setQuestionLength(0);
    }
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
      setQuestionLength(0);
      formRef.current.reset();
    } catch (err) {
      alert(labels.connectionError);
    }
  };

  if (!isOpen) return null;

  const isRTL = direction === "rtl";
  const isNearLimit = questionLength >= MAX_QUESTION_LENGTH * 0.9;
  const isAtLimit = questionLength >= MAX_QUESTION_LENGTH;

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
          {/* CLOSE BUTTON */}
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

              {/* HINT */}
              <p
                className={`text-[12px] mb-2 text-[#888] ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {labels.questionHint}
              </p>

              <textarea
                name="question"
                rows="5"
                placeholder={placeholders.question}
                required
                maxLength={MAX_QUESTION_LENGTH}
                value={undefined}
                onChange={(e) => setQuestionLength(e.target.value.length)}
                className={`w-full px-3 py-3 border border-[#ccc] rounded-[6px] text-[var(--text-primary)] text-[14px]
                  ${isRTL ? "text-right" : "text-left"}
                `}
              />

              {/* LIVE COUNTER */}
              <div
                className={`text-[12px] mb-4 mt-1 ${
                  isRTL ? "text-left" : "text-right"
                } ${
                  isAtLimit
                    ? "text-red-500 font-semibold"
                    : isNearLimit
                      ? "text-orange-500"
                      : "text-[#999]"
                }`}
              >
                {questionLength}/{MAX_QUESTION_LENGTH}
              </div>

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
