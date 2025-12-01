import React, { useState } from "react";
import BlockEditor from "../../Components/Admin/BlockEditor";

export default function PageEditor({ page, onChange, onDelete, onAddBlock, bookId }) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const updateBlock = (idx, newBlock) => {
    const blocks = [...page.blocks];
    blocks[idx] = newBlock;
    onChange({ ...page, blocks });
  };

  const deleteBlock = (idx) => {
    const blocks = page.blocks.filter((_, i) => i !== idx);
    onChange({ ...page, blocks });
  };

  const updateField = (field, value) => onChange({ ...page, [field]: value });

  const handleRefsChange = (e) =>
    updateField(
      "references",
      e.target.value.split(",").map((r) => r.trim()).filter(Boolean)
    );

  // 🎧 Handle Audio Link change
  const handleAudioChange = (e) => {
    updateField("audioUrl", e.target.value);
  };

  // 🎧 Save Audio Link to backend (debug version)
const handleSaveAudio = async () => {
  if (!page.audioUrl || !page.audioUrl.startsWith("http")) {
    alert("⚠️ Please enter a valid audio link (must start with http)");
    return;
  }
console.log("Saving audio for", { bookId, pageNumber: page.number, url: page.audioUrl });

  try {
    setSaving(true);
    setStatus("Saving...");

    const res = await fetch(`https://asksunnah-backend-hno9.onrender.com/api/admin/books/${bookId}/audio`, 
 {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageNumber: page.number,
        audioLink: page.audioUrl,
      }),
    });

    console.log("Response status:", res.status);

    const rawText = await res.text();
    console.log("Raw response:", rawText);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (err) {
      throw new Error("Invalid JSON: " + rawText);
    }

    console.log("Parsed data:", data);

    if (res.ok && data.success) {
      setStatus(`✅ Audio link added successfully to page ${page.number}`);
    } else {
      setStatus(`⚠️ ${data.error || "Error saving audio link."}`);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    setStatus("💥 Server error while saving audio link: " + err.message);
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="page-block">
      {/* Page Number */}
      <label>
        Page #
        <input
          type="number"
          value={page.number || ""}
          onChange={(e) => updateField("number", Number(e.target.value))}
        />
      </label>

      {/* Render all blocks */}
      <div>
        {page.blocks.map((block, idx) => (
          <BlockEditor
            key={idx}
            block={block}
            onChange={(newBlock) => updateBlock(idx, newBlock)}
            onDelete={() => deleteBlock(idx)}
          />
        ))}

        {/* References */}
        <label>
          References
          <input
            value={page.references?.join(", ") || ""}
            onChange={handleRefsChange}
          />
        </label>

        <button type="button" className="btn-add" onClick={onAddBlock}>
          Add Block
        </button>
      </div>

      <button type="button" className="btn-delete" onClick={onDelete}>
        Remove Page
      </button>

      {/* 🎧 Add Audio Link Section */}
      <div
        style={{
          marginTop: "1rem",
          paddingTop: "1rem",
          borderTop: "1px solid #ddd",
        }}
      >
        <label style={{ fontWeight: "bold", display: "block" }}>
          🎧 Add Audio Link (S3 URL)
        </label>
        <input
          type="text"
          value={page.audioUrl || ""}
          onChange={handleAudioChange}
          placeholder="Paste your S3 audio link here..."
          style={{
            width: "100%",
            padding: "6px",
            marginBottom: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleSaveAudio}
          disabled={saving}
          style={{
            background: saving ? "#aaa" : "#2563eb",
            color: "#fff",
            padding: "6px 12px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {saving ? "Saving..." : "💾 Save Audio Link"}
        </button>
        {status && <p style={{ marginTop: "0.5rem" }}>{status}</p>}
      </div>
    </div>
  );
}
