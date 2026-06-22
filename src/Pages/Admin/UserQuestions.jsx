import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../Components/Admin/AdminLayout";
import ConfirmationModal from "../../Components/ConfirmationModal";
import {
  CheckCircle,
  Clock,
  Trash2,
  User,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  AlertCircle,
} from "lucide-react";
import { getAllQuestions, deleteQuestion } from "../../api/questions";

const PAGE_SIZE = 10;

// Get creation date safely.
// If createdAt is missing, MongoDB _id can still be used as a fallback.
const getDateValue = (q) => {
  if (q.createdAt) return new Date(q.createdAt).getTime();

  if (q._id && /^[0-9a-fA-F]{24}$/.test(q._id)) {
    return parseInt(q._id.substring(0, 8), 16) * 1000;
  }

  return 0;
};

// Derive effective dual-status from a question doc.
// Old docs may only have "status", so we support that too.
const getStatuses = (q) => {
  const hasNewStatus = q.englishStatus || q.arabicStatus;

  if (!hasNewStatus && q.status === "answered") {
    return {
      en: "answered",
      ar: "answered",
    };
  }

  return {
    en: q.englishStatus || "unanswered",
    ar: q.arabicStatus || "unanswered",
  };
};

const isFullyAnswered = (q) => {
  const { en, ar } = getStatuses(q);
  return en === "answered" && ar === "answered";
};

const normalizeQuestions = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.questions)) return data.questions;
  return [];
};

function StatusBadge({ status, lang }) {
  const answered = status === "answered";

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-[3px] rounded-full border ${
        answered
          ? "bg-green-50 border-green-300 text-green-700"
          : "bg-red-50 border-red-300 text-red-600"
      }`}
    >
      {answered ? <CheckCircle size={11} /> : <Clock size={11} />}
      {lang === "en" ? "English" : "Arabic"} {answered ? "Done" : "Pending"}
    </span>
  );
}

function AnswerButton({ status, lang, onClick }) {
  const answered = status === "answered";
  const label = lang === "en" ? "English" : "Arabic";

  if (answered) {
    return (
      <button
        disabled
        className="flex items-center gap-1 text-xs font-semibold px-3 py-[7px] rounded-lg border border-green-300 bg-green-50 text-green-700 cursor-default opacity-80"
      >
        <CheckCircle size={13} />
        {label} Added ✓
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-xs font-bold px-3 py-[7px] rounded-lg border-2 border-red-500 text-red-600 bg-red-50 hover:bg-red-500 hover:text-white transition-all duration-150"
    >
      + Add {label} Answer
    </button>
  );
}

function QuestionCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 mb-3 shadow-sm animate-pulse">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 mb-3">
            <div className="h-5 bg-gray-100 rounded-full w-24" />
            <div className="h-5 bg-gray-100 rounded-full w-28" />
          </div>

          <div className="h-4 bg-gray-100 rounded w-[90%] mb-2" />
          <div className="h-4 bg-gray-100 rounded w-[65%] mb-3" />

          <div className="flex flex-wrap gap-2">
            <div className="h-3 bg-gray-100 rounded w-24" />
            <div className="h-3 bg-gray-100 rounded w-36" />
            <div className="h-3 bg-gray-100 rounded w-28" />
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <div className="h-6 bg-gray-100 rounded-full w-28" />
          <div className="h-6 bg-gray-100 rounded-full w-28" />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap pt-2 border-t border-gray-100">
        <div className="h-8 bg-gray-100 rounded-lg w-36" />
        <div className="h-8 bg-gray-100 rounded-lg w-36" />
        <div className="h-8 bg-gray-100 rounded-lg w-20 ml-auto" />
      </div>
    </div>
  );
}

function QuestionCard({ q, lang, onDelete, navigate }) {
  const { en: enStatus, ar: arStatus } = getStatuses(q);
  const fullyDone = enStatus === "answered" && arStatus === "answered";

  const missing = [];
  if (enStatus !== "answered") missing.push("English");
  if (arStatus !== "answered") missing.push("Arabic");

  const handleAddAnswer = (answerLang) => {
    const params = new URLSearchParams({
      questionId: q._id,
      question: q.question || "",
      name: q.name || "",
      lang: answerLang,
    });

    navigate(`/supervised/add-qa?${params.toString()}`);
  };

  return (
    <div
      className={`rounded-xl border p-4 mb-3 transition-all duration-200 ${
        fullyDone
          ? "border-green-200 bg-white"
          : "border-red-200 bg-red-50/40 shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-[3px] rounded-full border ${
                fullyDone
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {fullyDone ? (
                <CheckCircle size={12} />
              ) : (
                <AlertCircle size={12} />
              )}
              {fullyDone ? "Completed" : `Needs ${missing.join(" + ")}`}
            </span>

            <span
              className={`text-[10px] font-bold uppercase tracking-wide px-2 py-[2px] rounded-full border ${
                lang === "ar"
                  ? "border-purple-200 bg-purple-50 text-purple-600"
                  : "border-blue-200 bg-blue-50 text-blue-600"
              }`}
            >
              {lang === "ar" ? "Arabic Question" : "English Question"}
            </span>
          </div>

          <p className="text-sm font-semibold text-gray-800 m-0 leading-relaxed">
            {q.question}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <User size={12} /> {q.name || "Anonymous"}
            </span>

            <span className="text-xs text-gray-500 flex items-center gap-1 break-all">
              <Mail size={12} /> {q.email || "No email provided"}
            </span>

            {q.createdAt && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar size={12} />
                {new Date(q.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 items-end shrink-0">
          <StatusBadge status={enStatus} lang="en" />
          <StatusBadge status={arStatus} lang="ar" />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-100">
        <AnswerButton
          status={enStatus}
          lang="en"
          onClick={() => handleAddAnswer("en")}
        />

        <AnswerButton
          status={arStatus}
          lang="ar"
          onClick={() => handleAddAnswer("ar")}
        />

        <button
          onClick={() => onDelete(q._id, lang)}
          className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 px-2 py-[7px] rounded-lg hover:bg-red-50 transition-colors border border-transparent hover:border-red-200"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </div>
  );
}

export default function UserQuestions() {
  const navigate = useNavigate();

  const [enQuestions, setEnQuestions] = useState([]);
  const [arQuestions, setArQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [langFilter, setLangFilter] = useState("both");
  const [statusFilter, setStatusFilter] = useState("unanswered");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    lang: null,
  });
  const [deleting, setDeleting] = useState(false);

  const fetchAllQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const [enData, arData] = await Promise.all([
        getAllQuestions("en"),
        getAllQuestions("ar"),
      ]);

      setEnQuestions(normalizeQuestions(enData));
      setArQuestions(normalizeQuestions(arData));
    } catch (err) {
      console.error("Failed to load user questions:", err);
      setError("Failed to load questions. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  const enPending = enQuestions.filter((q) => !isFullyAnswered(q)).length;
  const arPending = arQuestions.filter((q) => !isFullyAnswered(q)).length;
  const bothPending = enPending + arPending;

  const filteredList = useMemo(() => {
    let base = [];

    if (langFilter === "en") {
      base = enQuestions.map((q) => ({ ...q, _lang: "en" }));
    } else if (langFilter === "ar") {
      base = arQuestions.map((q) => ({ ...q, _lang: "ar" }));
    } else {
      base = [
        ...enQuestions.map((q) => ({ ...q, _lang: "en" })),
        ...arQuestions.map((q) => ({ ...q, _lang: "ar" })),
      ];
    }

    base = [...base].sort((a, b) => getDateValue(b) - getDateValue(a));

    if (statusFilter === "unanswered") {
      base = base.filter((q) => !isFullyAnswered(q));
    } else if (statusFilter === "answered") {
      base = base.filter((q) => isFullyAnswered(q));
    }

    if (search.trim()) {
      const s = search.toLowerCase();

      base = base.filter(
        (q) =>
          q.question?.toLowerCase().includes(s) ||
          q.name?.toLowerCase().includes(s) ||
          q.email?.toLowerCase().includes(s)
      );
    }

    return base;
  }, [enQuestions, arQuestions, langFilter, statusFilter, search]);

  const totalPages = Math.ceil(filteredList.length / PAGE_SIZE);
  const paginated = filteredList.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const resetPage = () => setPage(1);

  const handleDelete = async () => {
    if (!deleteModal.id || !deleteModal.lang) return;

    setDeleting(true);

    try {
      await deleteQuestion(deleteModal.id, deleteModal.lang);

      if (deleteModal.lang === "en") {
        setEnQuestions((prev) =>
          prev.filter((q) => q._id !== deleteModal.id)
        );
      } else {
        setArQuestions((prev) =>
          prev.filter((q) => q._id !== deleteModal.id)
        );
      }
    } catch (err) {
      console.error("Delete question error:", err);
      setError("Failed to delete question. Please try again.");
    } finally {
      setDeleting(false);
      setDeleteModal({ open: false, id: null, lang: null });
    }
  };

  const tabBtn = (value, label, count) => (
    <button
      onClick={() => {
        setLangFilter(value);
        resetPage();
      }}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
        langFilter === value
          ? "bg-[#c3a421] text-white shadow-sm"
          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
      }`}
    >
      {label}

      {count > 0 && (
        <span
          className={`text-[10px] font-bold px-[6px] py-[1px] rounded-full ${
            langFilter === value
              ? "bg-white/30 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );

  return (
    <AdminLayout>
      <ConfirmationModal
        open={deleteModal.open}
        message="Delete this question? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, lang: null })}
        loading={deleting}
      />

      <div className="max-w-[860px] mx-auto mt-8 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 m-0">
            User Questions
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Each submitted question needs both an English and Arabic answer.
          </p>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {tabBtn("both", "Both", bothPending)}
          {tabBtn("en", "English", enPending)}
          {tabBtn("ar", "العربية", arPending)}
        </div>

        <div className="flex gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by question, name, or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#c3a421]"
            />
          </div>

          <div className="flex rounded-lg overflow-hidden border border-gray-200 text-sm font-semibold shrink-0">
            {["unanswered", "all", "answered"].map((v) => (
              <button
                key={v}
                onClick={() => {
                  setStatusFilter(v);
                  resetPage();
                }}
                className={`px-4 py-2 transition-colors capitalize ${
                  statusFilter === v
                    ? "bg-[#c3a421] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {v === "unanswered"
                  ? "Pending"
                  : v === "answered"
                  ? "Done"
                  : "All"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <QuestionCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 text-sm">
            {error}
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            {search
              ? "No questions match your search."
              : "No questions in this view."}
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-3">
              {filteredList.length} question
              {filteredList.length !== 1 ? "s" : ""}
              {statusFilter === "unanswered" ? " needing attention" : ""}
            </p>

            {paginated.map((q) => (
              <QuestionCard
                key={`${q._lang}-${q._id}`}
                q={q}
                lang={q._lang}
                navigate={navigate}
                onDelete={(id, lang) =>
                  setDeleteModal({ open: true, id, lang })
                }
              />
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>

                <span className="text-sm text-gray-600 font-medium">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}