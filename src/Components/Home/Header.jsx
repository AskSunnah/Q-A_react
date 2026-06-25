import React from "react";

const Header = ({ 
  title, 
  subtitleLines, 
  subtitle, 
  dir = "ltr",
  buttonLabel,
  onOpenModal,
}) => {
  const lines = subtitleLines?.length ? subtitleLines : subtitle ? [subtitle] : [];
  const isRTL = dir === "rtl";

  const now = new Date();
  const engDate = now.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
  let hijDate = "";
  try {
    hijDate = now.toLocaleDateString(
      isRTL ? "ar-SA-u-ca-islamic" : "en-US-u-ca-islamic",
      { month: "long", day: "numeric", year: "numeric" }
    );
  } catch {}

  return (
   <header
  dir={dir}
  className="
    text-white py-4 md:py-7 px-6 md:px-8
    font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]
    bg-[linear-gradient(180deg,#e1cb57_0%,#d0b640_30%,#c3a421_65%,#a67f0f_110%)]
    border-b border-black/10 shadow-sm
  "
>
  <div className="md:grid md:grid-cols-3 md:items-center">
    
    {/* Empty left column to balance right side */}
    <div className="hidden md:block" />

    {/* PERFECTLY CENTERED TITLE */}
    <div className="text-center">
      <h1 className="text-3xl md:text-[2.8rem] font-black tracking-tight leading-none">
        {title}
      </h1>

      <div className="mt-2 text-base md:text-lg text-white/90">
        {lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>

    {/* DATE + BUTTON */}
    <div className="flex flex-col items-center md:items-end gap-3 mt-4 md:mt-0">
      <div className="text-xs font-bold text-white/80 tracking-wider uppercase flex flex-col gap-0.5 text-center md:text-right leading-tight">
        <span>{engDate}</span>
        {hijDate && (
          <span className="text-white/70">{hijDate}</span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          onOpenModal();
        }}
        className="
          px-6 md:px-7 py-2.5 md:py-3.5
          rounded-lg
          text-base
          font-extrabold
          text-[#3d3300]
          bg-gradient-to-br
          from-[#fff1b7]
          to-[#bea331]
          hover:from-[#fce490]
          hover:to-[#a88c1e]
          transition-all duration-300
          shadow-lg
          active:scale-95
        "
      >
        {buttonLabel}
      </button>
    </div>
  </div>
</header>
  );
};

export default Header;
  