const Header = ({ title, subtitle, dir = "ltr" }) => {
  return (
    <header
      dir={dir}
      className="
        text-white text-center
        py-8 px-[1.25rem] 
        font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]
        bg-[linear-gradient(180deg,#e1cb57_0%,#d0b640_30%,#c3a421_65%,#a67f0f_110%)]
        max-md:py-[40px] max-md:px-[1rem]
      "
    >
      <h1 className="text-[2.5rem] font-bold max-md:text-[1.8rem]">{title}</h1>

      <p className="mt-[0.5rem] text-[1.1rem] text-[#f9f9f9] max-md:text-[1rem]">
        {subtitle}
      </p>
    </header>
  );
};

export default Header;
