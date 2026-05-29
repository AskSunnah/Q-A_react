// src/pages/AddQA.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { submitQA, editQA, getQA } from "../../api/qa";
import AdminLayout from "../../Components/Admin/AdminLayout";
import { updateQuestionStatus } from "../../api/questions";

const sectionOptions = [
  { value: "quran", label: "From Quran" },
  { value: "sunnah", label: "From Sunnah" },
  { value: "scholar", label: "From Scholar" },
  { value: "salaf", label: "From Salaf" },
  { value: "normal", label: "Normal Text" },
];

export default function AddQA() {
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("edit") === "1";
  const editSlug = searchParams.get("slug");
  const editLang = searchParams.get("lang");
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [form, setForm] = useState({
    language: "en",
    title: "",
    slug: "",
    question: "",
    answer: "",
    conclusion: "",
  });
  const [message, setMessage] = useState("");

  // Fetch for Edit mode
  useEffect(() => {
    if (isEdit && editSlug && editLang) {
      setLoading(true);
      getQA(editSlug, editLang)
        .then((data) => {
          setForm({
            language: editLang,
            title: data.heading || "",
            slug: data.slug || "",
            question: data.question || "",
            answer: data.answer || "",
            conclusion: data.conclusion || "",
          });
          setSections(data.content || []);
          setLoading(false);
        })
        .catch(() => {
          setMessage("Failed to load question for editing.");
          setLoading(false);
        });
    }
  }, [isEdit, editSlug, editLang]);

  // Pre-fill question from URL params when creating new (not editing)
  useEffect(() => {
    if (isEdit) return;

    const params = new URLSearchParams(window.location.search);
    const urlQuestion = params.get("question");
    const urlName = params.get("name");
    const urlLang = params.get("lang");

    if (urlQuestion) {
      const cleanQuestion = decodeURIComponent(urlQuestion).trim();
      setForm((prev) => ({
        ...prev,
        question: cleanQuestion,
        language: urlLang || "en",
      }));
    }

    if (urlName) {
      const name = decodeURIComponent(urlName);
      setMessage(`Answering question from: ${name}`);
    }
  }, [isEdit]);

  // Input handlers
  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSectionInput = (idx, field, value, subidx = null) => {
    setSections((sections) =>
      sections.map((sec, i) => {
        if (i !== idx) return sec;
        if (field === "text" && sec.type === "normal") {
          return { ...sec, text: value };
        }
        if (subidx !== null) {
          const items = [...(sec.items || [])];
          items[subidx] = { ...items[subidx], [field]: value };
          return { ...sec, items };
        }
        return sec;
      }),
    );
  };
  const addSection = () => {
    const type = document.getElementById("section-type").value;
    setSections([
      ...sections,
      type === "normal" ? { type, text: "" } : { type, items: [{}] },
    ]);
  };
  const deleteSection = (idx) =>
    setSections((sections) => sections.filter((_, i) => i !== idx));
  const moveSection = (idx, dir) => {
    setSections((sections) => {
      const arr = [...sections];
      const newIndex = idx + dir;
      if (newIndex < 0 || newIndex >= arr.length) return arr;
      [arr[idx], arr[newIndex]] = [arr[newIndex], arr[idx]];
      return arr;
    });
  };
  const addItem = (idx) =>
    setSections((sections) =>
      sections.map((sec, i) =>
        i !== idx ? sec : { ...sec, items: [...(sec.items || []), {}] },
      ),
    );
  const deleteItem = (idx, itemIdx) =>
    setSections((sections) =>
      sections.map((sec, i) =>
        i !== idx
          ? sec
          : { ...sec, items: sec.items.filter((_, j) => j !== itemIdx) },
      ),
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const qa = {
      title: form.title,
      slug: form.slug,
      question: form.question,
      answer: form.answer,
      conclusion: form.conclusion,
      content: sections,
    };

    try {
      if (isEdit) {
        await editQA(qa, editSlug, editLang);
        setMessage("Q&A updated successfully!");
      } else {
        await submitQA(qa, form.language);

        const questionId = searchParams.get("questionId");
        if (questionId) {
          try {
            await updateQuestionStatus(questionId, "answered", form.language);
            setMessage("Q&A saved and question marked as answered!");
          } catch (statusErr) {
            console.error("Failed to mark question as answered:", statusErr);
            setMessage("Q&A saved, but failed to mark question as answered.");
          }
        } else {
          setMessage("Q&A saved successfully!");
        }

        setForm({
          language: form.language,
          title: "",
          slug: "",
          question: "",
          answer: "",
          conclusion: "",
        });
        setSections([]);
      }
    } catch (err) {
      console.error("Save failed:", err);
      setMessage("Failed to save Q&A: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Shared field class (mirrors original: width:100%, border-radius:8px, border:#b5d4c3, bg:#f6f7fa, padding:10px, font-size:1rem, margin-bottom:1rem)
  const fieldCls =
    "w-full mb-4 rounded-lg border border-[#b5d4c3] bg-[#f6f7fa] p-[10px] text-base box-border";
  const labelCls =
    "mt-2 mb-[3px] block text-[var(--bg-color-header)] text-[17px] font-bold";

  return (
    <AdminLayout>
      {/* #qa-box */}
      <div className="font-[Segoe_UI,sans-serif] bg-white max-w-[750px] mt-12 mx-auto rounded-[1.4rem] shadow-[0_6px_24px_rgba(40,115,70,0.12)] px-10 py-8">
        {/* h2 */}
        <h2 className="text-center text-[var(--bg-color-header)] text-[2rem] mb-5 font-[Montserrat,Arial,sans-serif]">
          {isEdit ? "Edit Q&A" : "Add a New Q&A"}
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <form id="qa-form" onSubmit={handleSubmit} autoComplete="off">
            <label className={labelCls} htmlFor="qa-language">
              Submission Language:
            </label>
            <select
              id="qa-language"
              name="language"
              value={form.language}
              onChange={handleInput}
              required
              className={fieldCls}
            >
              <option value="en">English Question</option>
              <option value="ar">Arabic Question</option>
            </select>

            <label className={labelCls}>Title:</label>
            <input
              type="text"
              id="qa-title"
              name="title"
              value={form.title}
              onChange={handleInput}
              required
              className={fieldCls}
            />

            <label className={labelCls}>Slug:</label>
            <input
              type="text"
              id="qa-slug"
              name="slug"
              value={form.slug}
              onChange={handleInput}
              required
              className={fieldCls}
            />

            <label className={labelCls}>Question:</label>
            <textarea
              id="qa-question"
              name="question"
              value={form.question}
              onChange={handleInput}
              required
              className={`${fieldCls} min-h-[62px]`}
            />

            <label className={labelCls}>Answer:</label>
            <textarea
              id="qa-answer"
              name="answer"
              value={form.answer}
              onChange={handleInput}
              required
              className={`${fieldCls} min-h-[62px]`}
            />

            <hr className="my-[18px]" />

            {/* Dynamic sections */}
            <div id="dynamic-sections">
              {sections.map((section, idx) =>
                section.type === "normal" ? (
                  // .section-block
                  <div
                    key={idx}
                    className="border border-[#cfe7d8] rounded-[10px] mb-[18px] bg-white p-4"
                  >
                    <label className={labelCls}>
                      {section.type.toUpperCase()}
                    </label>
                    <textarea
                      required
                      placeholder="Text"
                      value={section.text || ""}
                      onChange={(e) =>
                        handleSectionInput(idx, "text", e.target.value)
                      }
                      className={`${fieldCls} min-h-[62px]`}
                    />
                    {/* .section-btns */}
                    <div className="mt-[9px] flex gap-[7px]">
                      <button
                        type="button"
                        onClick={() => moveSection(idx, -1)}
                        className="border border-gray-500 bg-white text-[var(--bg-color-header)] text-base py-[6px] px-3 rounded-[7px] cursor-pointer hover:bg-[#c3a421]"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(idx, 1)}
                        className="border border-gray-500 bg-white text-[var(--bg-color-header)] text-base py-[6px] px-3 rounded-[7px] cursor-pointer hover:bg-[#c3a421]"
                      >
                        ↓
                      </button>
                      <button
                        className="delete-secBtn border border-gray-500 bg-white text-[var(--bg-color-header)] text-base py-[6px] px-3 rounded-[7px] cursor-pointer hover:bg-[#c3a421]"
                        type="button"
                        onClick={() => deleteSection(idx)}
                      >
                        Delete Section
                      </button>
                    </div>
                  </div>
                ) : (
                  // .section-block (grouped)
                  <div
                    key={idx}
                    className="border border-[#cfe7d8] rounded-[10px] mb-[18px] bg-white p-4"
                  >
                    <label className={labelCls}>
                      {section.type.toUpperCase()}
                    </label>
                    {(section.items || []).map((item, subidx) => (
                      // .grouped-item
                      <div
                        key={subidx}
                        className="border-b border-[#e5e9ec] mb-[9px] pb-[7px] last:border-0 last:mb-0"
                      >
                        <input
                          type="text"
                          placeholder="Reference"
                          value={item.reference || ""}
                          required
                          onChange={(e) =>
                            handleSectionInput(
                              idx,
                              "reference",
                              e.target.value,
                              subidx,
                            )
                          }
                          className={fieldCls}
                        />
                        {section.type === "sunnah" && (
                          <input
                            type="text"
                            placeholder="Narrator"
                            value={item.narrator || ""}
                            onChange={(e) =>
                              handleSectionInput(
                                idx,
                                "narrator",
                                e.target.value,
                                subidx,
                              )
                            }
                            className={fieldCls}
                          />
                        )}
                        <textarea
                          placeholder="Text"
                          value={item.text || ""}
                          onChange={(e) =>
                            handleSectionInput(
                              idx,
                              "text",
                              e.target.value,
                              subidx,
                            )
                          }
                          className={`${fieldCls} min-h-[62px]`}
                        />
                        <textarea
                          placeholder="Commentary"
                          value={item.commentary || ""}
                          onChange={(e) =>
                            handleSectionInput(
                              idx,
                              "commentary",
                              e.target.value,
                              subidx,
                            )
                          }
                          className={`${fieldCls} min-h-[62px]`}
                        />
                        <button
                          className="px-[22px] py-[10px] bg-[#c3a421] text-white text-[1.02rem] border-0 rounded-[7px] cursor-pointer font-semibold mt-[2px] transition-colors duration-200"
                          type="button"
                          onClick={() => deleteItem(idx, subidx)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      className="px-[22px] py-[10px] bg-[#c3a421] text-white text-[1.02rem] border-0 rounded-[7px] cursor-pointer font-semibold mt-[2px] transition-colors duration-200"
                      type="button"
                      onClick={() => addItem(idx)}
                    >
                      Add {section.type} Entry
                    </button>
                    {/* .section-btns */}
                    <div className="mt-[9px] flex gap-[7px]">
                      <button
                        type="button"
                        onClick={() => moveSection(idx, -1)}
                        className="border border-gray-500 bg-white text-[var(--bg-color-header)] text-base py-[6px] px-3 rounded-[7px] cursor-pointer hover:bg-[#c3a421]"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(idx, 1)}
                        className="border border-gray-500 bg-white text-[var(--bg-color-header)] text-base py-[6px] px-3 rounded-[7px] cursor-pointer hover:bg-[#c3a421]"
                      >
                        ↓
                      </button>
                      <button
                        className="px-[22px] py-[10px] bg-[#c3a421] text-white text-[1.02rem] border-0 rounded-[7px] cursor-pointer font-semibold mt-[2px] transition-colors duration-200"
                        type="button"
                        onClick={() => deleteSection(idx)}
                      >
                        Delete Section
                      </button>
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* #add-section-bar */}
            <div className="flex gap-3 items-center mb-5">
              <select
                id="section-type"
                className="flex-1 rounded-lg border border-[#b5d4c3] bg-[#f6f7fa] p-[10px] text-base min-w-[120px]"
              >
                {sectionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {/* #add-section-btn */}
              <button
                type="button"
                onClick={addSection}
                className="bg-[var(--bg-color-header)] text-white border-none rounded-lg py-[13px] px-[18px] text-base cursor-pointer mt-[-7px] hover:bg-[var(--bg-color-header)]"
              >
                Add Section
              </button>
            </div>

            <label className={labelCls}>Summary:</label>
            <textarea
              id="qa-conclusion"
              name="conclusion"
              value={form.conclusion}
              onChange={handleInput}
              required
              className={`${fieldCls} min-h-[62px]`}
            />

            <br />

            {/* #save-btn */}
            <button
              type="submit"
              disabled={loading}
              className="bg-[var(--bg-color-header)] text-white border-none rounded-[10px] py-[13px] px-0 text-[1.16rem] font-bold w-full mt-[9px] cursor-pointer hover:bg-[var(--bg-color-header)]"
            >
              {loading ? "Saving..." : isEdit ? "Update Q&A" : "Save Q&A"}
            </button>
          </form>
        )}

        {/* #save-message */}
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
