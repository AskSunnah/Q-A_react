import React from "react";

const TermsContent = ({ data, dir = "ltr" }) => {
  const isRTL = dir === "rtl";

  return (
    <main dir={dir} className="max-w-[900px] mx-auto my-10 px-5">
      {/* Page title */}
      <h1
        className={`
          text-[1.8rem] max-md:text-[1.5rem]
          font-bold mb-[15px]
          text-[var(--bg-color-header)]
          ${isRTL ? "text-right" : "text-left"}
        `}
      >
        {data.pageTitle}
      </h1>

      {/* Sections */}
      {data.sections.map((sec) => (
        <section key={sec.id} className="mb-[2.2rem]">
          <h2
            className="
              text-[var(--bg-color-header)]
              mb-3 text-[1.25rem] max-md:text-[1.15rem]
              font-semibold pb-[0.4rem]
              border-b-2 border-[var(--bg-color-header)]
            "
          >
            {sec.title}
          </h2>

          <div
            className="leading-[1.65] text-[0.98rem]"
            dangerouslySetInnerHTML={{
              __html: sec.content.replace(/\n/g, "<br />"),
            }}
          />
        </section>
      ))}
    </main>
  );
};

export default TermsContent;
