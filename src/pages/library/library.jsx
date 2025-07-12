import React from "react";
import LibraryMain from "../../Components/library/LibraryMain";
import "../../styles/library.css"; // Import the CSS here!

export default function Library() {
  return (
    <div className="library-bg">
      <header>
        <h1>Library</h1>
      </header>
      {/* Add your <Navbar /> here if needed */}
      <LibraryMain
        heading="Welcome to the Library, Students of Knowledge!"
        firstButtonLabel="English Books"
        firstButtonLink="/library/engbooks"
        secondButtonLabel="Arabic Books"
        secondButtonLink="/library/arabicbook"
        dir="ltr"
      />
    </div>
  );
}
