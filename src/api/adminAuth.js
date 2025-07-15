// api call for admin authentication
export async function adminLogin(username, password) {
  try {
    const API_URL = "https://asksunnah-backend-hno9.onrender.com/admin/login";
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    return data;
  } catch {
    return { success: false, message: "Network error" };
  }
}
