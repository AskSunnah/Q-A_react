import LibraryMain from "../../Components/library/LibraryMain";
import Navbar from "../../Components/Navbar";

export default function LibraryAr() {
  return (
    <div className="library-bg">
      <header>
        <h1>المكتبة</h1>
      </header>
<Navbar
  dir="rtl"
  navItems={[
    { label: "الرئيسية", href: "/ar", internal: true },
    { label: "المكتبة", href: "/library_ar", internal: true },
    { label: "عن الموقع", href: "/about-us/ar", internal: false },
    { label: "شاركنا رأيك", href: "https://forms.gle/e5jGuDBJhZAyCP448", internal: false },
    { label: "ساهم", href: "/ar/contribute", internal: true }
  ]}
  languageSwitcher={{ label: "English", href: "/library" }}
/>
      <div className='lib-content'>
      <LibraryMain
        heading="مرحبًا بكم في المكتبة، يا طلاب العلم!"
        firstButtonLabel="الكتب العربية"
        firstButtonLink="/library/arabicbooks"
        secondButtonLabel="الكتب الإنجليزية"
        secondButtonLink="/library/engbooks"
        dir="rtl"
      />
      </div>
    </div>
  );
}
