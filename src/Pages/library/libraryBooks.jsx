import React from "react";
import BookLibrary from "../../Components/library/LibraryBook";
import Footer from "../../Components/common/Footer";
export default function LibraryBooks() {
  return (
    <div className="flex flex-col min-h-screen">
      <BookLibrary lang="en" />
      <Footer />
    </div>
  );
}
