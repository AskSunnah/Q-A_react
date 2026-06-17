import React, { useState, useEffect, useMemo } from "react";
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
  Search,
  X,
} from "lucide-react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 10;

export default function UserQuestions() {
  const [questionsEn, setQuestionsEn] = useState([]);
  const [questionsAr, setQuestionsAr] = useState([]);
  const [loading, setLoading] = useState(true);
  // "all" shows both languages merged; "en"/"ar" filters to one
  const [langFilter, setLangFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("unanswered");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalMessage, setModalMessage] = useState("");

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const [resEn, resAr] = await Promise.all([
        getAllQuestions("en"),
        getAllQuestions("ar"),
      ]);
      setQuestionsEn(
        (resEn.questions || []).map((q) => ({ ...q, _lang: "en" }))
      );
      setQuestionsAr(
        (resAr.questions || []).map((q) => ({ ...q, _lang: "ar" }))
      );
    } catch (err) {
      alert("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const showConfirm = (message, action) => {
    setModalMessage(message);
    setModalAction(() => action);
    setModalOpen(true);
  };

  const handleMarkAsAnswered = (id, lang) => {
    showConfirm("Mark this question as answered?", async () => {
      await updateQuestionStatus(id, "answered", lang);
      fetchQuestions();
    });
  };

  const handleDeleteQuestion = (id, lang) => {
    showConfirm("Permanently delete this question?", async () => {
      await deleteQuestion(id, lang);
      fetchQuestions();
    });
  };

  // Pending counts per language — always visible regardless of which tab is active
  const pendingEnCount = questionsEn.filter((q) => q.status !== "answered").length;
  const pendingArCount = questionsAr.filter((q) => q.status !== "answered").length;

  const allQuestions = useMemo(
    () => [...questionsEn, ...questionsAr],
    [questionsEn, questionsAr]
  );

  const filtered = useMemo(() => {
    let result = allQuestions;

    if (langFilter !== "all") {
      result = result.filter((q) => q._lang === langFilter);
    }

    if (statusFilter === "unanswered") {
      result = result.filter((q) => q.status !== "answered");
    } else if (statusFilter === "answered") {
      result = result.filter((q) => q.status === "answered");
    }

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter(
        (q) =>
          q.question?.toLowerCase().includes(term) ||
          q.name?.toLowerCase().includes(term)
      );
    }

    // newest first
    return [...result].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [allQuestions, langFilter, statusFilter, search]);

  // Reset to page 1 whenever filters/search change so user isn't stranded on an empty page
  useEffect(() => {
    setPage(1);
  }, [langFilter, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const filterBtnClass = (val) =>
    `px-5 py-2.5 border-[1.5px] rounded-xl font-medium text-[0.92rem] cursor-pointer flex items-center gap-2 transition-all
    ${
      statusFilter === val
        ? "bg-[#c3a421] text-white border-[#c3a421]"
        : "bg-transparent border-slate-200 text-slate-700 hover:border-[#c3a421] hover:bg-amber-50"
    }`;

  const badgeClass = (val) =>
    `px-2.5 py-0.5 rounded-full text-xs font-semibold
    ${statusFilter === val ? "bg-white/30" : "bg-black/10"}`;

  const langSegmentClass = (val) =>
    `flex-1 px-4 py-2.5 rounded-[10px] font-semibold text-[0.9rem] cursor-pointer flex items-center justify-center gap-2 transition-all
    ${
      langFilter === val
        ? "bg-white text-slate-800 shadow-sm"
        : "text-slate-500 hover:text-slate-700"
    }`;

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
          <div className="mb-6">
            <h1 className="text-[1.85rem] font-bold text-slate-800 m-0">
              User Questions
            </h1>
            <p className="text-[0.95rem] text-slate-500 mt-1 mb-0">
              Manage and respond to user-submitted questions
            </p>
          </div>

          {/* Language Segmented Control — both languages always visible with live pending counts */}
          <div className="bg-slate-100 p-1.5 rounded-xl flex gap-1.5 mb-6 max-w-[480px]">
            <button
              className={langSegmentClass("all")}
              onClick={() => setLangFilter("all")}
            >
              <Globe size={16} /> Both
              {pendingEnCount + pendingArCount > 0 && (
                <span className="bg-[#ea580c] text-white text-[0.72rem] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {pendingEnCount + pendingArCount}
                </span>
              )}
            </button>
            <button
              className={langSegmentClass("en")}
              onClick={() => setLangFilter("en")}
            >
              English
              {pendingEnCount > 0 && (
                <span className="bg-[#ea580c] text-white text-[0.72rem] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {pendingEnCount}
                </span>
              )}
            </button>
            <button
              className={langSegmentClass("ar")}
              onClick={() => setLangFilter("ar")}
            >
              العربية
              {pendingArCount > 0 && (
                <span className="bg-[#ea580c] text-white text-[0.72rem] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {pendingArCount}
                </span>
              )}
            </button>
          </div>

          {/* Search + Status Filter Bar */}
          <div className="bg-white px-6 py-5 rounded-xl shadow-sm border border-slate-100 mb-6 flex items-center gap-5 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by question or name..."
                className="w-full pl-10 pr-9 py-2.5 border-[1.5px] border-slate-200 rounded-xl text-[0.92rem] outline-none focus:border-[#c3a421] transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="w-px h-8 bg-slate-200 max-[640px]:hidden" />

            <div className="font-semibold text-slate-600 flex items-center gap-2">
              <Filter size={18} />
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                className={filterBtnClass("all")}
                onClick={() => setStatusFilter("all")}
              >
                All{" "}
                <span className={badgeClass("all")}>{allQuestions.length}</span>
              </button>
              <button
                className={filterBtnClass("unanswered")}
                onClick={() => setStatusFilter("unanswered")}
              >
                <Clock size={16} /> Unanswered
                <span className={badgeClass("unanswered")}>
                  {pendingEnCount + pendingArCount}
                </span>
              </button>
              <button
                className={filterBtnClass("answered")}
                onClick={() => setStatusFilter("answered")}
              >
                <CheckCircle size={16} /> Answered
                <span className={badgeClass("answered")}>
                  {allQuestions.filter((q) => q.status === "answered").length}
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
                {search
                  ? "No questions match your search"
                  : `No ${statusFilter === "all" ? "" : statusFilter} questions found`}
              </h3>
              <p>
                {search
                  ? "Try a different name or keyword."
                  : statusFilter === "unanswered"
                  ? "Great job! All questions have been answered."
                  : "Try adjusting your filter."}
              </p>
            </div>
          )}

          {/* Questions List */}
          {!loading &&
            paginated.map((q) => (
              <div
                key={`${q._lang}-${q._id}`}
                className="bg-white rounded-[14px] p-7 mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-200 transition-all duration-[250ms] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
              >
                <div className="flex justify-between items-start mb-5 flex-wrap gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="font-semibold text-slate-800 text-[1.05rem] flex items-center gap-2">
                      <User size={18} /> {q.name}
                      <span
                        className={`text-[0.72rem] font-bold px-2 py-0.5 rounded-full ${
                          q._lang === "ar"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-sky-100 text-sky-700"
                        }`}
                      >
                        {q._lang === "ar" ? "العربية" : "English"}
                      </span>
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
                    <div className="flex gap-3 flex-wrap">
                      {q.status !== "answered" && (
                        <>
                          <button
                            className="bg-green-600 text-white border-none px-5 py-2.5 rounded-xl font-semibold cursor-pointer flex items-center gap-2 transition-all hover:bg-green-700 hover:-translate-y-px"
                            onClick={() => {
                              const params = new URLSearchParams({
                                lang: q._lang,
                                question: q.question,
                                name: q.name || "Anonymous",
                                questionId: q._id,
                              });

                              navigate(`/supervised/add-qa?${params.toString()}`);
                            }}
                          >
                            Add Answer
                          </button>

                          <button
                            className="bg-blue-600 text-white border-none px-5 py-2.5 rounded-xl font-semibold cursor-pointer flex items-center gap-2 transition-all hover:bg-blue-700 hover:-translate-y-px"
                            onClick={() => handleMarkAsAnswered(q._id, q._lang)}
                          >
                            <CheckCircle size={16} />
                            Mark Answered
                          </button>
                        </>
                      )}

                      <button
                        className="bg-red-50 text-red-600 border border-red-200 p-2.5 rounded-xl cursor-pointer transition-all hover:bg-red-100 hover:-translate-y-px"
                        onClick={() => handleDeleteQuestion(q._id, q._lang)}
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

          {/* Pagination */}
          {!loading && filtered.length > PAGE_SIZE && (
            <div className="flex items-center justify-center gap-2 mt-8 mb-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#c3a421] hover:text-[#c3a421] transition-all"
              >
                Previous
              </button>
              <span className="px-3 text-[0.9rem] text-slate-500 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#c3a421] hover:text-[#c3a421] transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}