import ChapterEditor from "../../Components/Admin/ChapterEditor";

export default function BookEditor({ book, onChange }) {
  const updateChapter = (idx, newChapter) => {
    const chapters = [...book.chapters];
    chapters[idx] = newChapter;
    onChange({ ...book, chapters });
  };
  const deleteChapter = idx => {
    const chapters = book.chapters.filter((_, i) => i !== idx);
    onChange({ ...book, chapters });
  };
  const addChapter = () =>
    onChange({ ...book, chapters: [...(book.chapters || []), { title: "", number: (book.chapters?.length || 0) + 1, pages: [] }] });

  return (
    <div>
      {book.chapters.map((ch, idx) => (
        <ChapterEditor
          key={idx}
          chapter={ch}
          onChange={newCh => updateChapter(idx, newCh)}
          onDelete={() => deleteChapter(idx)}
          onAddPage={() =>
            updateChapter(idx, {
              ...ch,
              pages: [...(ch.pages || []), { number: (ch.pages?.length || 0) + 1, blocks: [], references: [] }]
            })
          }
        />
      ))}
      <button type="button" className="btn-add" onClick={addChapter}>Add Chapter</button>
    </div>
  );
}
