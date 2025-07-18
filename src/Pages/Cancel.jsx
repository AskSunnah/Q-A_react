import React from 'react';

export default function Cancel() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Donation Cancelled</h1>
      <p>You have cancelled the payment. If this was a mistake, please try again.</p>
      <a href="/donate">Go Back to Donate</a>
    </div>
  );
}
