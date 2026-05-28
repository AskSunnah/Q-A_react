import { useRef } from "react";
import Navbar from "../../Components/Navbar";
import LibraryMain from "../../Components/library/LibraryMain";
import Footer from "../../Components/Footer";
import HoverHadithEn from "../../Components/library/HoverHadithEn";

export default function Library() {
  const topBarRef = useRef(null);

  return (
    <>
      <div
        className="flex flex-col min-h-screen m-0 font-[var(--font-family)]"
        style={{
          background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url("/books.jpeg")',
          backgroundSize: "auto",
          backgroundPosition: "center",
        }}
      >
        <div ref={topBarRef}>
          <header className="bg-[var(--bg-lib-header)] text-white text-center pt-8 pb-4 px-4">
            <h1 className="text-[2rem] font-bold pt-2 pb-2">Library</h1>
          </header>
          <Navbar
            dir="ltr"
            navItems={[
              { label: "Home", href: "/", internal: true },
              { label: "Library", href: "/library", internal: true },
              { label: "About Us", href: "/about-us", internal: true },
              { label: "Feedback", href: "/feedback", internal: true },
              { label: "Contribute", href: "/contribute", internal: true },
            ]}
            languageSwitcher={{ label: "العربية", href: "/library_ar" }}
          />
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <LibraryMain
            heading={
              <HoverHadithEn
                text="Welcome, seeker of knowledge."
                topBarRef={topBarRef}
              />
            }
            firstButtonLabel="English Books"
            firstButtonLink="/library/engbooks"
            secondButtonLabel="Arabic Books"
            secondButtonLink="/library/arabicbooks"
            dir="ltr"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}