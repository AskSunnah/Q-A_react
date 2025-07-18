import Navbar from '../../Components/Navbar';
import LibraryMain from "../../Components/library/LibraryMain";

// Import the CSS here!

export default function Library() {
  return (
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
    { label: "Feedback", href: "https://forms.gle/e5jGuDBJhZAyCP448", internal: false },
    { label: "Contribute", href: "/contribute", internal: true }
  ]}
  languageSwitcher={{ label: "العربية", href: "/library_ar" }}
/>
      <LibraryMain
        heading="Welcome to the Library, Students of Knowledge!"
        firstButtonLabel="English Books"
        firstButtonLink="/library/engbooks"
        secondButtonLabel="Arabic Books"
        secondButtonLink="/library/arabicbooks"
        dir="ltr"
      />
    </div>
  );
}
