//// api call for eng or arabic books
export async function fetchBooks(lang = "en") {
  const endpoint =
    lang === "ar"
      ? "https://asksunnah-backend-hno9.onrender.com/api/books/ar"
      : "https://asksunnah-backend-hno9.onrender.com/api/books/en";
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error("Failed to fetch books");
  const data = await response.json();
  return data.books;
}
