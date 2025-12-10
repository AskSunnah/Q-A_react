const API_BASE = "https://asksunnah-backend-hno9.onrender.com/api";  

// GET all feedback
export async function getAllFeedback(lang = "en") {
  try {
    const res = await fetch(`${API_BASE}/feedback?lang=${lang}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch feedback");
    }

    return await res.json();   // returns { success, feedbacks }
  } catch (err) {
    console.error("Fetch Feedback Error:", err);
    throw err;
  }
}

// (Optional) POST feedback if needed in the future
export async function createFeedback(data) {
  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to create feedback");
    }

    return await res.json();
  } catch (err) {
    console.error("Create Feedback Error:", err);
    throw err;
  }
}
