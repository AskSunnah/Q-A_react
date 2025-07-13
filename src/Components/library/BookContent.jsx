// src/components/ReadBook/BookContent.jsx
import React from "react";

export default function BookContent({ blocks, references, fontSize }) {
  return (
    <div>
      <div className="content" style={{ fontSize: `${fontSize}rem` }}>
        {blocks.map((block, idx) => {
          switch (block.type) {
            case "heading":
              return <h3 key={idx}>{block.text}</h3>;
            case "paragraph":
              return <p key={idx} style={{ whiteSpace: "pre-wrap" }}>{block.text}</p>;
            case "quote":
              return (
                <blockquote key={idx} style={{ borderLeft: "3px solid var(--primary)", paddingLeft: "1rem", color: "#1f6f3e" }}>
                  {block.text}
                  {block.reference && <p><small>{block.reference}</small></p>}
                </blockquote>
              );
            // ...other block types
            default:
              return <p key={idx}>{block.text}</p>;
          }
        })}
      </div>
      <hr />
      <div className="referencebox">
        <ul>
          {references && references.map((ref, i) => <li key={i}>{ref}</li>)}
        </ul>
      </div>
      <hr />
    </div>
  );
}
