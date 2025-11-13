// // api calls for admin book management
// export async function submitBook(bookData) {
//   const res = await fetch('https://asksunnah-backend-hno9.onrender.com/api/books', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(bookData),
//   });
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Error saving book.");
//   return data;
// }

// export async function fetchBooksAdmin(lang) {
//   const endpoint = `https://asksunnah-backend-hno9.onrender.com/api/books/${lang}`;
//   const res = await fetch(endpoint);
//   if (!res.ok) throw new Error("Failed to fetch books");
//   const data = await res.json();
//   return data.books;
// }

// export async function deleteBookAdmin(lang, slug) {
//   const endpoint = `https://asksunnah-backend-hno9.onrender.com/api/books/${lang}/${slug}`;
//   const res = await fetch(endpoint, { method: "DELETE" });
//   const data = await res.json();
//   if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete book");
//   return true;
// }

// export async function fetchBookAdmin(lang, slug) {
//   const endpoint = `https://asksunnah-backend-hno9.onrender.com/api/books/${lang}/${slug}`;
//   const res = await fetch(endpoint);
//   const data = await res.json();
//   if (!res.ok || !data.book) throw new Error(data.message || "Book not found");
//   return data.book;
// }

// export async function saveBookAdmin(lang, slug, bookData) {
//   const endpoint = `https://asksunnah-backend-hno9.onrender.com/api/books/${lang}/${slug}`;
//   const res = await fetch(endpoint, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(bookData)
//   });
//   const data = await res.json();
//   if (!res.ok || !data.success) throw new Error(data.message || "Failed to save");
//   return true;
// }

// src/api/adminBook.js

// const BASE_URL = "https://asksunnah-backend-hno9.onrender.com/api";
// const BASE_URL = "http://localhost:5000";


// version 2 
// const BASE_URL = "http://localhost:5000/api";

// // --- Book APIs ---
// export async function submitBook(lang, bookData) {
//   const res = await fetch(`${BASE_URL}/books/${lang}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(bookData),
//   });
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Error saving book.");
//   return data; // created book
// }

// export async function fetchBooksAdmin(lang) {
//   const res = await fetch(`${BASE_URL}/books/${lang}`);
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Failed to fetch books");
//   return data;
// }

// export async function fetchBookAdmin(lang, slug) {
//   const res = await fetch(`${BASE_URL}/books/${lang}/${slug}`);
//   const data = await res.json();
//   if (!res.ok || !data) throw new Error(data.message || "Book not found");
//   return data;
// }

// export async function deleteBookAdmin(lang, slug) {
//   const res = await fetch(`${BASE_URL}/books/${lang}/${slug}`, { method: "DELETE" });
//   const data = await res.json();
//   if (!res.ok || !data) throw new Error(data.message || "Failed to delete book");
//   return true;
// }

// export async function saveBookAdmin(lang, slug, bookData) {
//   const res = await fetch(`${BASE_URL}/books/${lang}/${slug}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(bookData),
//   });
//   const data = await res.json();
//   if (!res.ok || !data) throw new Error(data.message || "Failed to save book");
//   return true;
// }

// // --- Chapter API ---
// export async function submitChapter(lang, bookId, chapterData) {
//   const res = await fetch(`${BASE_URL}/chapters/${lang}/${bookId}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(chapterData),
//   });
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Error saving chapter");
//   return data;
// }

// // --- Page API ---
// export async function submitPage(chapterId, pageData) {
//   const res = await fetch(`${BASE_URL}/pages/${chapterId}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(pageData),
//   });
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Error saving page");
//   return data;
// }

// // --- Block API ---
// export async function submitBlock(pageId, blockData) {
//   const res = await fetch(`${BASE_URL}/blocks/${pageId}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(blockData),
//   });
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.message || "Error saving block");
//   return data;
// }


const BASE_URL = "http://localhost:5000/api";

// --- Book APIs ---
export async function submitBook(lang, bookData) {
  const res = await fetch(`${BASE_URL}/books/${lang}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error saving book.");
  return data; // created book
}

export async function fetchBooksAdmin(lang) {
  const res = await fetch(`${BASE_URL}/books/${lang}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch books");
  return data;
}

export async function fetchBookAdmin(lang, slug) {
  const res = await fetch(`${BASE_URL}/books/${lang}/${slug}`);
  const data = await res.json();
  if (!res.ok || !data) throw new Error(data.message || "Book not found");
  return data;
}

export async function deleteBookAdmin(lang, slug) {
  const res = await fetch(`${BASE_URL}/books/${lang}/${slug}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok || !data) throw new Error(data.message || "Failed to delete book");
  return true;
}

export async function saveBookAdmin(lang, slug, bookData) {
  const res = await fetch(`${BASE_URL}/books/${lang}/${slug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  });
  const data = await res.json();
  if (!res.ok || !data) throw new Error(data.message || "Failed to save book");
  return true;
}

// Chapter
export async function submitChapter(lang, bookId, chapterData) {
  const res = await fetch(`${BASE_URL}/books/${lang}/${bookId}/chapters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chapterData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error saving chapter");
  return data;
}

// Page
export async function submitPage(chapterId, pageData) {
  const res = await fetch(`${BASE_URL}/chapters/${chapterId}/pages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pageData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error saving page");
  return data;
}


// --- Single Block API (legacy, optional) ---
export async function submitBlock(pageId, blockData) {
  const res = await fetch(`${BASE_URL}/blocks/${pageId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blockData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error saving block");
  return data;
}

// Bulk chapters (fix)
// Bulk create chapters (without pages)
export async function submitChaptersBulk(lang, bookId, chapters) {
  // Only send title (no pages)
  const payload = chapters.map(ch => ({ title: ch.title }));

  const res = await fetch(`${BASE_URL}/books/${lang}/${bookId}/chapters/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chapters: payload }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error bulk saving chapters");

  return data; // saved chapters
}


// Bulk pages (fix)
// Bulk create pages for a chapter
export async function submitPagesBulk(chapterId, pages) {
  // Each page should have only number & references
  const payload = pages.map(pg => ({
    number: pg.number,
    references: pg.references || [],
  }));

  const res = await fetch(`${BASE_URL}/chapters/${chapterId}/pages/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pages: payload }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error bulk saving pages");

  return data; // saved pages with _id
}


export async function submitBlocksBulk(pageId, blocks) {
  const res = await fetch(`${BASE_URL}/blocks/bulk/${pageId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blocks }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error bulk saving blocks");
  return data; // array of created blocks
}


// Connect pages to a chapter
export async function addPagesToChapter(chapterId, pageIds) {
  const res = await fetch(`${BASE_URL}/chapters/${chapterId}/addPages`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pageIds }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add pages to chapter");
  return data;
}
