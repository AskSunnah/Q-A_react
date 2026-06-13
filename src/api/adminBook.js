// api calls for admin book management
import { API_BASE } from "../../config";

export async function submitBook(bookData) {
  const res = await fetch(`${API_BASE}/api/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Error saving book.");
  }
  return data;
}
export async function fetchBooksAdmin(
  lang = "en",
  page = 1,
  limit = 20,
  search = ""
) {
  const params = new URLSearchParams();

  params.set("page", page);
  params.set("limit", limit);

  if (search.trim()) {
    params.set("search", search.trim());
  }

  const endpoint =
    lang === "ar"
      ? `${API_BASE}/api/books/ar?${params.toString()}`
      : `${API_BASE}/api/books/en?${params.toString()}`;

  const res = await fetch(endpoint);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch books");
  }

  return data;
}
export async function deleteBookAdmin(lang, slug) {
  const endpoint = `${API_BASE}/api/books/${lang}/${slug}`;

  const res = await fetch(endpoint, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to delete book");
  }
  return true;
}

export async function fetchBookAdmin(lang, slug) {
  const endpoint = `${API_BASE}/api/books/${lang}/${slug}`;

  const res = await fetch(endpoint);
  const data = await res.json();

  if (!res.ok || !data.book) {
    throw new Error(data.message || "Book not found");
  }

  return data.book;
}

export async function saveBookAdmin(lang, slug, bookData) {
  const endpoint = `${API_BASE}/api/books/${lang}/${slug}`;

  const res = await fetch(endpoint, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to save");
  }
  return true;
}
// REORDER BOOKS ADMIN
export async function reorderBooksAdmin(lang, bookId, newOrder) {
  const endpoint = `${API_BASE}/api/books/admin/reorder`;

  const res = await fetch(endpoint, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: lang,
      bookId,
      newOrder: Number(newOrder),
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to reorder book");
  }

  return data.books;
}