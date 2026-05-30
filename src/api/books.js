// api call for eng or arabic books
import { API_BASE } from "../../config";

export async function fetchBooks(lang = "en", page = 1, limit = 9, search = "", category = "all") {
  const params = new URLSearchParams({
    page,
    limit,
  });

  if (search.trim()) params.append("search", search.trim());
  if (category !== "all") params.append("category", category);

  const endpoint = `${API_BASE}/api/books/${lang}?${params.toString()}`;

  const response = await fetch(endpoint);
  if (!response.ok) throw new Error("Failed to fetch books");

  return await response.json();
}