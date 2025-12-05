// src/Components/ConfirmationModal.jsx
import React from "react";
import { X, Check } from "lucide-react";

export default function ConfirmationModal({ 
  open, 
  title, 
  message, 
  onConfirm, 
  onCancel 
}) {
  if (!open) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "white",
        borderRadius: "12px",
        maxWidth: "400px",
        width: "90%",
        padding: "1.5rem",
        textAlign: "center",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
      }}>
        <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem" }}>{title}</h2>
        <p style={{ color: "#475569", marginBottom: "1.5rem" }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button
            onClick={onCancel}
            style={{
              background: "#fef2f2",
              color: "#dc2626",
              border: "1px solid #fecaca",
              padding: "0.6rem 1.2rem",
              borderRadius: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <X size={16} /> Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              background: "#c3a421",
              color: "white",
              border: "none",
              padding: "0.6rem 1.2rem",
              borderRadius: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <Check size={16} /> Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
