import { useEffect, useState } from 'react';
import { createPortalSession } from '../api/stripe';

export default function ManageSubscription() {
  const [customerId, setCustomerId] = useState('');

  // Automatically fetch the customerId using session_id
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get('session_id');

    if (sessionId) {
      fetch(`https://asksunnah-backend-hno9.onrender.com/api/session/${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.customerId) setCustomerId(data.customerId);
        })
        .catch((err) => console.error('Error fetching customer ID:', err));
    }
  }, []);

  const handleManage = async () => {
    const portal = await createPortalSession(customerId);
    if (portal.url) window.location.href = portal.url;
  };

  return (
    <div>
      <h2>Manage Your Subscription</h2>
      <button onClick={handleManage} disabled={!customerId}>
        Go to Billing Portal
      </button>
    </div>
  );
}
