export const createCheckoutSession = async (data) => {
  const res = await fetch('https://asksunnah-backend-hno9.onrender.com/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const createPortalSession = async (customerId) => {
  const res = await fetch('https://asksunnah-backend-hno9.onrender.com/api/create-portal-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId }),
  });
  return await res.json();
};
