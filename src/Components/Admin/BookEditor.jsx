import ChapterEditor from "../../Components/Admin/ChapterEditor";

export default function BookEditor({ book, onChange }) {
  // Helper: renumber all pages globally across all chapters
  const renumberPagesGlobally = (bookDraft) => {
    let counter = 1;

    const newChapters = (bookDraft.chapters || []).map((ch) => {
      const newPages = (ch.pages || []).map((p) => ({
        ...p,
        number: counter++, // page numbers: 1,2,3,4... globally
      }));

      return {
        ...ch,
        pages: newPages,
      };
    });

    return {
      ...bookDraft,
      chapters: newChapters,
    };
  };

  const updateChapter = (idx, newChapter) => {
    const chapters = [...(book.chapters || [])];
    chapters[idx] = newChapter;

    const updatedBook = renumberPagesGlobally({
      ...book,
      chapters,
    });

    onChange(updatedBook);
  };

  const deleteChapter = (idx) => {
    const chapters = (book.chapters || []).filter((_, i) => i !== idx);

    const updatedBook = renumberPagesGlobally({
      ...book,
      chapters,
    });

    onChange(updatedBook);
  };

  const addChapter = () => {
    const chapters = [
      ...(book.chapters || []),
      {
        title: "",
        number: (book.chapters?.length || 0) + 1, // chapter number is still per chapter
        pages: [], // new chapter starts empty, pages will be numbered later
      },
    ];

    const updatedBook = renumberPagesGlobally({
      ...book,
      chapters,
    });

    onChange(updatedBook);
  };

  return (
    <div>
      {book.chapters.map((ch, idx) => (
        <ChapterEditor
          key={idx}
          chapter={ch}
          bookId={book._id}
          onChange={(newCh) => updateChapter(idx, newCh)}
          onDelete={() => deleteChapter(idx)}
          onAddPage={() => {
            // Add a new page to this chapter
            const newPage = {
              // number will be overwritten by renumberPagesGlobally
              number: 1,
              blocks: [
                {
                  type: "paragraph",
                  text: "",
                  reference: "",
                  narrator: "",
                  commentary: "",
                },
              ],
              references: [],
              audioUrl: "",
            };

            const newChapter = {
              ...ch,
              pages: [...(ch.pages || []), newPage],
            };

            updateChapter(idx, newChapter); // updateChapter will renumber globally
          }}
        />
      ))}

      <button type="button" className="btn-add" onClick={addChapter}>
        Add Chapter
      </button>
    </div>
  );
}
