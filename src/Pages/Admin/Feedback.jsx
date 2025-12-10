import React, { useState, useEffect } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import { getAllFeedback } from "../../api/feedback";
import {
  Globe,
  User,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  Star,
} from "lucide-react";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("en");

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await getAllFeedback(language); // { success, feedbacks }
      setFeedbacks(res.feedbacks || []);
    } catch (err) {
      console.error("Failed to load feedback:", err);
      alert("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [language]);

  return (
    <AdminLayout>
      <style jsx>{`
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
          background: #f1f5f9;
          color: #334155;
        }

        .page-wrapper {
          min-height: 100vh;
          padding: 2rem 1rem;
        }
        .container {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* Header */
        .header {
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .title-wrapper {
          display: flex;
          align-items: center;
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
        .lang-toggle:hover {
          background: #334155;
        }

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
          gap: 0.4rem;
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

        .rating-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #fef3c7;
          color: #92400e;
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-top: 0.35rem;
        }

        .sections-badge {
          margin-top: 0.35rem;
          display: inline-flex;
          flex-wrap: wrap;
          gap: 0.3rem;
        }
        .section-chip {
          background: #eff6ff;
          color: #1d4ed8;
          padding: 0.2rem 0.6rem;
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
          margin: 0.75rem 0 0.25rem;
          white-space: pre-line;
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

        .skeleton {
          background: #f1f5f9;
          border-radius: 8px;
          animation: pulse 1.8s infinite ease-in-out;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        .skeleton-line {
          height: 20px;
          margin-bottom: 14px;
          border-radius: 6px;
        }
        .skeleton-line.short {
          width: 70%;
        }
      `}</style>

      <div className="page-wrapper">
        <div className="container">
          {/* Header */}
          <div className="header">
            <div className="title-wrapper">
              <div>
                <h1 className="title">User Feedback</h1>
                <p className="subtitle">
                  Review feedback submitted by users about AskSunnah
                </p>
              </div>
            </div>
            <button
              className="lang-toggle"
              onClick={() => setLanguage((l) => (l === "en" ? "ar" : "en"))}
            >
              <Globe size={18} />
              {language === "en" ? "العربية" : "English"}
            </button>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="card">
                  <div
                    className="skeleton-line"
                    style={{ width: "35%" }}
                  ></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                  <div
                    className="skeleton-line"
                    style={{ width: "50%", marginTop: "1rem" }}
                  ></div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && feedbacks.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <AlertCircle size={44} color="#94a3b8" />
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                No feedback found
              </h3>
              <p>Once users start submitting feedback, it will appear here.</p>
            </div>
          )}

          {/* Feedback list */}
          {!loading &&
            feedbacks.map((fb) => (
              <div key={fb._id} className="card">
                <div className="card-header">
                  <div className="user-info">
                    <div className="user-name">
                      <User size={18} />
                      {fb.name || "Anonymous"}
                    </div>

                    <div className="meta">
                      <Mail size={16} />
                      {fb.email || "No email provided"}
                    </div>

                    <div className="meta">
                      <Phone size={16} />
                      {fb.phone || "No phone provided"}
                    </div>

                    <div className="meta">
                      <Calendar size={16} />
                      {fb.createdAt
                        ? new Date(fb.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "No date"}
                    </div>

                    <div className="rating-pill">
                      <span>Rating:</span>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < (fb.rating || 0) ? "#facc15" : "none"}
                          stroke="#facc15"
                        />
                      ))}
                      <span>{fb.rating || "-"}/5</span>
                    </div>

                    {Array.isArray(fb.section) && fb.section.length > 0 && (
                      <div className="sections-badge">
                        {fb.section.map((s) => (
                          <span key={s} className="section-chip">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="feedback-text">{fb.feedback}</div>
              </div>
            ))}
        </div>
      </div>
    </AdminLayout>
  );
}
