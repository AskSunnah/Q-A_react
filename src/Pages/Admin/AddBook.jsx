// src/pages/AddBook.jsx
import React, { useState } from "react";
import AdminHeader from "../../Components/Admin/Header";
import { submitBook } from "../../api/adminBook";
import AdminLayout from "../../Components/Admin/AdminLayout";

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

  // 🔢 Get global page number for a chapter/page index
  const getGlobalPageNumber = (chapterIdx, pageIdx) => {
    let counter = 1;
    for (let i = 0; i < chapters.length; i++) {
      for (let j = 0; j < chapters[i].pages.length; j++) {
        if (i === chapterIdx && j === pageIdx) return counter;
        counter++;
      }
    }
    return counter;
  };

  // --- Chapter Helpers ---
  const addChapter = () => setChapters([...chapters, { title: "", pages: [] }]);
  const updateChapter = (idx, newChapter) =>
    setChapters(chapters.map((ch, i) => (i === idx ? newChapter : ch)));
  const removeChapter = (idx) =>
    setChapters(chapters.filter((_, i) => i !== idx));

  const addPage = (chapterIdx) => {
    const chs = [...chapters];
    chs[chapterIdx].pages.push({
      references: [],
      blocks: [],
    });
    setChapters(chs);
  };

  const removePage = (chapterIdx, pageIdx) => {
    setChapters(
      chapters.map((ch, i) =>
        i !== chapterIdx
          ? ch
          : { ...ch, pages: ch.pages.filter((_, j) => j !== pageIdx) },
      ),
    );
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
      type: "heading",
      text: "",
      reference: "",
      narrator: "",
      commentary: "",
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
  const handleFormChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let pageCounter = 1;

    const bookData = {
      ...form,
      chapters: chapters.map((ch, chIdx) => {
        const pagesWithNumbers = ch.pages.map((pg) => ({
          ...pg,
          number: pageCounter++,
        }));
        return {
          ...ch,
          number: chIdx + 1,
          pages: pagesWithNumbers,
        };
      }),
    };

    try {
      await submitBook(bookData);
      setModal({
        show: true,
        title: "Success",
        message: "Book added successfully!",
      });
      setForm({
        title: "",
        author: "",
        description: "",
        category: "",
        language: "en",
      });
      setChapters([]);
    } catch (err) {
      setModal({ show: true, title: "Error", message: err.message });
    }
  };

  const closeModal = () => setModal({ ...modal, show: false });

  // Shared input/select/textarea classes (mirrors original: block w-full mb-4 px-3 py-[0.6rem] text-base border border-[#ccc] rounded-lg box-border)
  const fieldCls =
    "block w-full mb-4 px-3 py-[0.6rem] text-base border border-[#ccc] rounded-lg box-border";
  const labelCls = "font-bold mt-4 block text-[var(--bg-color-header)]";

  return (
    <AdminLayout>
      {/* .container */}
      <div className="w-full max-w-[850px] flex flex-col items-center mx-auto font-[Segoe_UI,sans-serif]">
        {/* h1 */}
        <h1 className="text-[2rem] mb-6 text-center text-[var(--bg-color-header)]">
          Add a New Book
        </h1>

        {/* form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] w-full"
        >
          <label className={labelCls}>Title:</label>
          <input
            className={fieldCls}
            name="title"
            value={form.title}
            onChange={handleFormChange}
            required
          />

          <label className={labelCls}>Author:</label>
          <input
            className={fieldCls}
            name="author"
            value={form.author}
            onChange={handleFormChange}
          />

          <label className={labelCls}>Description (if any):</label>
          <textarea
            className={fieldCls}
            name="description"
            value={form.description}
            onChange={handleFormChange}
          />

          <label className={labelCls}>Category:</label>
          <select
            className={fieldCls}
            name="category"
            value={form.category}
            onChange={handleFormChange}
            required
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <label className={labelCls}>Language:</label>
          <select
            className={fieldCls}
            name="language"
            value={form.language}
            onChange={handleFormChange}
            required
          >
            {LANGS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>

          {/* Chapters */}
          {chapters.map((ch, chIdx) => (
            // .page-block
            <div
              key={chIdx}
              className="border border-[#ccc] p-4 mb-8 bg-[#fefefe] relative rounded-lg"
            >
              {/* .remove-btn */}
              <button
                type="button"
                className="absolute top-[10px] right-[10px] bg-[#e53e3e] text-white border-none py-[0.3rem] px-[0.8rem] text-[0.85rem] rounded-[6px] cursor-pointer w-auto h-auto whitespace-nowrap"
                onClick={() => removeChapter(chIdx)}
              >
                Delete Chapter
              </button>

              <h3 className="text-base font-bold mt-0">Chapter {chIdx + 1}</h3>

              <label className={labelCls}>Chapter Title:</label>
              <input
                className={fieldCls}
                value={ch.title}
                onChange={(e) =>
                  updateChapter(chIdx, {
                    ...ch,
                    title: e.target.value,
                    pages: ch.pages,
                  })
                }
                required
              />

              {/* Pages */}
              <div>
                {ch.pages.map((pg, pgIdx) => (
                  // .page-block (nested)
                  <div
                    key={pgIdx}
                    className="border border-[#ccc] p-4 mb-8 bg-[#f9f9f9] relative rounded-lg"
                  >
                    <button
                      type="button"
                      className="absolute top-[10px] right-[10px] bg-[#e53e3e] text-white border-none py-[0.3rem] px-[0.8rem] text-[0.85rem] rounded-[6px] cursor-pointer w-auto h-auto whitespace-nowrap"
                      onClick={() =>
                        setDeletePageIndex({ chapter: chIdx, page: pgIdx })
                      }
                    >
                      Delete Page
                    </button>

                    <h4 className="text-sm font-bold mt-0">
                      Page {getGlobalPageNumber(chIdx, pgIdx)}
                    </h4>

                    <label className={labelCls}>References:</label>
                    {pg.references.length === 0 && (
                      <p className="italic text-[#888]">
                        No references added yet.
                      </p>
                    )}
                    {pg.references.map((ref, refIdx) => (
                      <div
                        key={refIdx}
                        className="flex items-center gap-2 mb-2"
                      >
                        <input
                          className="flex-1 mb-0 px-3 py-[0.6rem] text-base border border-[#ccc] rounded-lg box-border"
                          value={ref}
                          onChange={(e) =>
                            updateReference(
                              chIdx,
                              pgIdx,
                              refIdx,
                              e.target.value,
                            )
                          }
                          placeholder="Reference"
                        />
                        <button
                          type="button"
                          className="bg-[#e53e3e] text-white border-none py-[0.3rem] px-[0.8rem] text-[0.85rem] rounded-[6px] cursor-pointer w-auto h-auto whitespace-nowrap"
                          onClick={() => removeReference(chIdx, pgIdx, refIdx)}
                        >
                          Delete reference
                        </button>
                      </div>
                    ))}
                    {/* .add-btn */}
                    <button
                      type="button"
                      className="bg-[var(--bg-color-header)] text-white border-none py-2 px-4 mt-2 cursor-pointer font-bold rounded-lg w-fit"
                      onClick={() => addReference(chIdx, pgIdx)}
                    >
                      + Add Reference
                    </button>

                    <hr className="my-6 border-t border-[#ccc]" />

                    <label className={labelCls}>Content:</label>
                    {pg.blocks.length === 0 && (
                      <p className="italic text-[#888]">
                        No content on this page yet.
                      </p>
                    )}

                    {pg.blocks.map((block, blockIdx) => (
                      // .block
                      <div
                        key={blockIdx}
                        className="border border-dashed border-[#999] my-4 p-4 bg-[#f9f9f9] relative rounded-lg box-border"
                      >
                        <button
                          type="button"
                          className="absolute top-[10px] right-[10px] bg-[#e53e3e] text-white border-none py-[0.3rem] px-[0.8rem] text-[0.85rem] rounded-[6px] cursor-pointer w-auto h-auto whitespace-nowrap"
                          onClick={() => removeBlock(chIdx, pgIdx, blockIdx)}
                        >
                          Delete Content
                        </button>

                        <label className={labelCls}>Type</label>
                        <select
                          className={fieldCls}
                          value={block.type}
                          onChange={(e) =>
                            updateBlock(chIdx, pgIdx, blockIdx, {
                              ...block,
                              type: e.target.value,
                            })
                          }
                        >
                          <option value="heading">Heading</option>
                          <option value="paragraph">Paragraph</option>
                          <option value="hadith">Hadith</option>
                          <option value="ayah">Ayah</option>
                          <option value="quote">Quote</option>
                        </select>

                        <label className={labelCls}>Text</label>
                        <textarea
                          className={fieldCls}
                          value={block.text}
                          onChange={(e) =>
                            updateBlock(chIdx, pgIdx, blockIdx, {
                              ...block,
                              text: e.target.value,
                            })
                          }
                          required
                        />

                        {["hadith", "ayah", "quote"].includes(block.type) && (
                          <>
                            <label className={labelCls}>Reference</label>
                            <input
                              className={fieldCls}
                              value={block.reference}
                              onChange={(e) =>
                                updateBlock(chIdx, pgIdx, blockIdx, {
                                  ...block,
                                  reference: e.target.value,
                                })
                              }
                            />
                          </>
                        )}

                        {block.type === "hadith" && (
                          <>
                            <label className={labelCls}>Narrator</label>
                            <input
                              className={fieldCls}
                              value={block.narrator}
                              onChange={(e) =>
                                updateBlock(chIdx, pgIdx, blockIdx, {
                                  ...block,
                                  narrator: e.target.value,
                                })
                              }
                            />
                          </>
                        )}

                        {["hadith", "ayah", "quote"].includes(block.type) && (
                          <>
                            <label className={labelCls}>Commentary</label>
                            <textarea
                              className={fieldCls}
                              value={block.commentary}
                              onChange={(e) =>
                                updateBlock(chIdx, pgIdx, blockIdx, {
                                  ...block,
                                  commentary: e.target.value,
                                })
                              }
                            />
                          </>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      className="bg-[var(--bg-color-header)] text-white border-none py-2 px-4 mt-2 cursor-pointer font-bold rounded-lg w-fit"
                      onClick={() => addBlock(chIdx, pgIdx)}
                    >
                      + Add Content on Page
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="bg-[var(--bg-color-header)] text-white border-none py-2 px-4 mt-2 cursor-pointer font-bold rounded-lg w-fit"
                  onClick={() => addPage(chIdx)}
                >
                  + Add Page
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="bg-[var(--bg-color-header)] text-white border-none py-2 px-4 mt-2 cursor-pointer font-bold rounded-lg w-fit"
            onClick={addChapter}
          >
            + Add Chapter
          </button>

          <br />
          <br />

          <button
            type="submit"
            className="bg-[var(--bg-color-header)] text-white border-none py-[0.7rem] px-[1.4rem] rounded-lg text-base font-bold cursor-pointer mt-6 w-full block transition-colors duration-300 hover:bg-[#1f5c38]"
          >
            Submit Book
          </button>
        </form>
      </div>

      {/* Success/Error Modal */}
      {modal.show && (
        <div className="block fixed top-5 left-1/2 -translate-x-1/2 bg-white text-[#1e293b] border border-[#ccc] py-4 px-8 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[9999] w-[90%] max-w-[600px] text-center text-base">
          <strong className="block text-[1.2rem] mb-2">{modal.title}</strong>
          <span>{modal.message}</span>
          <br />
          <br />
          <button
            onClick={closeModal}
            className="bg-[#287346] text-white border-none py-2 px-4 font-bold rounded-[6px] cursor-pointer"
          >
            Close
          </button>
        </div>
      )}

      {/* Delete Page Confirmation Modal */}
      {deletePageIndex && (
        <div className="block fixed top-5 left-1/2 -translate-x-1/2 bg-white text-[#1e293b] border border-[#ccc] py-6 px-8 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[10000] w-[90%] max-w-[400px] text-center text-base">
          <strong className="block text-[1.1rem] mb-3">
            Delete Page #{deletePageIndex.page + 1}
          </strong>
          <span>
            Are you sure you want to delete Page #{deletePageIndex.page + 1}?
          </span>
          <br />
          <br />
          <button
            className="bg-[#287346] text-white border-none py-2 px-5 font-bold rounded-[6px] cursor-pointer mr-4"
            onClick={() =>
              removePage(deletePageIndex.chapter, deletePageIndex.page)
            }
          >
            Yes
          </button>
          <button
            className="bg-[#e53e3e] text-white border-none py-2 px-5 font-bold rounded-[6px] cursor-pointer"
            onClick={() => setDeletePageIndex(null)}
          >
            No
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
