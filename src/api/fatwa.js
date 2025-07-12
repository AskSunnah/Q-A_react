export const fetchAllFatwas = async () => {
  const response = await fetch('https://asksunnah-backend-hno9.onrender.com/api/all');
  if (!response.ok) {
    throw new Error('Failed to fetch fatwas');
  }
  const data = await response.json();
  return data;
};

export const fetchAllFatwasArabic = async () => {
  try {
    const response = await fetch('https://asksunnah-backend-hno9.onrender.com/api/ar/all');
    if (!response.ok) throw new Error('Failed to fetch Arabic fatwas');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[fetchAllFatwasArabic]', error);
    return [];
  }
};


export const fetchFatwaBySlug = async (slug) => {
  try {
    const response = await fetch(`https://asksunnah-backend-hno9.onrender.com/api/questions/${slug}`);
    if (!response.ok) throw new Error('Fatwa not found');
    return await response.json();
  } catch (error) {
    console.error("Error fetching fatwa:", error);
    return null;
  }
};
