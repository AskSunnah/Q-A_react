import { useRef } from "react";
import LibraryMain from "../../Components/library/LibraryMain";
import Footer from "../../Components/common/Footer";
import Navbar from "../../Components/common/Navbar";
import HoverHadith from "../../Components/library/HoverHadith";

export default function LibraryAr() {
  const topBarRef = useRef(null);

  return (
    <>
      <div
        className="flex flex-col min-h-screen m-0 font-[var(--font-family)]"
        style={{
          background:
            'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url("/books.jpeg")',
          backgroundSize: "auto",
          backgroundPosition: "center",
        }}
      >
        <div ref={topBarRef}>
          <header className="bg-[var(--bg-lib-header)] text-white pt-8 pb-4 px-4 text-center">
            <h1 className="text-[2rem] font-bold pt-2 pb-2">المكتبة</h1>
          </header>
          <Navbar
            dir="rtl"
            navItems={[
              { label: "الرئيسية", href: "/ar", internal: true },
              { label: "المكتبة", href: "/library_ar", internal: true },
              { label: "عن الموقع", href: "/about-us/ar", internal: true },
              { label: "شاركنا رأيك", href: "/feedback-ar", internal: true },
              { label: "ساهم", href: "/ar/contribute", internal: true },
            ]}
            languageSwitcher={{ label: "English", href: "/library" }}
          />
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <LibraryMain
            heading={
              <HoverHadith
                text="مرحبًا بطالبِ العِلْمِ"
                topBarRef={topBarRef}
              />
            }
            firstButtonLabel="الكتب العربية"
            firstButtonLink="/library/arabicbooks"
            secondButtonLabel="الكتب الإنجليزية"
            secondButtonLink="/library/engbooks"
            dir="rtl"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
