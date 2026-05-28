const LibraryMain = ({
  heading,
  firstButtonLabel,
  firstButtonLink,
  secondButtonLabel,
  secondButtonLink,
  dir = "ltr",
}) => (
  <main
    dir={dir}
    className="w-[95%] max-w-[95%] sm:max-w-[85%] md:max-w-[70%] lg:max-w-[55%] xl:max-w-[50%] px-6 py-10 sm:px-10 sm:py-12 mx-auto rounded-[12px] flex flex-col items-center justify-center text-center bg-[var(--bg-light)] text-[var(--text-main)]"
  >
    <h1 className="font-bold text-[1.8rem] sm:text-[2rem] md:text-[2.4rem] pt-[30px] pb-4">
      {heading}
    </h1>
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-3 mt-6">
      <button
        onClick={() => (window.location.href = firstButtonLink)}
        className="lib-button w-full sm:w-auto min-w-[180px] h-[50px] px-6 font-semibold text-[1.05rem] sm:text-[1.1rem] rounded-[6px] cursor-pointer transition-all"
      >
        {firstButtonLabel}
      </button>
      <button
        onClick={() => (window.location.href = secondButtonLink)}
        className="lib-button w-full sm:w-auto min-w-[180px] h-[50px] px-6 font-semibold text-[1.05rem] sm:text-[1.1rem] rounded-[6px] cursor-pointer transition-all"
      >
        {secondButtonLabel}
      </button>
    </div>
  </main>
);

export default LibraryMain;
