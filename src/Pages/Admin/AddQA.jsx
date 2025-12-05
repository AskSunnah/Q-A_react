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
    if (isEdit) return; // don't override edit mode

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
  }, [isEdit]); // dependency array is correct

  // Input handlers
  const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });
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
      })
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
        i !== idx ? sec : { ...sec, items: [...(sec.items || []), {}] }
      )
    );
  const deleteItem = (idx, itemIdx) =>
    setSections((sections) =>
      sections.map((sec, i) =>
        i !== idx ? sec : { ...sec, items: sec.items.filter((_, j) => j !== itemIdx) }
      )
    );

  // Submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessage("");
  //   const qa = {
  //     title: form.title,
  //     slug: form.slug,
  //     question: form.question,
  //     answer: form.answer,
  //     conclusion: form.conclusion,
  //     content: sections,
  //   };
  //   try {
  //     if (isEdit) {
  //       await editQA(qa, editSlug, editLang);
  //     } else {
  //       await submitQA(qa, form.language);
  //     }
  //     setMessage("Saved successfully!");
  //     if (!isEdit) {
  //       setForm({ language: "en", title: "", slug: "", question: "", answer: "", conclusion: "" });
  //       setSections([]);
  //     }
  //   } catch (err) {
  //     setMessage("Failed to save. " + err.message);
  //   }
  //   setLoading(false);
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage(""); // clear previous message

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

      // Only after successful save, check if it's from a user question
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

      // Reset form only on new creation
      setForm({
        language: form.language, // keep language
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
  // --- Styles ---
  return (
    <AdminLayout>
      <style>{`
      body{
      margin: 0;
      font-family: 'Segoe UI', sans-serif;
      }
        #qa-box {
          font-family: 'Segoe UI', sans-serif;
          background: #fff;
          max-width: 650px;
          margin: 3rem auto 0 auto;
          border-radius: 1.4rem;
          box-shadow: 0 6px 24px rgba(40,115,70,0.12);
          padding: 2rem 2.5rem 2rem 2.5rem;
        }
        #qa-box h2 {
          text-align: center;
          color: var(--bg-color-header);
          font-size: 2rem;
          margin-bottom: 1.2rem;
          font-family: 'Montserrat', Arial, sans-serif;
        }
        #qa-form label {
          margin: 8px 0 3px 0;
          display: block;
          color:var(--bg-color-header);
              font-size: 17px;
    font-weight: bold;
        }
        #qa-form input, #qa-form select, #qa-form textarea {
          width: 100%;
          margin-bottom: 1rem;
          border-radius: 8px;
          border: 1.2px solid #b5d4c3;
          background: #f6f7fa;
          padding: 10px;
          font-size: 1rem;
        }
        #qa-form textarea { min-height: 62px; }
        #add-section-bar {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 1.2rem;
        }
        #section-type { flex: 1; }
        #add-section-btn {
          background:var(--bg-color-header);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 13px 18px;
          font-size: 1rem;
          cursor: pointer;
          margin-top:-7px
        }
        #add-section-btn:hover { background: var(--bg-color-header) }
        .section-block {
          border: 1px solid #cfe7d8;
          border-radius: 10px;
          margin-bottom: 18px;
          background: white;
          padding: 1rem;
        }
        .grouped-item {
          border-bottom: 1px solid #e5e9ec;
          margin-bottom: 9px;
          padding-bottom: 7px;
        }
        .grouped-item:last-child { border: none; margin-bottom: 0; }
        .section-btns {
          margin-top: 9px;
          display: flex;
          gap: 7px;
        }
        .section-btns button {
          border: 1px solid grey;
          background: white;
          color: var(--bg-color-header);
          font-size: 1rem;
          padding: 6px 12px;
          border-radius: 7px;
          cursor: pointer;
        }
        .section-btns button:hover { background: #c3a421; }
        #save-btn {
          background:var(--bg-color-header);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 13px 0;
          font-size: 1.16rem;
          font-weight: bold;
          width: 100%;
          margin-top: 9px;
          cursor: pointer;
        }
        #save-btn:hover { background:var(--bg-color-header); }
        #save-message { text-align: center; margin-top: 1rem; min-height: 18px; font-weight: 600; }
        @media (max-width: 700px) {
          #qa-box { max-width: 96vw; padding: 1.2rem 0.5rem 2rem 0.5rem;}
        }

      `}</style>
      <div id="qa-box">
        <h2>{isEdit ? "Edit Q&A" : "Add a New Q&A"}</h2>
        {loading ? <p>Loading...</p> : (
          <form id="qa-form" onSubmit={handleSubmit} autoComplete="off">
            <label htmlFor="qa-language">Submission Language:</label>
            {/* <select id="qa-language" name="language" value={form.language} onChange={handleInput} required>
              <option value="en">English Question</option>
              <option value="ar">Arabic Question</option>
            </select> */}

            <select
              id="qa-language"
              name="language"
              value={form.language}
              onChange={handleInput}
              required
            >
              <option value="en">English Question</option>
              <option value="ar">Arabic Question</option>
            </select>

            <label>Title:</label>
            <input type="text" id="qa-title" name="title" value={form.title} onChange={handleInput} required />

            <label>Slug:</label>
            <input type="text" id="qa-slug" name="slug" value={form.slug} onChange={handleInput} required />

            <label>Question:</label>
            <textarea id="qa-question" name="question" value={form.question} onChange={handleInput} required />

            <label>Answer:</label>
            <textarea id="qa-answer" name="answer" value={form.answer} onChange={handleInput} required />

            <hr style={{ margin: "18px 0" }} />

            <div id="dynamic-sections">
              {sections.map((section, idx) =>
                section.type === "normal" ? (
                  <div className="section-block" key={idx}>
                    <label>{section.type.toUpperCase()}</label>
                    <textarea
                      required
                      placeholder="Text"
                      value={section.text || ""}
                      onChange={e => handleSectionInput(idx, "text", e.target.value)}
                    />
                    <div className="section-btns">
                      <button type="button" onClick={() => moveSection(idx, -1)}>↑</button>
                      <button type="button" onClick={() => moveSection(idx, 1)}>↓</button>
                      <button className="delete-secBtn" type="button" onClick={() => deleteSection(idx)}>Delete Section</button>
                    </div>
                  </div>
                ) : (
                  <div className="section-block" key={idx}>
                    <label>{section.type.toUpperCase()}</label>
                    {(section.items || []).map((item, subidx) => (
                      <div className="grouped-item" key={subidx}>
                        <input
                          type="text"
                          placeholder="Reference"
                          value={item.reference || ""}
                          required
                          onChange={e => handleSectionInput(idx, "reference", e.target.value, subidx)}
                        />
                        {section.type === "sunnah" && (
                          <input
                            type="text"
                            placeholder="Narrator"
                            value={item.narrator || ""}
                            onChange={e => handleSectionInput(idx, "narrator", e.target.value, subidx)}
                          />
                        )}
                        <textarea
                          placeholder="Text"
                          value={item.text || ""}
                          onChange={e => handleSectionInput(idx, "text", e.target.value, subidx)}
                        />
                        <textarea
                          placeholder="Commentary"
                          value={item.commentary || ""}
                          onChange={e => handleSectionInput(idx, "commentary", e.target.value, subidx)}
                        />
                        <button style={greenButtonStyle} type="button" onClick={() => deleteItem(idx, subidx)}>Remove</button>
                      </div>
                    ))}
                    <button style={greenButtonStyle} type="button" onClick={() => addItem(idx)}>Add {section.type} Entry</button>
                    <div className="section-btns">
                      <button type="button" onClick={() => moveSection(idx, -1)}>↑</button>
                      <button type="button" onClick={() => moveSection(idx, 1)}>↓</button>
                      <button style={greenButtonStyle} type="button" onClick={() => deleteSection(idx)}>Delete Section</button>
                    </div>
                  </div>
                )
              )}
            </div>

            <div id="add-section-bar">
              <select id="section-type" style={{ minWidth: 120 }}>
                {sectionOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button type="button" id="add-section-btn" onClick={addSection}>
                Add Section
              </button>
            </div>

            <label>Summary:</label>
            <textarea id="qa-conclusion" name="conclusion" value={form.conclusion} onChange={handleInput} required />

            <br />
            <button type="submit" id="save-btn" disabled={loading}>
              {loading ? "Saving..." : (isEdit ? "Update Q&A" : "Save Q&A")}
            </button>
          </form>
        )}
        <div id="save-message" style={{ color: message.includes("success") ? "#287346" : "#b71010" }}>{message}</div>
      </div>
    </AdminLayout>

  );

}

const greenButtonStyle = {
  padding: '10px 22px',
  background: '#c3a421',
  color: '#fff',
  fontSize: '1.02rem',
  border: 'none',
  borderRadius: '7px',
  cursor: 'pointer',
  fontWeight: 600,
  marginTop: '2px',
  transition: 'background 0.2s',
};

