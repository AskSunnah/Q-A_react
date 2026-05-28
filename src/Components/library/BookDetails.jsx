import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBook } from "../../api/book";

const LANG_MAP = {
  en: {
    dir: "ltr",
    home: "Home",
    library: "Library",
    index: "Index of Topics",
    book: "Book",
    author: "Author",
    category: "Category",
    language: "Language",
    totalPages: "Total Pages",
    loading: "Loading...",
    error: "Error loading book",
    chapters: (slug, firstPage) => `/read/${slug}?page=${firstPage}`,
    libraryUrl: "/library",
  },
  ar: {
    dir: "rtl",
    home: "الرئيسية",
    library: "المكتبة",
    index: "فهرس المواضيع",
    book: "الكتاب",
    author: "المؤلف",
    category: "التصنيف",
    language: "اللغة",
    totalPages: "عدد الصفحات",
    loading: "جاري التحميل...",
    error: "تعذر تحميل الكتاب",
    chapters: (slug, firstPage) => `/read_ar/${slug}?page=${firstPage}`,
    libraryUrl: "/library/library_ar/library.html",
  },
};

export default function BookDetails() {
  const { lang = "en", slug } = useParams();
  const labels = LANG_MAP[lang] || LANG_MAP.en;
  const [book, setBook] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return setError(true);
    fetchBook(lang, slug)
      .then(setBook)
      .catch(() => setError(true));
  }, [lang, slug]);

  const totalPages =
    book?.chapters?.reduce((sum, ch) => sum + (ch.pages?.length || 0), 0) || 0;

  const isRtl = labels.dir === "rtl";

  return (
    <div dir={labels.dir} className="bg-[#f9f9f9] min-h-screen text-[#1e293b]">
      {/* header */}
      <header
        className="text-white px-8 py-4 text-center"
        style={{
          background:
            'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/books.jpeg")',
          backgroundSize: "auto",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-[2rem] font-bold mb-2">
          {error ? labels.error : book?.title || labels.loading}
        </h1>
      </header>

      {/* navbar */}
      <nav className="bg-[var(--bg-main)] px-6 py-4 relative z-10 font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
        <ul className="list-none m-0 p-0 flex flex-wrap justify-center gap-6">
          <li>
            <a className="nav-link" to="/">
              {labels.home}
            </a>
          </li>
          <li>
            <a className="nav-link" href={labels.libraryUrl}>
              {labels.library}
            </a>
          </li>
        </ul>
      </nav>

      {/* container */}
      <div className="max-w-[960px] mx-auto my-8 px-4">
        {/* metadata */}
        <div
          className={`my-8 text-[1rem] leading-relaxed ${isRtl ? "text-right" : "text-left"}`}
        >
          {book && !error && (
            <>
              <strong>{labels.book}:</strong> {book.title}
              <br />
              <strong>{labels.author}:</strong> {book.author}
              <br />
              <strong>{labels.category}:</strong> {book.category || "—"}
              <br />
              <strong>{labels.language}:</strong> {book.language}
              <br />
              <strong>{labels.totalPages}:</strong> {totalPages}
              <br />
            </>
          )}
        </div>

        {/* toc */}
        <div>
          <h3 className={`mt-8 ${isRtl ? "text-right" : "text-left"}`}>
            {labels.index}
          </h3>
          <ul className={`list-none ${isRtl ? "pr-0" : "pl-0"}`}>
            {book &&
              book.chapters &&
              book.chapters.map((chapter, index) => {
                const firstPage =
                  chapter.pages && chapter.pages.length > 0
                    ? chapter.pages[0].number || 1
                    : 1;
                return (
                  <li key={index} className="mb-2">
                    <a
                      href={`/library/read/${lang}/${slug}?page=${firstPage}`}
                      className="text-[var(--text-accent)] no-underline hover:underline"
                    >
                      {chapter.title}
                    </a>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
}
