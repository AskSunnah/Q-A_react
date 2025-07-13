// api call for individual book
export async function fetchBook(lang, slug) {
  const url = `https://asksunnah-backend-hno9.onrender.com/api/books/${lang}/${slug}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Book not found');
  const data = await res.json();
  return data.book;
}
