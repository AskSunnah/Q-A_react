// src/pages/supervised/Dashboard.jsx
import { useState, useEffect } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import { BookOpen, FileText, MessageSquare, CheckCircle, Library } from "lucide-react";

const StatCard = ({ title, value, breakdown, icon: Icon, color }) => {
  const isPending = title.includes("Pending");
  const count = isPending ? Number(value) || 0 : 0;

  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: `${color}20` }}>
        <Icon size={28} color={color} strokeWidth={2.2} />
      </div>
      <div className="stat-info">
        <p className="stat-label">{title}</p>
        <h3 className="stat-number">{value}</h3>
        {breakdown && (
          <p className="stat-detail">
            {Object.entries(breakdown)
              .filter(([, v]) => v > 0)
              .map(([lang, v]) => `${v} ${lang}`)
              .join(" • ")}
          </p>
        )}
      </div>

    </div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: "Loading...",
    totalAnswers: "Loading...",
    pendingQuestions: "Loading...",
    totalFeedback: "Loading...",
    breakdown: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://asksunnah-backend-hno9.onrender.com/api/admin/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        setStats({
          totalBooks: data.totalBooks || 0,
          totalAnswers: data.totalAnswers || 0,
          pendingQuestions: data.pendingQuestions || 0,
          totalFeedback: data.feedbackTotal || 0,
          breakdown: {
            booksEn: data.booksEn || 0,
            booksAr: data.booksAr || 0,
            answersEn: data.answersEn || 0,
            answersAr: data.answersAr || 0,
            feedbackEn: data.feedbackEn || 0,
            feedbackAr: data.feedbackAr || 0,
          },
        });
      })

      .catch(() => {
        setStats({
          totalBooks: "—",
          totalAnswers: "—",
          pendingQuestions: "—",
          breakdown: null,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const pendingCount = Number(stats.pendingQuestions) || 0;

  return (
    <AdminLayout>


      <style jsx>{`
        body { font-family: "Segoe UI", sans-serif; margin: 0; }


        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin: 40px 0;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.05);
          border: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          gap: 18px;
          position: relative;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
        }

        .stat-icon {
          padding: 14px;
          border-radius: 14px;
          flex-shrink: 0;
        }

        .stat-info { flex: 1; }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0 0 4px 0;
          font-weight: 500;
        }

        .stat-number {
          font-size: 2.125rem;
          font-weight: 800;
          color: #111827;
          margin: 0;
          line-height: 1.1;
        }

        .stat-detail {
          font-size: 0.82rem;
          color: #9ca3af;
          margin: 6px 0 0;
          font-weight: 500;
        }

        .pending-tag {
          position: absolute;
          top: -8px;
          right: 16px;
          background: #ef4444;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 12px;
          min-width: 20px;
          text-align: center;
        }

        .caught-up {
          max-width: 620px;
          margin: 60px auto 20px;
          padding: 36px 32px;
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border-radius: 16px;
          text-align: center;
          border: 1px solid #a7f3d0;
          box-shadow: 0 8px 25px rgba(0,0,0,0.06);
        }

        .caught-up-icon {
          color: #059669;
          margin-bottom: 12px;
        }

        .caught-up-text {
          font-size: 1.25rem;
          font-weight: 600;
          color: #065f46;
          margin: 0;
        }

        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr; }
          .container { padding: 24px 16px; }
          .caught-up { padding: 28px 20px; }
        }
      `}</style>

      <div >
        <div >
          <h1>Welcome back, Admin</h1>
          <p>Here's your content overview at a glance.</p>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Total Books"
            value={stats.totalBooks}
            breakdown={{ English: stats.breakdown?.booksEn, Arabic: stats.breakdown?.booksAr }}
            icon={Library}
            color="#c3a421"
          />
          <StatCard
            title="Published Q&As"
            value={stats.totalAnswers}
            breakdown={{ English: stats.breakdown?.answersEn, Arabic: stats.breakdown?.answersAr }}
            icon={FileText}
            color="#16a34a"
          />
          <StatCard
            title="Pending Questions"
            value={stats.pendingQuestions}
            icon={pendingCount > 0 ? MessageSquare : CheckCircle}
            color={pendingCount > 0 ? "#ea580c" : "#6b7280"}
          />
          <StatCard
          title="Total Feedback"
          value={stats.totalFeedback}
          breakdown={{ English: stats.breakdown?.feedbackEn, Arabic: stats.breakdown?.feedbackAr }}
          icon={MessageSquare}
          color="#2563eb"
          />
        </div>

        {!loading && pendingCount === 0 && (
          <div className="caught-up">
            <CheckCircle size={42} className="caught-up-icon" />
            <p className="caught-up-text">
              All caught up! No pending questions right now.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}