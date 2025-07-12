import LibraryMain from "../../Components/library/LibraryMain";
import Navbar from '../../Components/Navbar';

export default function LibraryAr() {
  return (
    <div className="library-bg">
      <header>
        <h1>المكتبة</h1>
      </header>
      <Navbar
  navItems={[
    { label: "الرئيسية", href: "/ar", internal: true },
    { label: "المكتبة", href: "/library_ar", internal: false },
    { label: "من نحن", href: "/about-ar", internal: true },
    { label: "ملاحظات", href: "https://forms.gle/e5jGuDBJhZAyCP448", internal: false },
    { label: "ساهم", href: "https://www.paypal.me/asksunnah", internal: false }
  ]}
  languageSwitcher={{ label: "English", href: "/" }}
/>
<Navbar
  dir="rtl"
  navItems={[
    { label: "الرئيسية", href: "/ar", internal: true },
    { label: "المكتبة", href: "/library/library_ar/library.html", internal: false },
    { label: "عن الموقع", href: "/ar/about-us_ar.html", internal: false },
    { label: "شاركنا رأيك", href: "https://forms.gle/e5jGuDBJhZAyCP448", internal: false },
    { label: "ساهم", href: "https://www.paypal.me/asksunnah", internal: false }
  ]}
  languageSwitcher={{ label: "English", href: "/" }}
/>


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
