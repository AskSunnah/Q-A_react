import React from "react";
import BookLibrary from "../../Components/library/LibraryBook";
import Footer from "../../Components/Footer";

export default function LibraryBooks_ar() {
  return (
    <div className="flex flex-col min-h-screen">
      <BookLibrary lang="ar" />
      <Footer />
    </div>
  );
}
