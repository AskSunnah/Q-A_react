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
    errorGeneric: "Something went wrong sending your feedback. Please try again.",
    errorNetwork: "Network error. Please check your connection and try again.",
    placeholderName: "Enter your name",
    placeholderEmail: "your.email@example.com",
    placeholderPhone: "+1 (555) 000-0000",
    placeholderFeedback: "Share your thoughts, suggestions, or issues you encountered...",
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
    feedbackQuestion: "٣. ما المشكلة التي واجهتها أو ماذا تقترح لتحسين المنصة؟ *",
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
    // values stay EN for backend/db, labels are AR
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
      const res = await fetch("https://asksunnah-backend-hno9.onrender.com/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
      lang, // pass en / ar
      }),
      });


      if (res.ok) {
        setSubmitted(true);
        // reset after 3s
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
        console.error("Formspree error:", await res.json().catch(() => null));
        alert(t.errorGeneric);
      }
    } catch (err) {
      console.error("Network error:", err);
      alert(t.errorNetwork);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  return (
    <div
      dir={t.dir}
      style={{
        minHeight: "100vh",
        background: "white",
        padding: "40px 20px",
        fontFamily: isArabic
          ? '"Tajawal", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
          : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "var(--bg-light)",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#1a202c",
              marginBottom: "8px",
            }}
          >
            {t.title}
          </h1>
          <p style={{ color: "#718096", fontSize: "15px" }}>{t.subtitle}</p>
        </div>

        {submitted ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              animation: "fadeIn 0.5s ease-in",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "16px",
              }}
            >
              ✓
            </div>
            <h2
              style={{
                fontSize: "24px",
                color: "#10b981",
                marginBottom: "8px",
              }}
            >
              {t.successTitle}
            </h2>
            <p style={{ color: "#718096" }}>{t.successText}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                {t.nameLabel}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "15px",
                  transition: "border-color 0.2s",
                  outline: "none",
                  boxSizing: "border-box",
                  textAlign: isArabic ? "right" : "left",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                placeholder={t.placeholderName}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                {t.emailLabel}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "15px",
                  transition: "border-color 0.2s",
                  outline: "none",
                  boxSizing: "border-box",
                  textAlign: isArabic ? "right" : "left",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                placeholder={t.placeholderEmail}
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: "32px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                {t.phoneLabel}{" "}
                <span
                  style={{
                    color: "#9ca3af",
                    fontWeight: 400,
                  }}
                >
                  {t.phoneOptional}
                </span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "15px",
                  transition: "border-color 0.2s",
                  outline: "none",
                  boxSizing: "border-box",
                  textAlign: isArabic ? "right" : "left",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                placeholder={t.placeholderPhone}
              />
            </div>

            {/* Rating */}
            <div style={{ marginBottom: "32px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                {t.ratingQuestion}
              </label>
              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginBottom: "8px",
                }}
              >
                {t.ratingHint}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "12px",
                  direction: "ltr",                          // ignore RTL for this row
      justifyContent: isArabic ? "flex-end" : "flex-start",
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRating(star)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "40px",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    {star <= formData.rating ? "★" : "☆"}
                  </button>
                ))}
              </div>
            </div>

            {/* Section */}
            {/* Section (multi-select) */}
<div style={{ marginBottom: "32px" }}>
  <label
    style={{
      display: "block",
      fontSize: "16px",
      fontWeight: 600,
      color: "#374151",
      marginBottom: "8px",
    }}
  >
    {t.sectionQuestion}
  </label>
  <p
    style={{
      fontSize: "13px",
      color: "#6b7280",
      marginBottom: "12px",
    }}
  >
    {/* You can localize this later if you want */}
    {isArabic
      ? "يمكنك اختيار أكثر من قسم."
      : "You can select more than one section."}
  </p>

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    }}
  >
    {t.sections.map((option) => {
      const isSelected = formData.section.includes(option.value);

      return (
        <label
          key={option.value}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "14px 16px",
            border: "2px solid",
            borderColor: isSelected ? "#667eea" : "#e5e7eb",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.2s",
            background: isSelected ? "#f3f4f6" : "white",
          }}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleSection(option.value)}
            style={{
              marginRight: isArabic ? 0 : "12px",
              marginLeft: isArabic ? "12px" : 0,
              width: "18px",
              height: "18px",
              cursor: "pointer",
            }}
          />
          <span
            style={{
              fontSize: "15px",
              color: "#374151",
            }}
          >
            {option.label}
          </span>
        </label>
      );
    })}
  </div>
</div>

            {/* Feedback */}
            <div style={{ marginBottom: "32px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                {t.feedbackQuestion}
              </label>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "12px",
                }}
              >
                {t.feedbackHint}
              </p>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleInputChange}
                rows="5"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "15px",
                  transition: "border-color 0.2s",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  textAlign: isArabic ? "right" : "left",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                placeholder={t.placeholderFeedback}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "14px",
                background: submitting
                  ? "var(--button-gradient)"
                  : "var(--button-gradient)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
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
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
