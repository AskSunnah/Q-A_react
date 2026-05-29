import React, { useState, useEffect } from "react";
import {
  getAllQuestions,
  updateQuestionStatus,
  deleteQuestion,
} from "../../api/questions";
import ConfirmationModal from "../../Components/ConfirmationModal";
import {
  CheckCircle,
  Clock,
  Trash2,
  Globe,
  User,
  Calendar,
  Filter,
  AlertCircle,
  Mail,
} from "lucide-react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import { useNavigate } from "react-router-dom";

export default function UserQuestions() {
  const [questions, setQuestions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("en");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalMessage, setModalMessage] = useState("");

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await getAllQuestions(language);
      const data = res.questions || [];
      setQuestions(data);
      applyFilter(data, filter);
    } catch (err) {
      alert("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (data, currentFilter) => {
    let result = data;
    if (currentFilter === "unanswered")
      result = data.filter((q) => q.status !== "answered");
    else if (currentFilter === "answered")
      result = data.filter((q) => q.status === "answered");
    setFiltered(result);
  };

  useEffect(() => {
    fetchQuestions();
  }, [language]);
  useEffect(() => {
    applyFilter(questions, filter);
  }, [filter, questions]);

  const showConfirm = (message, action) => {
    setModalMessage(message);
    setModalAction(() => action);
    setModalOpen(true);
  };

  const handleMarkAsAnswered = (id) => {
    showConfirm("Mark this question as answered?", async () => {
      await updateQuestionStatus(id, "answered", language);
      fetchQuestions();
    });
  };

  const handleDeleteQuestion = (id) => {
    showConfirm("Permanently delete this question?", async () => {
      await deleteQuestion(id, language);
      fetchQuestions();
    });
  };

  const filterBtnClass = (val) =>
    `px-5 py-2.5 border-[1.5px] rounded-xl font-medium text-[0.92rem] cursor-pointer flex items-center gap-2 transition-all
    ${
      filter === val
        ? "bg-[#c3a421] text-white border-[#c3a421]"
        : "bg-transparent border-slate-200 text-slate-700 hover:border-[#c3a421] hover:bg-amber-50"
    }`;

  const badgeClass = (val) =>
    `px-2.5 py-0.5 rounded-full text-xs font-semibold
    ${filter === val ? "bg-white/30" : "bg-black/10"}`;

  return (
    <AdminLayout>
      <ConfirmationModal
        open={modalOpen}
        title="Confirmation"
        message={modalMessage}
        onConfirm={() => {
          modalAction && modalAction();
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />

      <div className="min-h-screen py-8 px-4">
        <div className="max-w-[1100px] mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-[1.85rem] font-bold text-slate-800 m-0">
                  User Questions
                </h1>
                <p className="text-[0.95rem] text-slate-500 mt-1 mb-0">
                  Manage and respond to user-submitted questions
                </p>
              </div>
            </div>
            <button
              className="bg-slate-800 text-white border-none px-5 py-3 rounded-xl font-semibold cursor-pointer flex items-center gap-2 transition-all hover:bg-slate-700"
              onClick={() => setLanguage((l) => (l === "en" ? "ar" : "en"))}
            >
              <Globe size={18} />
              {language === "en" ? "العربية" : "English"}
            </button>
          </div>

          {/* Filter Bar */}
          <div className="bg-white px-6 py-5 rounded-xl shadow-sm border border-slate-100 mb-6 flex items-center gap-6 flex-wrap">
            <div className="font-semibold text-slate-600 flex items-center gap-2">
              <Filter size={18} />
              Filter by status:
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                className={filterBtnClass("all")}
                onClick={() => setFilter("all")}
              >
                All{" "}
                <span className={badgeClass("all")}>{questions.length}</span>
              </button>
              <button
                className={filterBtnClass("unanswered")}
                onClick={() => setFilter("unanswered")}
              >
                <Clock size={16} /> Unanswered
                <span className={badgeClass("unanswered")}>
                  {questions.filter((q) => q.status !== "answered").length}
                </span>
              </button>
              <button
                className={filterBtnClass("answered")}
                onClick={() => setFilter("answered")}
              >
                <CheckCircle size={16} /> Answered
                <span className={badgeClass("answered")}>
                  {questions.filter((q) => q.status === "answered").length}
                </span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-7 mb-6 shadow-sm border border-slate-200"
                >
                  {[35, 100, 70, 50].map((w, j) => (
                    <div
                      key={j}
                      className="h-5 mb-3.5 rounded-md bg-slate-100 animate-pulse"
                      style={{
                        width: `${w}%`,
                        marginTop: j === 3 ? "1rem" : undefined,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 px-8 text-slate-500">
              <div className="w-[90px] h-[90px] bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={44} color="#94a3b8" />
              </div>
              <h3 className="text-2xl mb-2">
                No {filter === "all" ? "" : filter} questions found
              </h3>
              <p>
                {filter === "unanswered"
                  ? "Great job! All questions have been answered."
                  : "Try adjusting your filter."}
              </p>
            </div>
          )}

          {/* Questions List */}
          {!loading &&
            filtered.map((q) => (
              <div
                key={q._id}
                className="bg-white rounded-[14px] p-7 mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-200 transition-all duration-[250ms] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
              >
                <div className="flex justify-between items-start mb-5 flex-wrap gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="font-semibold text-slate-800 text-[1.05rem] flex items-center gap-1">
                      <User size={18} /> {q.name}
                    </div>
                    <div className="text-[0.88rem] text-slate-500 flex items-center gap-1.5">
                      <Calendar size={16} />
                      {new Date(q.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-[0.88rem] text-slate-500 flex items-center gap-1.5">
                      <Mail size={16} />
                      {q.email || "No email provided"}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2 ${q.status === "answered" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
                    >
                      {q.status === "answered" ? (
                        <>
                          <CheckCircle size={16} /> Answered
                        </>
                      ) : (
                        <>
                          <Clock size={16} /> Pending
                        </>
                      )}
                    </span>
                    <div className="flex gap-3">
                      {q.status !== "answered" && (
                        <button
                          className="bg-green-600 text-white border-none px-5 py-2.5 rounded-xl font-semibold cursor-pointer flex items-center gap-2 transition-all hover:bg-green-700 hover:-translate-y-px"
                          onClick={() => {
                            const params = new URLSearchParams({
                              lang: language,
                              question: q.question,
                              name: q.name || "Anonymous",
                              questionId: q._id,
                            });
                            navigate(`/supervised/add-qa?${params.toString()}`);
                          }}
                        >
                          Add Answer
                        </button>
                      )}
                      <button
                        className="bg-red-50 text-red-600 border border-red-200 p-2.5 rounded-xl cursor-pointer transition-all hover:bg-red-100 hover:-translate-y-px"
                        onClick={() => handleDeleteQuestion(q._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 border-l-4 border-l-[#c3a421] px-6 py-5 rounded-xl text-[1.05rem] leading-relaxed text-slate-700 mt-4">
                  {q.question}
                </div>
              </div>
            ))}
        </div>
      </div>
    </AdminLayout>
  );
}
