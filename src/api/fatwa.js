export const fetchAllFatwas = async () => {
  const response = await fetch('https://asksunnah-backend-hno9.onrender.com/api/all');
  if (!response.ok) {
    throw new Error('Failed to fetch fatwas');
  }
  const data = await response.json();
  return data;
};
