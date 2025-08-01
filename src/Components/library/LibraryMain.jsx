
const LibraryMain = ({
  heading,
  firstButtonLabel,
  firstButtonLink,
  secondButtonLabel,
  secondButtonLink,
  dir = "ltr",
}) => (
  <main dir={dir}>
     <style>{`
      body{
      margin: 0;}
      .library-bg {
        margin: 0;
        font-family: var(--font-family);
        background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/books.jpeg");
        background-size:fit;
        background-position: center;
        display: flex;
        flex-direction: column;
        justify-content: start;
        color: white;
        min-height: 100vh;
      }
      main {
        max-width:fit-content;
        padding: 4rem;
        margin: 2rem auto;
        background-color: var(--bg-light);
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        color:var( --text-main);
      }
      header {
        background-color:  rgba(213, 175, 40, 0.9);
        color: white;
        padding: 2rem 1rem 1rem 1rem;
        text-align: center;
      }
      header h1 {
        font-size: 2rem;
      }
      .header p {
        margin-top: 0.5rem;
        font-size: 1.2rem;
        font-weight: 300;
      }
      .buttons {
        margin: 3rem;
      }
      main button {
        color: var(--button-text-color);
        font-weight: 600;
        font-size: 1rem;
        background: var(--button-gradient);
        border: none;
        border-radius: 6px;
        height: 50px;
        margin: 1rem;
        cursor: pointer;
      }
      main button:hover {
        background-color: #e2e8f0;
        color: #166534;
      }
      .container {
        max-width: 1000px;
        margin: 2rem auto;
        padding: 1rem;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 12px;
      }
      .search-bar,
      .category-filter {
        text-align: center;
        margin-bottom: 1rem;
      }
      .search-bar input,
      .category-filter select {
        padding: 0.6rem 1rem;
        font-size: 1rem;
        border-radius: 6px;
        border: none;
        width: 80%;
        max-width: 400px;
      }
      .book-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 1.5rem;
      }
      .book-card {
        background-color: var(--accent-bg);
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .book-title {
        font-size: 1.1rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
      }
      .book-author {
        font-size: 0.9rem;
        color: #cbd5e1;
        margin-bottom: 1rem;
      }
      .book-card a {
        align-self: start;
        background-color: var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        text-decoration: none;
        border-radius: 4px;
        transition: background 0.3s;
      }
      .book-card a:hover {
        background-color: #14532d;
      }
      footer {
        text-align: center;
        padding: 2rem 1rem;
        font-size: 0.9rem;
        color: #e2e8f0;
      }
      @media (max-width: 768px) {
        main {
          padding: 2rem;
        }
        main button {
          margin: 1rem;
        }
      }
    `}</style>
    <h1>{heading}</h1>
    <div className="buttons">
      <button onClick={() => (window.location.href = firstButtonLink)}>
        {firstButtonLabel}
      </button>
      <button onClick={() => (window.location.href = secondButtonLink)}>
        {secondButtonLabel}
      </button>
    </div>
  </main>
);

export default LibraryMain;
