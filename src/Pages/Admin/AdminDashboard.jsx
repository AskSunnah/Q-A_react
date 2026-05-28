import { useState, useEffect } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import { BookOpen, FileText, MessageSquare, CheckCircle, Library } from "lucide-react";
import { API_BASE } from "../../../config";


const StatCard = ({ title, value, breakdown, icon: Icon, color }) => {
  const isPending = title.includes("Pending");
  const count = isPending ? Number(value) || 0 : 0;

  return (
    // .stat-card
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)] border border-[#f0f0f0] flex items-center gap-[18px] relative transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.1)]">
      {/* .stat-icon */}
      <div
        className="p-[14px] rounded-[14px] shrink-0"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={28} color={color} strokeWidth={2.2} />
      </div>

      {/* .stat-info */}
      <div className="flex-1">
        {/* .stat-label */}
        <p className="text-[0.875rem] text-[#6b7280] m-0 mb-1 font-medium">
          {title}
        </p>
        {/* .stat-number */}
        <h3 className="text-[2.125rem] font-extrabold text-[#111827] m-0 leading-[1.1]">
          {value}
        </h3>
        {breakdown && (
          // .stat-detail
          <p className="text-[0.82rem] text-[#9ca3af] mt-[6px] mb-0 font-medium">
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
    fetch(`${API_BASE}/api/admin/stats`)
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
      <div>
        <div>
          <h1>Welcome back, Admin</h1>
          <p>Here's your content overview at a glance.</p>
        </div>

        {/* .stats-grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 my-10 max-[640px]:grid-cols-1">
          <StatCard
            title="Total Books"
            value={stats.totalBooks}
            breakdown={{
              English: stats.breakdown?.booksEn,
              Arabic: stats.breakdown?.booksAr,
            }}
            icon={Library}
            color="#c3a421"
          />
          <StatCard
            title="Published Q&As"
            value={stats.totalAnswers}
            breakdown={{
              English: stats.breakdown?.answersEn,
              Arabic: stats.breakdown?.answersAr,
            }}
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
            breakdown={{
              English: stats.breakdown?.feedbackEn,
              Arabic: stats.breakdown?.feedbackAr,
            }}
            icon={MessageSquare}
            color="#2563eb"
          />
        </div>

        {/* .caught-up */}
        {!loading && pendingCount === 0 && (
          <div className="max-w-[620px] mx-auto mt-[60px] mb-5 py-9 px-8 bg-gradient-to-br from-[#ecfdf5] to-[#d1fae5] rounded-2xl text-center border border-[#a7f3d0] shadow-[0_8px_25px_rgba(0,0,0,0.06)] max-[640px]:px-5 max-[640px]:py-7">
            {/* .caught-up-icon */}
            <CheckCircle size={42} className="text-[#059669] mb-3 mx-auto" />
            {/* .caught-up-text */}
            <p className="text-[1.25rem] font-semibold text-[#065f46] m-0">
              All caught up! No pending questions right now.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
