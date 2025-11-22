// src/components/ReadBook/BookContent.jsx

// src/components/ReadBook/BookContent.jsx

const TASHKEEL_REGEX =
  /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;

export default function BookContent({ blocks, references, fontSize, removeTashkeel }) {

    const cleanText = (text) =>
    removeTashkeel ? text.replace(TASHKEEL_REGEX, "") : text;

  return (
    <div>
      <div className="content" style={{ fontSize: `${fontSize}rem` }}>
        {blocks.map((block, idx) => {
          switch (block.type) {
          case "heading":
  return <h3 key={idx}>{cleanText(block.text)}</h3>;

case "paragraph":
  return (
    <p key={idx} style={{ whiteSpace: "pre-wrap" }}>
      {cleanText(block.text)}
    </p>
  );

case "quote":
  return (
    <blockquote
      key={idx}
      style={{
        borderLeft: "3px solid var(--primary)",
        paddingLeft: "1rem",
        color: "#1f6f3e",
      }}
    >
      {cleanText(block.text)}
      {block.reference && (
        <p>
          <small>{block.reference}</small>
        </p>
      )}
    </blockquote>
  );

default:
  return <p key={idx}>{cleanText(block.text)}</p>;

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
