import LibraryMain from "../../Components/library/LibraryMain";
import Navbar from '../../Components/Navbar';

export default function LibraryAr() {
  return (
    <div className="library-bg">
      <header>
        <h1>المكتبة</h1>
      </header>
      <Navbar />
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
