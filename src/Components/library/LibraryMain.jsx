import React from "react";
import "../../styles/library.css";

const LibraryMain = ({
  heading,
  firstButtonLabel,
  firstButtonLink,
  secondButtonLabel,
  secondButtonLink,
  dir = "ltr",
}) => (
  <main dir={dir}>
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
