import Navbar from '../../Components/Navbar';
import LibraryMain from "../../Components/library/LibraryMain";
// Import the CSS here!

export default function Library() {
  return (
    <div className="library-bg">
      <header>
        <h1>Library</h1>
      </header>
      <Navbar />
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
