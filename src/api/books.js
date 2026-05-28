// api call for eng or arabic books
import { API_BASE } from "../../config";
export async function fetchBooks(lang = "en") {
  const endpoint =
    lang === "ar"
      ? `${API_BASE}/api/books/ar`
      : `${API_BASE}/api/books/en`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error("Failed to fetch books");
  const data = await response.json();
  return data.books;
}
