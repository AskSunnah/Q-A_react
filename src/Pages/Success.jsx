import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.checkmark}>✓</div>
        <h1 style={styles.title}>Thank you!</h1>
        <p style={styles.message}>Your donation has been successfully processed.</p>

        {sessionId && (
          <a
            href={`/manage-subscription?session_id=${sessionId}`}
            style={styles.subscriptionBtn}
          >
            Manage My Subscription
          </a>
        )}

        <Link to="/" style={styles.homeLink}>
          ← Go back to AskSunnah
        </Link>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f7f7f7",
    minHeight: "90vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px 30px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    maxWidth: "450px",
    width: "100%",
  },
  checkmark: {
    fontSize: "60px",
    color: "#1f6f3e",
    marginBottom: "20px",
  },
  title: {
    fontSize: "28px",
    color: "#2c3e50",
    marginBottom: "10px",
  },
  message: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "25px",
  },
  subscriptionBtn: {
    display: "inline-block",
    backgroundColor: "#1f6f3e",
    color: "white",
    padding: "12px 20px",
    borderRadius: "5px",
    textDecoration: "none",
    fontSize: "16px",
    marginBottom: "20px",
  },
  homeLink: {
    display: "inline-block",
    marginTop: "10px",
    color: "#1f6f3e",
    textDecoration: "none",
    fontWeight: "bold",
  },
};
