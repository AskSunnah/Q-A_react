// src/pages/AddBook.jsx
import React, { useState , useEffect} from "react";
import AdminHeader from "../../Components/Admin/Header";
import { submitBook } from "../../api/adminBook";

const CATEGORIES = [
  { value: "", label: "-- Select Category --" },
  { value: "Aqeedah", label: "Aqeedah Books" },
  { value: "Fiqh", label: "Fiqh" },
  { value: "Hadith", label: "Hadith" },
];

const LANGS = [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
];



export default function AddBook() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    language: "en",
  });
  const [chapters, setChapters] = useState([]);
  const [modal, setModal] = useState({ show: false, title: "", message: "" });
  const [deletePageIndex, setDeletePageIndex] = useState(null);

  // --- Chapter Helpers ---
  const addChapter = () =>
    setChapters([...chapters, { title: "", pages: [] }]);
  const updateChapter = (idx, newChapter) =>
    setChapters(chapters.map((ch, i) => (i === idx ? newChapter : ch)));
  const removeChapter = idx =>
    setChapters(chapters.filter((_, i) => i !== idx));

  // --- Page Helpers ---
  // const addPage = chapterIdx => {
  //   const chs = [...chapters];
  //   chs[chapterIdx].pages.push({
  //     references: [""],
  //     blocks: [{ type: "heading", text: "", reference: "", narrator: "", commentary: "" }]
  //   });
  //   setChapters(chs);
  // };

  const addPage = chapterIdx => {
    const chs = [...chapters];
    chs[chapterIdx].pages.push({
      references: [],
      blocks: []
    });
    setChapters(chs);
  };

  const removePage = (chapterIdx, pageIdx) => {
    setChapters(chapters.map((ch, i) =>
      i !== chapterIdx ? ch : { ...ch, pages: ch.pages.filter((_, j) => j !== pageIdx) }
    ));
    setDeletePageIndex(null);
  };

  // --- Reference Helpers ---
  const addReference = (chapterIdx, pageIdx) => {
    const chs = [...chapters];
    chs[chapterIdx].pages[pageIdx].references.push("");
    setChapters(chs);
  };
  const updateReference = (chapterIdx, pageIdx, refIdx, val) => {
    const chs = [...chapters];
    chs[chapterIdx].pages[pageIdx].references[refIdx] = val;
    setChapters(chs);
  };
  const removeReference = (chapterIdx, pageIdx, refIdx) => {
    const chs = [...chapters];
    chs[chapterIdx].pages[pageIdx].references.splice(refIdx, 1);
    setChapters(chs);
  };

  // --- Block Helpers ---
  const addBlock = (chapterIdx, pageIdx) => {
    const chs = [...chapters];
    chs[chapterIdx].pages[pageIdx].blocks.push({
      type: "heading", text: "", reference: "", narrator: "", commentary: ""
    });
    setChapters(chs);
  };
  const updateBlock = (chapterIdx, pageIdx, blockIdx, block) => {
    const chs = [...chapters];
    chs[chapterIdx].pages[pageIdx].blocks[blockIdx] = block;
    setChapters(chs);
  };
  const removeBlock = (chapterIdx, pageIdx, blockIdx) => {
    const chs = [...chapters];
    chs[chapterIdx].pages[pageIdx].blocks.splice(blockIdx, 1);
    setChapters(chs);
  };

  // --- Form Handlers ---
  const handleFormChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const bookData = {
      ...form,
      chapters: chapters.map((ch, chIdx) => ({
        ...ch,
        number: chIdx + 1,
        pages: ch.pages.map((pg, pgIdx) => ({
          ...pg,
          number: pgIdx + 1,
        })),
      })),
    };
    try {
      await submitBook(bookData);
      setModal({ show: true, title: "Success", message: "Book added successfully!" });
      setForm({ title: "", author: "", description: "", category: "", language: "en" });
      setChapters([]);
    } catch (err) {
      setModal({ show: true, title: "Error", message: err.message });
    }
  };

  // --- Modal Helper ---
  const closeModal = () => setModal({ ...modal, show: false });

  // --- Inline Styles ---
  return (
    <div style={{ background: "#f4f6f8", minHeight: "100vh" }}>
      <AdminHeader />
      <style>{`

        body{
        font-family: 'Segoe UI', sans-serif;
        }
        .container {
            width: 100%;
            max-width: 850px;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0 auto;
              font-family: 'Segoe UI', sans-serif;
        }

        h1 {
            font-size: 2rem;
            margin-bottom: 1.5rem;
            text-align: center;
            color: #1f6f3e;
        }

        form {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            width: 100%;
        }

        input,
        textarea,
        select,
        button {
            display: block;
            width: 100%;
            margin-bottom: 1rem;
            padding: 0.6rem 0.8rem;
            font-size: 1rem;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-sizing: border-box;
        }

        label {
            font-weight: bold;
            margin-top: 1rem;
            display: block;
            color: #1f6f3e;
        }

        .page-block {
            border: 1px solid #ccc;
            padding: 1rem;
            margin-bottom: 2rem;
            background: #fefefe;
            position: relative;
            border-radius: 8px;
        }

        .block {
            border: 1px dashed #999;
            margin: 1rem 0;
            padding: 1rem;
            background: #f9f9f9;
            position: relative;
            border-radius: 8px;
            box-sizing: border-box;
        }

        button.add-btn {
            background: #287346;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            margin-top: 0.5rem;
            cursor: pointer;
            font-weight: bold;
            border-radius: 8px;
            width: fit-content;
        }

        .remove-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #e53e3e;
            color: white;
            border: none;
            padding: 0.3rem 0.8rem;
            font-size: 0.85rem;
            border-radius: 6px;
            cursor: pointer;
            width: fit-content;
            height: auto;
            white-space: nowrap;
        }

        form button[type="submit"] {
            background-color: #287346;
            color: white;
            border: none;
            padding: 0.7rem 1.4rem;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s ease;
            margin-top: 1.5rem;
        }

        form button[type="submit"]:hover {
            background-color: #1f5c38;
        }
    `}</style>
      <div className="container">
        <h1>Add a New Book</h1>
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input name="title" value={form.title} onChange={handleFormChange} required />

          <label>Author:</label>
          <input name="author" value={form.author} onChange={handleFormChange} />

          <label>Description (if any):</label>
          <textarea name="description" value={form.description} onChange={handleFormChange} />

          <label>Category:</label>
          <select name="category" value={form.category} onChange={handleFormChange} required>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>

          <label>Language:</label>
          <select name="language" value={form.language} onChange={handleFormChange} required>
            {LANGS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>

          {/* Chapters */}
          {chapters.map((ch, chIdx) => (
            <div className="page-block" key={chIdx}>
              <button type="button" className="remove-btn" onClick={() => removeChapter(chIdx)}>Delete Chapter</button>
              <h3>Chapter {chIdx + 1}</h3>
              <label>Chapter Title:</label>
              <input
                value={ch.title}
                onChange={e => updateChapter(chIdx, { ...ch, title: e.target.value, pages: ch.pages })}
                required
              />
              {/* Pages */}
              <div>
                {ch.pages.map((pg, pgIdx) => (
                  <div className="page-block" style={{ background: "#f9f9f9" }} key={pgIdx}>
                    <button type="button" className="remove-btn" onClick={() => setDeletePageIndex({ chapter: chIdx, page: pgIdx })}>Delete Page</button>
                    <h4>Page {pgIdx + 1}</h4>
                    {/* <label>References:</label>
                    {pg.references.map((ref, refIdx) => (
                      <div key={refIdx} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <input
                          style={{ flex: 1 }}
                          value={ref}
                          onChange={e => updateReference(chIdx, pgIdx, refIdx, e.target.value)}
                          placeholder="Reference"
                        />
                        <button type="button" className="remove-btn" style={{ position: "static" }}
                          onClick={() => removeReference(chIdx, pgIdx, refIdx)}>
                          Delete reference
                        </button>
                      </div>
                    ))}
                    <button type="button" className="add-btn" onClick={() => addReference(chIdx, pgIdx)}>+ Add Reference</button> */}
<label>References:</label>
{pg.references.length === 0 && (
  <p style={{ fontStyle: "italic", color: "#888" }}>No references added yet.</p>
)}
{pg.references.map((ref, refIdx) => (
  <div key={refIdx} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
    <input
      style={{ flex: 1 }}
      value={ref}
      onChange={e => updateReference(chIdx, pgIdx, refIdx, e.target.value)}
      placeholder="Reference"
    />
    <button
      type="button"
      className="remove-btn"
      style={{ position: "static" }}
      onClick={() => removeReference(chIdx, pgIdx, refIdx)}
    >
      Delete reference
    </button>
  </div>
))}
<button type="button" className="add-btn" onClick={() => addReference(chIdx, pgIdx)}>+ Add Reference</button>


                    <hr style={{ margin: "1.5rem 0", borderTop: "1px solid #ccc" }} />
                    {/* <label>Content:</label>
                    {pg.blocks.map((block, blockIdx) => (
                      <div className="block" key={blockIdx}>
                        <button type="button" className="remove-btn" onClick={() => removeBlock(chIdx, pgIdx, blockIdx)}>Delete Content</button>
                        <label>Type</label>
                        <select
                          value={block.type}
                          onChange={e => updateBlock(chIdx, pgIdx, blockIdx, { ...block, type: e.target.value })}
                        >
                          <option value="heading">Heading</option>
                          <option value="paragraph">Paragraph</option>
                          <option value="hadith">Hadith</option>
                          <option value="ayah">Ayah</option>
                          <option value="quote">Quote</option>
                        </select>
                        <label>Text</label>
                        <textarea
                          value={block.text}
                          onChange={e => updateBlock(chIdx, pgIdx, blockIdx, { ...block, text: e.target.value })}
                          required
                        />
                        {["hadith", "ayah", "quote"].includes(block.type) && (
                          <>
                            <label>Reference</label>
                            <input
                              value={block.reference}
                              onChange={e => updateBlock(chIdx, pgIdx, blockIdx, { ...block, reference: e.target.value })}
                            />
                          </>
                        )}
                        {block.type === "hadith" && (
                          <>
                            <label>Narrator</label>
                            <input
                              value={block.narrator}
                              onChange={e => updateBlock(chIdx, pgIdx, blockIdx, { ...block, narrator: e.target.value })}
                            />
                          </>
                        )}
                        {["hadith", "ayah", "quote"].includes(block.type) && (
                          <>
                            <label>Commentary</label>
                            <textarea
                              value={block.commentary}
                              onChange={e => updateBlock(chIdx, pgIdx, blockIdx, { ...block, commentary: e.target.value })}
                            />
                          </>
                        )}
                      </div>
                    ))}
                    <button type="button" className="add-btn" onClick={() => addBlock(chIdx, pgIdx)}>+ Add Content on Page</button> */}
                    <label>Content:</label>
{pg.blocks.length === 0 && (
  <p style={{ fontStyle: "italic", color: "#888" }}>No content on this page yet.</p>
)}
{pg.blocks.map((block, blockIdx) => (
  <div className="block" key={blockIdx}>
    <button type="button" className="remove-btn" onClick={() => removeBlock(chIdx, pgIdx, blockIdx)}>
      Delete Content
    </button>

    <label>Type</label>
    <select
      value={block.type}
      onChange={e => updateBlock(chIdx, pgIdx, blockIdx, { ...block, type: e.target.value })}
    >
      <option value="heading">Heading</option>
      <option value="paragraph">Paragraph</option>
      <option value="hadith">Hadith</option>
      <option value="ayah">Ayah</option>
      <option value="quote">Quote</option>
    </select>

    <label>Text</label>
    <textarea
      value={block.text}
      onChange={e => updateBlock(chIdx, pgIdx, blockIdx, { ...block, text: e.target.value })}
      required
    />

    {["hadith", "ayah", "quote"].includes(block.type) && (
      <>
        <label>Reference</label>
        <input
          value={block.reference}
          onChange={e => updateBlock(chIdx, pgIdx, blockIdx, { ...block, reference: e.target.value })}
        />
      </>
    )}

    {block.type === "hadith" && (
      <>
        <label>Narrator</label>
        <input
          value={block.narrator}
          onChange={e => updateBlock(chIdx, pgIdx, blockIdx, { ...block, narrator: e.target.value })}
        />
      </>
    )}

    {["hadith", "ayah", "quote"].includes(block.type) && (
      <>
        <label>Commentary</label>
        <textarea
          value={block.commentary}
          onChange={e => updateBlock(chIdx, pgIdx, blockIdx, { ...block, commentary: e.target.value })}
        />
      </>
    )}
  </div>
))}
<button type="button" className="add-btn" onClick={() => addBlock(chIdx, pgIdx)}>
  + Add Content on Page
</button>


                  </div>
                ))}
                <button type="button" className="add-btn" onClick={() => addPage(chIdx)}>+ Add Page</button>
              </div>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addChapter}>+ Add Chapter</button>
          <br /><br />
          <button type="submit">Submit Book</button>
        </form>
      </div>
      {/* Modal */}
      {modal.show && (
        <div style={{
          display: "block", position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)",
          background: "#fff", color: "#1e293b", border: "1px solid #ccc", padding: "1rem 2rem", borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 9999, width: "90%", maxWidth: 600, textAlign: "center", fontSize: "1rem"
        }}>
          <strong style={{ display: "block", fontSize: "1.2rem", marginBottom: "0.5rem" }}>{modal.title}</strong>
          <span>{modal.message}</span>
          <br /><br />
          <button onClick={closeModal} style={{
            background: "#287346", color: "white", border: "none", padding: "0.5rem 1rem",
            fontWeight: "bold", borderRadius: "6px", cursor: "pointer"
          }}>Close</button>
        </div>
      )}
      {/* Delete Page Modal */}
      {deletePageIndex && (
        <div style={{
          display: "block", position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)",
          background: "#fff", color: "#1e293b", border: "1px solid #ccc", padding: "1.5rem 2rem", borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 10000, width: "90%", maxWidth: 400, textAlign: "center", fontSize: "1rem"
        }}>
          <strong style={{ display: "block", fontSize: "1.1rem", marginBottom: "0.7rem" }}>
            Delete Page #{deletePageIndex.page + 1}
          </strong>
          <span>Are you sure you want to delete Page #{deletePageIndex.page + 1}?</span>
          <br /><br />
          <button style={{
            background: "#287346", color: "white", border: "none", padding: "0.5rem 1.2rem",
            fontWeight: "bold", borderRadius: "6px", cursor: "pointer", marginRight: "1rem"
          }} onClick={() => removePage(deletePageIndex.chapter, deletePageIndex.page)}>Yes</button>
          <button style={{
            background: "#e53e3e", color: "white", border: "none", padding: "0.5rem 1.2rem",
            fontWeight: "bold", borderRadius: "6px", cursor: "pointer"
          }} onClick={() => setDeletePageIndex(null)}>No</button>
        </div>
      )}
    </div>
  );
}
