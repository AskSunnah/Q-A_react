// api calls for admin book management
export async function submitBook(bookData) {
  const res = await fetch('https://asksunnah-backend-hno9.onrender.com/api/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error saving book.");
  return data;
}

export async function fetchBooksAdmin(lang) {
  const endpoint = `https://asksunnah-backend-hno9.onrender.com/api/books/${lang}`;
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error("Failed to fetch books");
  const data = await res.json();
  return data.books;
}

export async function deleteBookAdmin(lang, slug) {
  const endpoint = `https://asksunnah-backend-hno9.onrender.com/api/books/${lang}/${slug}`;
  const res = await fetch(endpoint, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete book");
  return true;
}

export async function fetchBookAdmin(lang, slug) {
  const endpoint = `https://asksunnah-backend-hno9.onrender.com/api/books/${lang}/${slug}`;
  const res = await fetch(endpoint);
  const data = await res.json();
  if (!res.ok || !data.book) throw new Error(data.message || "Book not found");
  return data.book;
}

export async function saveBookAdmin(lang, slug, bookData) {
  const endpoint = `https://asksunnah-backend-hno9.onrender.com/api/books/${lang}/${slug}`;
  const res = await fetch(endpoint, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData)
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to save");
  return true;
}