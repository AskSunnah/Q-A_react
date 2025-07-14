// src/api/books.js

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
