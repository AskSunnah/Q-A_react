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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [blocks]);

  const cleanText = (text) =>
    removeTashkeel ? text.replace(TASHKEEL_REGEX, "") : text;

  const hasReferences = references && references.length > 0;

  /*
    LAYOUT STRATEGY
    ───────────────
    The outer wrapper fills at least the available viewport height (minus chrome).
    It's a flex-col so the book page (flex-1) grows to fill space, and references
    are always pinned to the bottom — like a footnote at the bottom of a book page.

    Short page  → page content fills flex-1, references sit at the very bottom.
    Long page   → page content grows naturally, references follow directly after,
                  parent column scrolls the whole thing.

    The book page itself no longer needs minHeight — the wrapper handles that.
    We remove the old minHeight from the page div to avoid double-accounting.
  */
  return (
    <div
      className="flex flex-col w-full sm:w-[95%] md:w-[90%] lg:w-[85%]"
      style={{ minHeight: "calc(100vh - 260px)" }}
    >

      {/* Book page — grows to fill available space */}
      <div
        ref={scrollRef}
        className="
          flex-1
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
          // Remove bottom border-radius when references are present
          // so the page and references panel look connected
          borderBottomLeftRadius: hasReferences ? "0" : undefined,
          borderBottomRightRadius: hasReferences ? "0" : undefined,
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

      {/*
        References panel — always at the bottom of the spread.
        Connected to the page above via matching border and no gap,
        like a footnote section at the bottom of a book page.
        On pages without references this space simply doesn't exist.
      */}
      {hasReferences && (
        <div
          className="shrink-0 border border-t-0 border-double border-[var(--border-color)] bg-[var(--bg-main)]"
          style={{
            borderBottomLeftRadius: "2%",
            borderBottomRightRadius: "2%",
          }}
        >
          <div className="text-[0.7rem] sm:text-xs px-3 sm:px-5 md:px-8 py-3 max-h-[120px] overflow-y-auto [scrollbar-width:thin]">
            <ul className="list-none p-0 m-0 space-y-1">
              {references.map((ref, i) => (
                <li key={i} className="text-[var(--text-secondary)] leading-snug">
                  {ref}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}