// src/components/BookEditor/ChapterEditor.jsx
import React from "react";
import PageEditor from "../../Components/Admin/PageEditor";

export default function ChapterEditor({
  chapter,
  onChange,
  onDelete,
  onAddPage,
  bookId,              // <- take bookId as a prop
}) {
  const pages = chapter.pages || [];

  const updatePage = (idx, newPage) => {
    const newPages = [...pages];
    newPages[idx] = newPage;
    onChange({ ...chapter, pages: newPages });
  };

  const deletePage = (idx) => {
    const newPages = pages.filter((_, i) => i !== idx);
    onChange({ ...chapter, pages: newPages });
  };

  const updateField = (field, value) =>
    onChange({ ...chapter, [field]: value });

  return (
    <div className="chapter-block">
      <label>
        Chapter Title
        <input
          value={chapter.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </label>

      <label>
        Chapter #
        <input
          type="number"
          value={chapter.number || ""}
          onChange={(e) => updateField("number", Number(e.target.value))}
        />
      </label>

      <div>
        {pages.map((page, idx) => (
          <PageEditor
            key={idx}
            page={page}
            bookId={bookId}                        // <- use prop, not chapter.bookId
            onChange={(newPage) => updatePage(idx, newPage)}
            onDelete={() => deletePage(idx)}
            onAddBlock={() =>
              updatePage(idx, {
                ...page,
                blocks: [
                  ...(page.blocks || []),
                  {
                    type: "paragraph",
                    text: "",
                    reference: "",
                    narrator: "",
                    commentary: "",
                  },
                ],
              })
            }
          />
        ))}

        <button
          type="button"
          className="btn-add"
          onClick={onAddPage}
        >
          Add Page
        </button>
      </div>

      <button
        type="button"
        className="btn-delete"
        onClick={onDelete}
      >
        Delete Chapter
      </button>
    </div>
  );
}
