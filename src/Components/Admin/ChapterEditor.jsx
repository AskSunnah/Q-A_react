// src/components/BookEditor/ChapterEditor.jsx
import React from "react";
import PageEditor from "../../Components/Admin/PageEditor";

export default function ChapterEditor({ chapter, onChange, onDelete, onAddPage }) {
  const updatePage = (idx, newPage) => {
    const pages = [...chapter.pages];
    pages[idx] = newPage;
    onChange({ ...chapter, pages });
  };
  const deletePage = idx => {
    const pages = chapter.pages.filter((_, i) => i !== idx);
    onChange({ ...chapter, pages });
  };
  const updateField = (field, value) => onChange({ ...chapter, [field]: value });

  return (
    <div className="chapter-block">
      <label>Chapter Title
        <input
          value={chapter.title}
          onChange={e => updateField("title", e.target.value)}
        />
      </label>
      <label>Chapter #
        <input
          type="number"
          value={chapter.number || ""}
          onChange={e => updateField("number", Number(e.target.value))}
        />
      </label>
      <div>
        {chapter.pages.map((page, idx) => (
          <PageEditor
            key={idx}
            page={page}
            onChange={newPage => updatePage(idx, newPage)}
            onDelete={() => deletePage(idx)}
            onAddBlock={() =>
              updatePage(idx, {
                ...page,
                blocks: [...(page.blocks || []), { type: "paragraph", text: "", reference: "", narrator: "", commentary: "" }]
              })
            }
          />
        ))}
        <button type="button" className="btn-add" onClick={onAddPage}>Add Page</button>
      </div>
      <button type="button" className="btn-delete" onClick={onDelete}>Delete Chapter</button>
    </div>
  );
}
