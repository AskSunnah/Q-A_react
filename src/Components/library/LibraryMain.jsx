
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
        background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url("/books.jpeg");
        background-size:fit;
        background-position: center;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      main {
        max-width:1/2;
        padding: 4rem;
        margin: 0 auto;
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
        background-color:rgba(213, 175, 40, 0.9);
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
        background: var(--button-bg-transparent);
        border: 1px solid var(--button-gradient);
        color: var(--text-main);
      }
        .lib-content {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
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
