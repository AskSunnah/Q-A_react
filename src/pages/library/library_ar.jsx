import React from "react";
import LibraryMain from "../../components/library/LibraryMain";
import "../../styles/library.css";

export default function LibraryAr() {
  return (
    <div className="library-bg">
      <header>
        <h1>المكتبة</h1>
      </header>
      {/* Navbar component goes here if you have one */}
      <LibraryMain
        heading="مرحبًا بكم في المكتبة، يا طلاب العلم!"
        firstButtonLabel="الكتب العربية"
        firstButtonLink="/library/arabicbooks"
        secondButtonLabel="الكتب الإنجليزية"
        secondButtonLink="/library/engbooks"
        dir="rtl"
      />
    </div>
  );
}
