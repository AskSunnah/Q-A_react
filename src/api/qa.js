// for admin add qa
export async function submitQA(qa, lang = "en") {
  const endpoint =
    lang === "ar"
      ? "/api/admin/submit_ar"
      : "/api/admin/submit";
  const res = await fetch(
    "https://asksunnah-backend-hno9.onrender.com" + endpoint,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(qa),
    }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Edit an existing Q&A
export async function editQA(qa, slug, lang = "en") {
  const endpoint =
    lang === "ar"
      ? `/api/admin/edit_ar/${slug}`
      : `/api/admin/edit/${slug}`;
  const res = await fetch(
    "https://asksunnah-backend-hno9.onrender.com" + endpoint,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(qa),
    }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Get Q&A by slug/lang (for edit form)
export async function getQA(slug, lang = "en") {
  const endpoint =
    lang === "ar"
      ? `/api/ar/questions/${slug}`
      : `/api/questions/${slug}`;
  const res = await fetch(
    "https://asksunnah-backend-hno9.onrender.com" + endpoint
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
