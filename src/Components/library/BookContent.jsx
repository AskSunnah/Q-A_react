const TASHKEEL_REGEX = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;

export default function BookContent({
  blocks,
  references,
  fontSize,
  removeTashkeel,
}) {
  const cleanText = (text) =>
    removeTashkeel ? text.replace(TASHKEEL_REGEX, "") : text;

  return (
    <div className="w-[auto]">
      {/* Responsive padding wrapper — font size controlled by user prop */}
      <div
        className="
          w-full sm:w-[95%] md:w-[90%] lg:w-[85%] min-h-[50vh] flex-1
          px-3 py-3
          sm:px-5 sm:py-4
          md:px-8 md:py-6
          leading-[2]
          text-[var(--text-main)]
          border border-double border-[var(--border-color)]
          rounded-[2%]
          text-justify
          break-words
          overflow-x-hidden
          
        "
        style={{
          fontSize: `${fontSize}rem`,
          background: 'url("/test1.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {blocks.map((block, idx) => {
          switch (block.type) {
            case "heading":
              return (
                <h3 key={idx} className="font-bold mb-3 mt-4 leading-snug">
                  {cleanText(block.text)}
                </h3>
              );

            case "paragraph":
              return (
                <p key={idx} className="whitespace-pre-wrap mb-3">
                  {cleanText(block.text)}
                </p>
              );

            case "quote":
              return (
                <blockquote
                  key={idx}
                  className="border-l-[3px] border-[var(--primary)] pl-3 sm:pl-4 text-[#1f6f3e] my-3 italic"
                >
                  {cleanText(block.text)}
                  {block.reference && (
                    <p className="mt-1">
                      <small>{block.reference}</small>
                    </p>
                  )}
                </blockquote>
              );

            default:
              return (
                <p key={idx} className="mb-3">
                  {cleanText(block.text)}
                </p>
              );
          }
        })}
      </div>

      <hr className="border-[rgba(0,95,30,0.203)] w-[90%] mx-auto my-2" />

      {/* referencebox */}
      <div className="text-[0.65rem] sm:text-xs px-3 sm:px-4 py-2">
        <ul className="list-none p-0 m-0">
          {references &&
            references.map((ref, i) => (
              <li key={i} className="mb-1 text-[var(--text-secondary)]">
                {ref}
              </li>
            ))}
        </ul>
      </div>

      <hr className="border-[rgba(0,95,30,0.203)] w-[90%] mx-auto my-2" />
    </div>
  );
}
