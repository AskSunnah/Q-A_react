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
        flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6
        border-b border-black/10 shadow-sm
      "
    >
      {/* LEFT SIDE: Title & Subtitle Group */}
      <div className="flex flex-col items-center md:items-start space-y-1 md:space-y-2">
        <h1 className="text-3xl md:text-[2.6rem] font-black tracking-tight text-white m-0 leading-none text-center md:text-left">
          {title}
        </h1>
        <div className="text-base md:text-[1.1rem] text-white/90 flex flex-col gap-0.5 leading-snug font-medium text-center md:text-left">
          {lines.map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: Stacking Dates Top and Button Bottom */}
      <div className="flex flex-col items-center md:items-end gap-3 md:gap-4 max-md:border-t max-md:border-white/20 max-md:pt-3 max-md:w-full">
        
        {/* Dates Layer (Top) */}
        <div className="text-xs font-bold text-white/80 tracking-wider uppercase flex flex-col gap-0.5 text-center md:text-right leading-tight">
          <span>{engDate}</span>
          {hijDate && <span className="text-white/70">{hijDate}</span>}
        </div>

        {/* Button Layer (Bottom) */}
        <div className="w-full md:w-auto">
          <button
            onClick={(e) => {
              e.preventDefault();
              onOpenModal();
            }}
            className="
              w-full md:w-auto
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
