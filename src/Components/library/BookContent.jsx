// src/components/ReadBook/BookContent.jsx
import React from "react";

export default function BookContent({ blocks, references, fontSize }) {
  return (
    <div>
      <div className="content" style={{ fontSize: `${fontSize}rem` }}>
        <style>{`
        :root {
      --primary-color: #1f6f3e;
      --secondary-color: #2e8b57;
      --background: #f7f7f7;
      --card-bg: #ffffff;
      --accent-bg: #f0f4fa;
      --text-color: #2c3e50;
      --font-family: 'Segoe UI', sans-serif;
    }
    body {
      font-family: 'Segoe UI', sans-serif;
      margin: 0;
      color: #111827;
      direction: ltr;
      margin: 0;
    }

    header {
      background-image:
      linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
       url('/library-bg.webp'); 
      background-size: cover;
      background-position: center;
      color: white;
      padding: 1rem 2rem;
      text-align: center;
    }

    .layout {
      display: flex;
      flex-direction: row;
      padding: 1em;
      
    }

    .sidebar {
      width: 20%;
      background-color: #fff;
      border-right: 1px solid #e5e7eb;
      padding: 1rem;
      overflow-y: scroll;
      height: 70vh;
      
    }

    .sidebar h2 {
      font-size: 1.2rem;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .sidebar a {
      display: block;
      text-decoration: none;
      color: var(--primary-color);
      padding: 0.4rem 0;
      font-size: 0.95rem;
      overflow: auto;
    }

    .sidebar a:hover {
      color: #166534;
    }
    .sidebar-toggle {
      display: none;
      font-size: 1.3rem;
      background: none;
      border: none;
      cursor: pointer;
      text-align: right;
      margin: 6px;
      color: var(--primary-color);
    }
    .content {
      min-height: 50vh;
      width: 60vw;
      flex: 1;
      padding: 1em;
      line-height: 2;
      font-size: 1.1rem;
      border: 1px double rgba(0, 95, 30, 0.203);
      background-color: #fff9f1;
      border-radius: 2%;
      text-align: justify;
    }

    .controls {
      text-align: center;
      margin-bottom: 1rem;
    }

     .controls input {
      margin: 0 0.3rem;
      padding: 0.4rem 0.7rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: white;
      cursor: pointer;
      font-family: inherit;
    }
    .controls button{
      margin: 0 0.3rem;
      padding: 0.4rem 0.7rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      color: white;
      background-color: var(--primary-color);
      cursor: pointer;
      font-family: inherit;
    }
    .controls button:hover {
      background-color: #e5e5e5;
    }
    .referencebox{
      font-size: x-small;
      bottom: 0;
      padding: 1em;
    }
    .referencebox ul{
      list-style: none;
    }
    hr{
      color: rgba(0, 95, 30, 0.203);
      width: 90%;
    }
    .navbar {
      background-repeat: no-repeat;
      background: #e9f5ec;
      padding: 1rem 1.5rem;
      position: relative;
      z-index: 10;
    }

    .navbar ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem;
    }

    .nav-link {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background 0.2s;
      display: inline-block;
    }

    .nav-link:hover,
    .nav-link:focus {
      background: var(--secondary-color);
      color: #fff;
    }

    /* Hamburger Button */
    .nav-toggle {
      display: none;
      font-size: 1.3rem;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--primary-color);
      position: absolute;
      top: 0.6rem;
      right: 1rem;
      z-index: 11;
    }

    /* Small Screens */
    @media (max-width: 768px) {

      .navbar {
        /* background:#e9f5ec; */
        padding: 1.5rem 0;
      }

      .nav-toggle {
        display: block;
      }

      .nav-menu {
        display: none;
        width: 100%;
      }

      .nav-menu.open {
        display: block;
      }

      .navbar ul {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }
      .layout{
        display: flex;
        flex-direction: column;
      }
      .sidebar {
        display: none;
        width: 100vw;
        overflow-y: auto;
        max-height: 50vh;
     }
     .sidebar-toggle{
      display: block;
     }
      .sidebar.open {
        
        display: block;
    }
    .content{
      width:fit-content;
    }
    }

    /* Dark mode styles */
    body.dark .navbar {
      background: #183c25;
    }

    body.dark .nav-link:hover,
    body.dark .nav-link:focus {
      background: #25603a;
    }
    .footer {
      text-align: center;
      font-size: 0.9rem;
      padding: 1rem;
      color: #6b7280;
    }
    `}</style>
        {blocks.map((block, idx) => {
          switch (block.type) {
            case "heading":
              return <h3 key={idx}>{block.text}</h3>;
            case "paragraph":
              return <p key={idx} style={{ whiteSpace: "pre-wrap" }}>{block.text}</p>;
            case "quote":
              return (
                <blockquote key={idx} style={{ borderLeft: "3px solid var(--primary-color)", paddingLeft: "1rem", color: "#1f6f3e" }}>
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
