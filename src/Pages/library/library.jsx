import Navbar from "../../Components/Navbar";
import LibraryMain from "../../Components/library/LibraryMain";
import Footer from "../../Components/Footer";
import HoverHadithEn from "../../Components/library/HoverHadithEn"; // ✅ new import

export default function Library() {
  return (
    <>
      <div className="library-bg">
        <header>
          <h1>Library</h1>
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

        <div className="lib-content">
          <LibraryMain
            heading={<HoverHadithEn text="Welcome, seeker of knowledge." />} // ✅ wrapped in hover component
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
