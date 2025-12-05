const API_BASE = 'https://asksunnah-backend-hno9.onrender.com/api'; // adjust your backend URL
// const API_BASE = 'http://localhost:5000/api'; // adjust your backend URL

// Submit a question
export const submitQuestion = async ({ name, email, question, language = 'en' }) => {
    try {
        const response = await fetch(`${API_BASE}/user-questions/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, question, language }),
        });


        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to submit question');
        return data;


    } catch (err) {
        console.error('API submitQuestion error:', err);
        throw err;
    }
};

// Get all questions (no auth)
export const getAllQuestions = async (language = 'en') => {
    const response = await fetch(`${API_BASE}/user-questions/admin?language=${language}`);
    const data = await response.json();
    return data;
};

// Update question status (no auth)
export const updateQuestionStatus = async (id, status, language = 'en') => {
    const response = await fetch(`${API_BASE}/user-questions/admin/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, language }),
    });
    return response.json();
};

// Delete a question (no auth)
export const deleteQuestion = async (id, language = 'en') => {
    const response = await fetch(`${API_BASE}/user-questions/admin/${id}?language=${language}`, {
        method: 'DELETE',
    });
    return response.json();
};
