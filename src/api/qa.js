import { API_BASE } from "../../config";
// for admin add qa, edit, delete and all qa
export async function submitQA(qa, lang = "en") {
  const endpoint =
    lang === "ar"
      ? "/api/admin/submit_ar"
      : "/api/admin/submit";
  const res = await fetch(
    `${API_BASE}` + endpoint,
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
    `${API_BASE}` + endpoint,
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
    `${API_BASE}` + endpoint
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function getAllQuestions(lang = "en") {
  const url =
    lang === "ar"
      ? `${API_BASE}/api/ar/all`
      : `${API_BASE}/api/all`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteQuestion(lang, slug) {
  const url =
    lang === "ar"
      ? `${API_BASE}/api/admin/delete_ar/${slug}`
      : `${API_BASE}/api/admin/delete/${slug}`;
  const res = await fetch(url, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete!");
  return true;
}