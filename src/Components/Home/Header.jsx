import React from "react";

const Header = ({
  title,
  subtitleLines,
  subtitle,
  dir = "ltr",
  buttonLabel,
  onOpenModal,
}) => {
  const lines = subtitleLines?.length
    ? subtitleLines
    : subtitle
      ? [subtitle]
      : [];
  const isRTL = dir === "rtl";
  return (
    <header
      dir={dir}
      className="
    text-white py-8 md:py-7 px-6 md:px-8
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
      </div>
    </header>
  );
};

export default Header;
