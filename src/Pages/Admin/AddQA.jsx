import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { submitQA, editQA, getQA, getAllQuestions } from "../../api/qa";
import AdminLayout from "../../Components/Admin/AdminLayout";
import { updateQuestionStatus } from "../../api/questions";
import { RxCross2 } from "react-icons/rx";

const sectionOptions = [
  { value: "quran",   label: "From Quran"   },
  { value: "sunnah",  label: "From Sunnah"  },
  { value: "scholar", label: "From Scholar" },
  { value: "salaf",   label: "From Salaf"   },
  { value: "normal",  label: "Normal Text"  },
];

// ── Insert Reference Modal ─────────────────────────────────────────────────
function InsertRefModal({ onInsert, onClose }) {
  const [slug,    setSlug]    = useState("");
  const [label,   setLabel]   = useState("");
  const [url,     setUrl]     = useState("");
  const [useUrl,  setUseUrl]  = useState(false);

  const handle = () => {
    if (!label.trim()) return;
    if (useUrl) {
      if (!url.trim()) return;
      // for external/direct URLs we use a different token: [[url|label]]
      onInsert(`[[${url.trim()}|${label.trim()}]]`);
    } else {
      if (!slug.trim()) return;
      // internal slug reference: {{slug|label}}
      onInsert(`{{${slug.trim()}|${label.trim()}}}`);
    }
    onClose();
  };

  const ready = label.trim() && (useUrl ? url.trim() : slug.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-7 w-[400px] max-w-[95vw]">
        <h3 className="text-[var(--bg-color-header)] text-[1.15rem] font-bold mb-4">
          Insert Inline Reference
        </h3>

        {/* toggle */}
        <div className="flex rounded-lg overflow-hidden border border-[#b5d4c3] mb-5 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setUseUrl(false)}
            className={`flex-1 py-2 transition-colors ${!useUrl ? "bg-[var(--bg-color-header)] text-white" : "bg-[#f6f7fa] text-gray-500"}`}
          >
            Internal Question
          </button>
          <button
            type="button"
            onClick={() => setUseUrl(true)}
            className={`flex-1 py-2 transition-colors ${useUrl ? "bg-[var(--bg-color-header)] text-white" : "bg-[#f6f7fa] text-gray-500"}`}
          >
            Direct URL
          </button>
        </div>

        {!useUrl ? (
          <>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Question Slug</label>
            <input
              autoFocus
              className="w-full mb-4 rounded-lg border border-[#b5d4c3] bg-[#f6f7fa] p-[10px] text-sm"
              placeholder="e.g. ruling-on-music"
              value={slug}
              onChange={e => setSlug(e.target.value)}
            />
          </>
        ) : (
          <>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Direct URL</label>
            <input
              autoFocus
              className="w-full mb-4 rounded-lg border border-[#b5d4c3] bg-[#f6f7fa] p-[10px] text-sm"
              placeholder="https://..."
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
          </>
        )}

        <label className="block text-sm font-semibold text-gray-600 mb-1">Display Text</label>
        <input
          className="w-full mb-2 rounded-lg border border-[#b5d4c3] bg-[#f6f7fa] p-[10px] text-sm"
          placeholder="e.g. our previous answer on this topic"
          value={label}
          onChange={e => setLabel(e.target.value)}
        />

        <p className="text-xs text-gray-400 mb-5 mt-2">
          This inserts a clickable link inline inside your answer text.
        </p>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button type="button" onClick={handle} disabled={!ready}
            className="px-4 py-2 rounded-lg bg-[var(--bg-color-header)] text-white text-sm font-semibold disabled:opacity-40">
            Insert
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Related Answers Modal ──────────────────────────────────────────────────
function RelatedModal({ lang, currentSlug, selected, onSave, onClose }) {
  const [all,     setAll]     = useState([]);
  const [search,  setSearch]  = useState("");
  const [checked, setChecked] = useState(new Set(selected.map(r => r.slug)));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllQuestions(lang)
      .then(data => {
        // exclude the question currently being edited
        setAll(data.filter(q => q.slug !== currentSlug));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lang, currentSlug]);

  const toggle = (slug) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  };

  const handleSave = () => {
    const result = all
      .filter(q => checked.has(q.slug))
      .map(q => ({ slug: q.slug, lang }));
    onSave(result);
    onClose();
  };

  const filtered = all.filter(q =>
    q.heading?.toLowerCase().includes(search.toLowerCase()) ||
    q.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-[520px] max-w-[95vw] max-h-[85vh] flex flex-col">

        {/* header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h3 className="text-[var(--bg-color-header)] text-[1.15rem] font-bold mb-3">
            Select Related Answers
            <span className="ml-2 text-xs font-normal text-gray-400 uppercase tracking-wide">
              {lang === "ar" ? "Arabic" : "English"}
            </span>
          </h3>
          <input
            autoFocus
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#b5d4c3] bg-[#f6f7fa] px-3 py-2 text-sm"
          />
        </div>

        {/* list */}
        <div className="flex-1 overflow-y-auto px-6 py-3">
          {loading ? (
            <p className="text-sm text-gray-400 py-4 text-center">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No questions found.</p>
          ) : (
            filtered.map(q => (
              <label
                key={q.slug}
                className={`
                  flex items-start gap-3 py-3 px-3 rounded-lg cursor-pointer mb-1
                  transition-colors hover:bg-[rgba(40,115,70,0.05)]
                  ${checked.has(q.slug) ? "bg-[rgba(40,115,70,0.07)]" : ""}
                `}
              >
                <input
                  type="checkbox"
                  checked={checked.has(q.slug)}
                  onChange={() => toggle(q.slug)}
                  className="mt-[3px] accent-[var(--bg-color-header)] w-4 h-4 shrink-0"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800 leading-snug m-0">
                    {q.heading}
                  </p>
                  <p className="text-xs text-gray-400 m-0 mt-[2px]">{q.slug}</p>
                </div>
              </label>
            ))
          )}
        </div>

        {/* footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {checked.size} selected
          </span>
          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button type="button" onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-[var(--bg-color-header)] text-white text-sm font-semibold hover:opacity-90">
              Save ({checked.size})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function AddQA() {
  const [searchParams] = useSearchParams();
  const isEdit   = searchParams.get("edit") === "1";
  const editSlug = searchParams.get("slug");
  const editLang = searchParams.get("lang");

  const [loading,          setLoading]          = useState(false);
  const [sections,         setSections]         = useState([]);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [showRefModal,     setShowRefModal]     = useState(false);
  const [showRelatedModal, setShowRelatedModal] = useState(false);
  const answerRef = useRef(null);

  const [form, setForm] = useState({
    language: "en", title: "", slug: "", question: "", answer: "", conclusion: "",
  });
  const [message, setMessage] = useState("");

  // fetch for edit
  useEffect(() => {
    if (isEdit && editSlug && editLang) {
      setLoading(true);
      getQA(editSlug, editLang)
        .then(data => {
          setForm({
            language:   editLang,
            title:      data.heading    || "",
            slug:       data.slug       || "",
            question:   data.question   || "",
            answer:     data.answer     || "",
            conclusion: data.conclusion || "",
          });
          setSections(data.content || []);
          setRelatedQuestions(data.relatedQuestions || []);
          setLoading(false);
        })
        .catch(() => { setMessage("Failed to load."); setLoading(false); });
    }
  }, [isEdit, editSlug, editLang]);

  // pre-fill from URL
  useEffect(() => {
    if (isEdit) return;
    const params = new URLSearchParams(window.location.search);
    const urlQ   = params.get("question");
    const urlN   = params.get("name");
    const urlL   = params.get("lang");
    if (urlQ) setForm(p => ({ ...p, question: decodeURIComponent(urlQ).trim(), language: urlL || "en" }));
    if (urlN) setMessage(`Answering question from: ${decodeURIComponent(urlN)}`);
  }, [isEdit]);

  const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value });

  // insert token at cursor in answer textarea
  const handleInsertRef = (token) => {
    const el = answerRef.current;
    if (!el) { setForm(f => ({ ...f, answer: f.answer + token })); return; }
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    const next  = form.answer.slice(0, start) + token + form.answer.slice(end);
    setForm(f => ({ ...f, answer: next }));
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + token.length;
      el.focus();
    });
  };

  // save related from modal — merge keeping any existing ones not in this lang
  const handleSaveRelated = (newItems) => {
    setRelatedQuestions(prev => {
      const otherLang = prev.filter(r => r.lang !== form.language);
      return [...otherLang, ...newItems];
    });
  };

  // sections handlers (unchanged)
  const handleSectionInput = (idx, field, value, subidx = null) => {
    setSections(s => s.map((sec, i) => {
      if (i !== idx) return sec;
      if (field === "text" && sec.type === "normal") return { ...sec, text: value };
      if (subidx !== null) {
        const items = [...(sec.items || [])];
        items[subidx] = { ...items[subidx], [field]: value };
        return { ...sec, items };
      }
      return sec;
    }));
  };
  const addSection    = () => { const type = document.getElementById("section-type").value; setSections([...sections, type === "normal" ? { type, text: "" } : { type, items: [{}] }]); };
  const deleteSection = idx  => setSections(s => s.filter((_, i) => i !== idx));
  const moveSection   = (idx, dir) => setSections(s => { const a = [...s]; const ni = idx+dir; if (ni<0||ni>=a.length) return a; [a[idx],a[ni]]=[a[ni],a[idx]]; return a; });
  const addItem       = idx  => setSections(s => s.map((sec,i) => i!==idx ? sec : { ...sec, items: [...(sec.items||[]),{}] }));
  const deleteItem    = (idx, j) => setSections(s => s.map((sec,i) => i!==idx ? sec : { ...sec, items: sec.items.filter((_,k)=>k!==j) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const qa = {
      title: form.title, slug: form.slug, question: form.question,
      answer: form.answer, conclusion: form.conclusion,
      content: sections,
      relatedQuestions: relatedQuestions,
    };
    try {
      if (isEdit) {
        await editQA(qa, editSlug, editLang);
        setMessage("Q&A updated successfully!");
      } else {
        await submitQA(qa, form.language);
        const qId = searchParams.get("questionId");
        if (qId) {
          try { await updateQuestionStatus(qId, "answered", form.language); setMessage("Q&A saved and question marked as answered!"); }
          catch  { setMessage("Q&A saved, but failed to mark question as answered."); }
        } else {
          setMessage("Q&A saved successfully!");
        }
        setForm({ language: form.language, title: "", slug: "", question: "", answer: "", conclusion: "" });
        setSections([]);
        setRelatedQuestions([]);
      }
    } catch (err) {
      setMessage("Failed to save Q&A: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const fieldCls = "w-full mb-4 rounded-lg border border-[#b5d4c3] bg-[#f6f7fa] p-[10px] text-base box-border";
  const labelCls = "mt-2 mb-[3px] block text-[var(--bg-color-header)] text-[17px] font-bold";

  return (
    <AdminLayout>
      {showRefModal && (
        <InsertRefModal onInsert={handleInsertRef} onClose={() => setShowRefModal(false)} />
      )}
      {showRelatedModal && (
        <RelatedModal
          lang={form.language}
          currentSlug={editSlug || ""}
          selected={relatedQuestions}
          onSave={handleSaveRelated}
          onClose={() => setShowRelatedModal(false)}
        />
      )}

      <div className="font-[Segoe_UI,sans-serif] bg-white max-w-[750px] mt-12 mx-auto rounded-[1.4rem] shadow-[0_6px_24px_rgba(40,115,70,0.12)] px-10 py-8">
        <h2 className="text-center text-[var(--bg-color-header)] text-[2rem] mb-5 font-[Montserrat,Arial,sans-serif]">
          {isEdit ? "Edit Q&A" : "Add a New Q&A"}
        </h2>

        {loading ? <p>Loading...</p> : (
          <form onSubmit={handleSubmit} autoComplete="off">

            <label className={labelCls}>Submission Language:</label>
            <select name="language" value={form.language} onChange={handleInput} required className={fieldCls}>
              <option value="en">English Question</option>
              <option value="ar">Arabic Question</option>
            </select>

            <label className={labelCls}>Title:</label>
            <input type="text" name="title" value={form.title} onChange={handleInput} required className={fieldCls} />

            <label className={labelCls}>Slug:</label>
            <input type="text" name="slug" value={form.slug} onChange={handleInput} required className={fieldCls} />

            <label className={labelCls}>Question:</label>
            <textarea name="question" value={form.question} onChange={handleInput} required className={`${fieldCls} min-h-[62px]`} />

            {/* Answer with Insert Reference button */}
            <div className="flex items-center justify-between mt-2 mb-[3px]">
              <span className="text-[var(--bg-color-header)] text-[17px] font-bold">Answer:</span>
              <button
                type="button"
                onClick={() => setShowRefModal(true)}
                className="text-xs px-3 py-1 rounded-full border border-[var(--bg-color-header)] text-[var(--bg-color-header)] hover:bg-[var(--bg-color-header)] hover:text-white transition-colors duration-150 font-semibold"
              >
                + Insert Reference
              </button>
            </div>
            <textarea
              ref={answerRef}
              name="answer"
              value={form.answer}
              onChange={handleInput}
              required
              className={`${fieldCls} min-h-[62px]`}
            />

            <hr className="my-[18px]" />

            {/* Dynamic sections — unchanged from your original */}
            <div>
              {sections.map((section, idx) =>
                section.type === "normal" ? (
                  <div key={idx} className="border border-[#cfe7d8] rounded-[10px] mb-[18px] bg-white p-4">
                    <label className={labelCls}>{section.type.toUpperCase()}</label>
                    <textarea required placeholder="Text" value={section.text || ""} onChange={e => handleSectionInput(idx, "text", e.target.value)} className={`${fieldCls} min-h-[62px]`} />
                    <div className="mt-[9px] flex gap-[7px]">
                      <button type="button" onClick={() => moveSection(idx,-1)} className="border border-gray-500 bg-white text-[var(--bg-color-header)] text-base py-[6px] px-3 rounded-[7px] cursor-pointer">↑</button>
                      <button type="button" onClick={() => moveSection(idx, 1)} className="border border-gray-500 bg-white text-[var(--bg-color-header)] text-base py-[6px] px-3 rounded-[7px] cursor-pointer">↓</button>
                      <button type="button" onClick={() => deleteSection(idx)}  className="border border-gray-500 bg-white text-[var(--bg-color-header)] text-base py-[6px] px-3 rounded-[7px] cursor-pointer">Delete Section</button>
                    </div>
                  </div>
                ) : (
                  <div key={idx} className="border border-[#cfe7d8] rounded-[10px] mb-[18px] bg-white p-4">
                    <label className={labelCls}>{section.type.toUpperCase()}</label>
                    {(section.items || []).map((item, subidx) => (
                      <div key={subidx} className="border-b border-[#e5e9ec] mb-[9px] pb-[7px] last:border-0">
                        <input type="text" placeholder="Reference" value={item.reference||""} required onChange={e => handleSectionInput(idx,"reference",e.target.value,subidx)} className={fieldCls} />
                        {section.type === "sunnah" && (
                          <input type="text" placeholder="Narrator" value={item.narrator||""} onChange={e => handleSectionInput(idx,"narrator",e.target.value,subidx)} className={fieldCls} />
                        )}
                        <textarea placeholder="Text"        value={item.text||""}        onChange={e => handleSectionInput(idx,"text",       e.target.value,subidx)} className={`${fieldCls} min-h-[62px]`} />
                        <textarea placeholder="Commentary"  value={item.commentary||""}  onChange={e => handleSectionInput(idx,"commentary",  e.target.value,subidx)} className={`${fieldCls} min-h-[62px]`} />
                        <button type="button" onClick={() => deleteItem(idx,subidx)} className="px-[22px] py-[10px] bg-[#c3a421] text-white rounded-[7px] cursor-pointer font-semibold">Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addItem(idx)} className="px-[22px] py-[10px] bg-[#c3a421] text-white rounded-[7px] cursor-pointer font-semibold">
                      Add {section.type} Entry
                    </button>
                    <div className="mt-[9px] flex gap-[7px]">
                      <button type="button" onClick={() => moveSection(idx,-1)} className="border border-gray-500 bg-white text-[var(--bg-color-header)] text-base py-[6px] px-3 rounded-[7px] cursor-pointer">↑</button>
                      <button type="button" onClick={() => moveSection(idx, 1)} className="border border-gray-500 bg-white text-[var(--bg-color-header)] text-base py-[6px] px-3 rounded-[7px] cursor-pointer">↓</button>
                      <button type="button" onClick={() => deleteSection(idx)}  className="px-[22px] py-[10px] bg-[#c3a421] text-white rounded-[7px] cursor-pointer font-semibold">Delete Section</button>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="flex gap-3 items-center mb-5">
              <select id="section-type" className="flex-1 rounded-lg border border-[#b5d4c3] bg-[#f6f7fa] p-[10px] text-base min-w-[120px]">
                {sectionOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <button type="button" onClick={addSection} className="bg-[var(--bg-color-header)] text-white border-none rounded-lg py-[13px] px-[18px] text-base cursor-pointer mt-[-7px]">
                Add Section
              </button>
            </div>

            <label className={labelCls}>Summary:</label>
            <textarea name="conclusion" value={form.conclusion} onChange={handleInput} required className={`${fieldCls} min-h-[62px]`} />

            <hr className="my-[18px]" />

            {/* ── RELATED ANSWERS ─────────────────────────────────────── */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-[var(--bg-color-header)] text-[17px] font-bold m-0">
                    Related Answers
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 m-0">
                    Showing {form.language === "ar" ? "Arabic" : "English"} questions — change language above to switch
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRelatedModal(true)}
                  className="text-sm px-4 py-2 rounded-lg bg-[var(--bg-color-header)] text-white font-semibold hover:opacity-85 transition-opacity"
                >
                  Browse & Select
                </button>
              </div>

              {relatedQuestions.length === 0 ? (
                <p className="text-sm text-gray-400 italic py-3 text-center border border-dashed border-gray-200 rounded-lg">
                  No related answers selected yet
                </p>
              ) : (
                <ul className="m-0 p-0 list-none space-y-2">
                  {relatedQuestions.map((rq, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-[#cfe7d8] bg-[#f8fcf9]">
                      <div>
                        <p className="m-0 text-sm font-semibold text-gray-700">{rq.slug}</p>
                        <p className="m-0 text-xs text-gray-400 mt-[2px] uppercase tracking-wide">{rq.lang}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRelatedQuestions(r => r.filter((_, idx) => idx !== i))}
                        className="text-400 hover:text-600 font-bold text-lg px-1 cursor-pointer"
                      >
                        <RxCross2 />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[var(--bg-color-header)] text-white border-none rounded-[10px] py-[13px] px-0 text-[1.16rem] font-bold w-full mt-[9px] cursor-pointer"
            >
              {loading ? "Saving..." : isEdit ? "Update Q&A" : "Save Q&A"}
            </button>
          </form>
        )}

        <div
          className="text-center mt-4 min-h-[18px] font-semibold"
          style={{ color: message.includes("success") ? "#287346" : "#b71010" }}
        >
          {message}
        </div>
      </div>
    </AdminLayout>
  );
}