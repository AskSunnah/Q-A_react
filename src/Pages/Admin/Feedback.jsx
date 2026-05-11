import React, { useState, useEffect } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import { getAllFeedback } from "../../api/feedback";
import {
  Globe,
  User,
  Mail,
  Phone,
  Calendar,
  Star,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("en");
  const [copiedId, setCopiedId] = useState(null);

  const isArabic = language === "ar";

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await getAllFeedback(language);
      setFeedbacks(res.feedbacks || []);
    } catch (err) {
      console.error("Failed to load feedback:", err);
      alert("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };
  const sectionTranslations = {
    "Q&A": "قسم الأسئلة والأجوبة",
    "Books": "قسم الكتب",
    "Search / Library": "البحث / المكتبة",
    "Other": "أخرى",
  };
  useEffect(() => {
    fetchFeedbacks();
  }, [language]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AdminLayout>
      <style jsx>{`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background: #f1f5f9;
          color: #334155;
        }
        .page-wrapper {
          min-height: 100vh;
          padding: 2rem 1rem;
          direction: ${isArabic ? "rtl" : "ltr"};
        }
        .container { max-width: 1100px; margin: 0 auto; }

        /* Header */
        .header {
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .title {
          font-size: 1.85rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }
        .subtitle {
          font-size: 0.95rem;
          color: #64748b;
          margin: 0.25rem 0 0;
        }

        /* Language Toggle */
        .lang-toggle {
          background: #1e293b;
          color: white;
          border: none;
          padding: 0.75rem 1.25rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }
        .lang-toggle:hover { background: #334155; }

        /* Feedback Card */
        .card {
          background: white;
          border-radius: 14px;
          padding: 1.75rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          transition: all 0.25s ease;
        }
        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .user-name {
          font-weight: 600;
          color: #1e293b;
          font-size: 1.05rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .meta {
          font-size: 0.88rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .rating-badge {
          background: #fffbeb;
          color: #92400e;
          padding: 0.4rem 0.8rem;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          border: 1.5px solid #fbbf24;
        }

        .sections {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .section-tag {
          background: #eff6ff;
          color: #1e40af;
          padding: 0.25rem 0.7rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .feedback-text {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #c3a421;
          padding: 1.25rem 1.5rem;
          border-radius: 10px;
          font-size: 1.02rem;
          line-height: 1.65;
          color: #334155;
          margin: 0.75rem 0;
          white-space: pre-line;
        }

        .copy-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #64748b;
          padding: 4px;
        }

        /* Empty & Loading */
        .empty-state {
          text-align: center;
          padding: 5rem 2rem;
          color: #64748b;
        }
        .empty-icon {
          width: 90px;
          height: 90px;
          background: #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .skeleton-line {
          height: 20px;
          background: #f1f5f9;
          border-radius: 6px;
          margin-bottom: 14px;
          animation: pulse 1.8s infinite ease-in-out;
        }
        .skeleton-line.short { width: 70%; }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

      <div className="page-wrapper">
        <div class="container">
          {/* Header */}
          <div className="header">
            <div>
              <h1 className="title">
                {isArabic ? "آراء المستخدمين" : "User Feedback"}
              </h1>
              <p className="subtitle">
                {isArabic
                  ? "مراجعة تقييمات وآراء مستخدمي AskSunnah"
                  : "Review feedback and ratings from AskSunnah users"}
              </p>
            </div>
            <button
              className="lang-toggle"
              onClick={() => setLanguage(l => l === "en" ? "ar" : "en")}
            >
              <Globe size={18} />
              {isArabic ? "English" : "العربية"}
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div>
              {[1, 2, 3].map(i => (
                <div key={i} className="card">
                  <div className="skeleton-line" style={{ width: "35%" }}></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-line" style={{ height: "60px", marginTop: "1rem" }}></div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && feedbacks.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <AlertCircle size={44} color="#94a3b8" />
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                {isArabic ? "لا توجد آراء بعد" : "No feedback yet"}
              </h3>
              <p>{isArabic ? "ستظهر الآراء هنا عندما يرسلها المستخدمون" : "Feedback will appear here once submitted."}</p>
            </div>
          )}

          {/* Feedback List */}
          {!loading && feedbacks.map((fb) => (
            <div key={fb._id} className="card">
              <div className="card-header">
                <div className="user-info">
                  <div className="user-name">
                    <User size={18} />
                    {fb.name || (isArabic ? "مجهول" : "Anonymous")}
                  </div>

                  <div className="meta">
                    <Mail size={16} />
                    {fb.email || (isArabic ? "لا يوجد بريد" : "No email")}
                    {fb.email && (
                      <button className="copy-btn" onClick={() => copyToClipboard(fb.email, fb._id)}>
                        {copiedId === fb._id ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
                      </button>
                    )}
                  </div>

                  {fb.phone && (
                    <div className="meta">
                      <Phone size={16} />
                      {fb.phone}
                    </div>
                  )}

                  <div className="meta">
                    <Calendar size={16} />
                    {new Date(fb.createdAt).toLocaleDateString(
                      isArabic ? "ar-EG" : "en-US",
                      { month: "long", day: "numeric", year: "numeric" }
                    )}
                  </div>

                  <div className="rating-badge">
                    <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                    Rating {fb.rating}/5 
                  </div>

                {fb.section?.length > 0 && (
                <div style={{ marginTop: "0.8rem" }}>
                <div style={{
                fontSize: "0.85rem",
                color: "#64748b",
                marginBottom: "0.5rem",
                fontWeight: "600"
                }}>
              {isArabic ? "الأقسام المختارة:" : "Selected sections:"}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {fb.section.map((value, i) => (
              <span key={i} className="section-tag">
              {isArabic ? sectionTranslations[value] || value : value}
              </span>
            ))}
    </div>
  </div>
)}
                </div>
              </div>

              <div className="feedback-text">
                {fb.feedback}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}