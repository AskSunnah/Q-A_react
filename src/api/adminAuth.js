// api call for admin authentication
import { API_BASE } from "../../config";
export async function adminLogin(username, password) {
  try {
    const res = await fetch(`${API_BASE}`, {
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

// src/api/adminAuth.js
export function logoutUser() {
  localStorage.removeItem("adminToken");
}
