import React, { useState } from "react";
const STRINGS = {
  en: {
    dir: "ltr",
    isArabic: false,
    title: "We Value Your Feedback",
    subtitle: "Help us improve Ask Sunnah for everyone",
    nameLabel: "Your Name *",
    emailLabel: "Email Address *",
    phoneLabel: "Phone Number",
    phoneOptional: "(optional)",
    ratingQuestion: "1. How was your experience? *",
    ratingHint: "1 star = Very bad, 5 stars = Excellent",
    sectionQuestion: "2. What part of Ask Sunnah were you using? *",
    feedbackQuestion: "3. What went wrong or what should we improve? *",
    feedbackHint: "Tell us briefly about your experience",
    submit: "Submit Feedback",
    sending: "Sending…",
    successTitle: "Jazakallah Khairan!",
    successText: "Your feedback has been submitted successfully.",
    requiredAlert: "Please fill in all required fields",
    errorGeneric:
      "Something went wrong sending your feedback. Please try again.",
    errorNetwork: "Network error. Please check your connection and try again.",
    placeholderName: "Enter your name",
    placeholderEmail: "your.email@example.com",
    placeholderPhone: "+1 (555) 000-0000",
    placeholderFeedback:
      "Share your thoughts, suggestions, or issues you encountered...",
    sections: [
      { value: "Q&A", label: "Q&A" },
      { value: "Books", label: "Books" },
      { value: "Search / Library", label: "Search / Library" },
      { value: "Other", label: "Other" },
    ],
  },
  ar: {
    dir: "rtl",
    isArabic: true,
    title: "نقدر رأيك في أسأل سنة",
    subtitle: "ساعدنا على تحسين المنصة لجميع المستخدمين",
    nameLabel: "الاسم الكريم *",
    emailLabel: "البريد الإلكتروني *",
    phoneLabel: "رقم الجوال",
    phoneOptional: "(اختياري)",
    ratingQuestion: "١. كيف تُقيِّم تجربتك مع أسأل سنة؟ *",
    ratingHint: "١ نجمة = سيئة جدًا ، ٥ نجوم = ممتازة",
    sectionQuestion: "٢. أي جزء من أسأل سنة كنتَ تستخدم؟ *",
    feedbackQuestion:
      "٣. ما المشكلة التي واجهتها أو ماذا تقترح لتحسين المنصة؟ *",
    feedbackHint: "اكتب لنا بإيجاز رأيك أو ملاحظاتك أو أي صعوبات واجهتها",
    submit: "إرسال الملاحظة",
    sending: "جاري الإرسال…",
    successTitle: "جزاك الله خيرا!",
    successText: "تم إرسال ملاحظتك بنجاح.",
    requiredAlert: "يرجى تعبئة جميع الحقول المطلوبة",
    errorGeneric: "حدث خطأ أثناء إرسال الملاحظة. يرجى المحاولة مرة أخرى.",
    errorNetwork: "خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
    placeholderName: "اكتب اسمك هنا",
    placeholderEmail: "your.email@example.com",
    placeholderPhone: "+966 5x xxx xxxx",
    placeholderFeedback: "اكتب ملاحظاتك أو اقتراحاتك هنا...",
   
    sections: [
      { value: "Q&A", label: "قسم الأسئلة والأجوبة" },
      { value: "Books", label: "قسم الكتب" },
      { value: "Search / Library", label: "البحث / المكتبة" },
      { value: "Other", label: "أخرى" },
    ],
  },
};
export default function FeedbackForm({ lang = "en" }) {
  const t = STRINGS[lang] || STRINGS.en;
  const isArabic = t.isArabic;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    rating: 0,
    section: [],
    feedback: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.rating ||
      !formData.section ||
      formData.section.length === 0 ||
      !formData.feedback
    ) {
      alert(t.requiredAlert);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(
        "https://asksunnah-backend-hno9.onrender.com/api/feedback",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, lang }),
        },
      );

      if (res.ok) {
        setSubmitted(true);

        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            phone: "",
            rating: 0,
            section: [],
            feedback: "",
          });
          setSubmitted(false);
        }, 3000);
      } else {
        alert(t.errorGeneric);
      }
    } catch {
      alert(t.errorNetwork);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const toggleSection = (value) => {
    setFormData((prev) => {
      const exists = prev.section.includes(value);
      return {
        ...prev,
        section: exists
          ? prev.section.filter((v) => v !== value)
          : [...prev.section, value],
      };
    });
  };

  const handleRating = (rating) => {
    setFormData((p) => ({ ...p, rating }));
  };

  return (
    <div
      dir={t.dir}
      className="
        min-h-screen
        bg-white
        px-4 sm:px-6 lg:px-8
        py-8 sm:py-12
        font-sans
      "
    >
      <div
        className="
          w-full
          max-w-[640px]
          mx-auto
          bg-[var(--bg-light)]
          rounded-xl sm:rounded-2xl
          p-5 sm:p-8 md:p-10
          shadow-[0_15px_40px_rgba(0,0,0,0.2)]
        "
      >
        {/* HEADER */}
        <div className="text-center mb-6 sm:mb-8">
          <h1
            className="
              text-lg sm:text-2xl md:text-3xl
              font-bold
              text-[#1a202c]
              mb-2
              leading-tight
            "
          >
            {t.title}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#718096]">
            {t.subtitle}
          </p>
        </div>

        {/* SUCCESS */}
        {submitted ? (
          <div className="text-center py-10 sm:py-14 animate-[fadeIn_0.5s_ease-in]">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">✓</div>
            <h2 className="text-lg sm:text-2xl text-green-500 mb-2">
              {t.successTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#718096]">
              {t.successText}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {/* NAME */}
            <div className="mb-5 sm:mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.nameLabel}
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t.placeholderName}
                className={`
                  w-full
                  px-3 sm:px-4
                  py-2.5 sm:py-3
                  border-2 border-gray-200
                  rounded-lg
                  text-sm sm:text-base
                  outline-none
                  focus:border-indigo-500
                  transition
                  bg-white
                  ${isArabic ? "text-right" : "text-left"}
                `}
              />
            </div>

            {/* EMAIL */}
            <div className="mb-5 sm:mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.emailLabel}
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t.placeholderEmail}
                className={`
                  w-full
                  px-3 sm:px-4
                  py-2.5 sm:py-3
                  border-2 border-gray-200
                  rounded-lg
                  text-sm sm:text-base
                  outline-none
                  focus:border-indigo-500
                  bg-white
                  ${isArabic ? "text-right" : "text-left"}
                `}
              />
            </div>

            {/* PHONE */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.phoneLabel}{" "}
                <span className="text-gray-400 font-normal">
                  {t.phoneOptional}
                </span>
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={t.placeholderPhone}
                className={`
                  w-full
                  px-3 sm:px-4
                  py-2.5 sm:py-3
                  border-2 border-gray-200
                  rounded-lg
                  text-sm sm:text-base
                  outline-none
                  focus:border-indigo-500
                  bg-white
                  ${isArabic ? "text-right" : "text-left"}
                `}
              />
            </div>

            {/* RATING */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                {t.ratingQuestion}
              </label>

              <p className="text-xs sm:text-sm text-gray-500 mb-3">
                {t.ratingHint}
              </p>

              <div
                className={`flex gap-1 sm:gap-2 text-2xl sm:text-4xl ${
                  isArabic ? "justify-end" : "justify-start"
                }`}
                dir="ltr"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRating(star)}
                    className="p-1 cursor-pointer sm:p-1"
                  >
                    {star <= formData.rating ? "★" : "☆"}
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                {t.sectionQuestion}
              </label>

              <p className="text-xs sm:text-sm text-gray-500 mb-3">
                {isArabic
                  ? "يمكنك اختيار أكثر من قسم."
                  : "You can select more than one section."}
              </p>

              <div className="flex flex-col gap-2 sm:gap-3">
                {t.sections.map((option) => {
                  const isSelected = formData.section.includes(option.value);

                  return (
                    <label
                      key={option.value}
                      className={`
                        flex items-center
                        p-3 sm:p-4
                        border-2
                        rounded-lg
                        cursor-pointer
                        transition
                        text-sm sm:text-base
                        ${
                          isSelected
                            ? "border-indigo-500 bg-gray-100"
                            : "border-gray-200 bg-white"
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSection(option.value)}
                        className={`w-4 h-4 ${isArabic ? "ml-3" : "mr-3"}`}
                      />

                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* FEEDBACK */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                {t.feedbackQuestion}
              </label>

              <p className="text-xs sm:text-sm text-gray-500 mb-3">
                {t.feedbackHint}
              </p>

              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleInputChange}
                rows={5}
                placeholder={t.placeholderFeedback}
                className={`
                  w-full
                  bg-white
                  px-3 sm:px-4
                  py-2.5 sm:py-3
                  border-2 border-gray-200
                  rounded-lg
                  text-sm sm:text-base
                  outline-none
                  resize-y
                  focus:border-indigo-500
                  ${isArabic ? "text-right" : "text-left"}
                `}
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-[14px] bg-[var(--button-gradient)] text-white border-none rounded-lg text-[16px] font-semibold transition-transform duration-200 shadow-[0_4px_12px_rgba(102,126,234,0.4)]"
              style={{
                cursor: submitting ? "not-allowed" : "pointer",
                background: "var(--button-gradient)",
              }}
              onMouseEnter={(e) => {
                if (submitting) return;
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(102, 126, 234, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(102, 126, 234, 0.4)";
              }}
            >
              {submitting ? t.sending : t.submit}
            </button>
          </form>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
