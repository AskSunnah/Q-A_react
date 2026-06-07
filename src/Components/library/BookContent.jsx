// src/Components/library/BookContent.jsx

import { useEffect, useRef } from "react";

const TASHKEEL_REGEX = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;

export default function BookContent({
  blocks,
  references,
  fontSize,
  removeTashkeel,
}) {
  const scrollRef = useRef(null);

  // Scroll to top whenever the page changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [blocks]);

  const cleanText = (text) =>
    removeTashkeel ? text.replace(TASHKEEL_REGEX, "") : text;

  const hasReferences = references && references.length > 0;

  return (
    <div className="flex flex-col">

      {/* Book page — minHeight makes short pages feel like a full book page */}
      <div
        ref={scrollRef}
        className="
          w-full sm:w-[95%] md:w-[90%] lg:w-[85%]
          px-3 py-3 sm:px-5 sm:py-4 md:px-8 md:py-6
          text-[var(--text-main)]
          border border-double border-[var(--border-color)]
          rounded-[2%]
          text-justify break-words overflow-x-hidden
        "
        style={{
          fontSize: `${fontSize}rem`,
          lineHeight: "2.1",
          background: 'url("/test1.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "local",
          /*
            minHeight keeps a consistent "book page" feel regardless of content length.
            calc(100vh - 260px) = viewport height minus header + navbar + action bar + controls bar.
            Short pages fill to this height; long pages grow beyond it and the parent column scrolls.
            Adjust the 260px constant up/down if your header/navbar are taller/shorter.
          */
          minHeight: "calc(100vh - 260px)",
        }}
      >
        {blocks.map((block, idx) => {
          switch (block.type) {
            case "heading":
              return (
                <h3
                  key={idx}
                  className="font-bold mb-4 mt-5"
                  style={{ fontSize: `${fontSize * 1.15}rem`, lineHeight: "1.6" }}
                >
                  {cleanText(block.text)}
                </h3>
              );
            case "paragraph":
              return (
                <p key={idx} className="whitespace-pre-wrap mb-4">
                  {cleanText(block.text)}
                </p>
              );
            case "quote":
              return (
                <blockquote
                  key={idx}
                  className="border-s-[3px] border-[var(--primary)] ps-3 sm:ps-4 text-[#1f6f3e] my-4 italic"
                >
                  {cleanText(block.text)}
                  {block.reference && (
                    <p className="mt-1"><small>{block.reference}</small></p>
                  )}
                </blockquote>
              );
            default:
              return <p key={idx} className="mb-4">{cleanText(block.text)}</p>;
          }
        })}
      </div>

      {/* References */}
      {hasReferences && (
        <div className="mt-2 border-t border-[rgba(0,95,30,0.2)] bg-[var(--bg-main)]">
          <div className="text-[0.65rem] sm:text-xs px-3 sm:px-4 py-2 max-h-[80px] overflow-y-auto [scrollbar-width:thin]">
            <ul className="list-none p-0 m-0 space-y-0.5">
              {references.map((ref, i) => (
                <li key={i} className="text-[var(--text-secondary)]">{ref}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}