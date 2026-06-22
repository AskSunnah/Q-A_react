import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../../config";
import { Sparkles, ArrowRight } from "lucide-react";

/**
 * SelectedSection — displays admin-curated selected question groups
 * at the top of the homepage (English or Arabic).
 */
export default function SelectedSection({ lang = "en", direction = "ltr" }) {
  const [sections, setSections] = useState(null);
  const isRTL = direction === "rtl";

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE}/api/pinned?lang=${lang}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;

        if (d.active && Array.isArray(d.sections) && d.sections.length > 0) {
          setSections(d.sections);
        } else {
          setSections([]);
        }
      })
      .catch(() => {
        if (!cancelled) setSections([]);
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  if (sections === null) {
    return (
      <section dir={direction} className="mb-8">
        <div className="rounded-3xl border border-gray-100 bg-white p-6">
          <div className="h-6 w-44 rounded bg-gray-100 animate-pulse mb-5" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[96px] rounded-2xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => (
        <SelectedBlock
          key={section.id}
          section={section}
          direction={direction}
          isRTL={isRTL}
        />
      ))}
    </>
  );
}


function SelectedBlock({ section, direction, isRTL }) {
  const { title, questions = [] } = section;

  const subtitle = isRTL
    ? "إجابات موثوقة يكثر السؤال عنها"
    : "Trusted answers people are asking about most";

  return (
    <section dir={direction} className="mb-8">
      <div
        className="
          rounded-3xl
          border border-[#c3a421]/20
          bg-gradient-to-br
          from-[#fffdf7]
          via-white
          to-[#fff8dc]
          p-5 md:p-6
          shadow-sm
        "
      >

        {/* Header */}
        <div
          className={`
            flex items-center gap-3 mb-5
           
          `}
        >
          <div
            className="
              w-11 h-11 rounded-2xl
              bg-[#c3a421]
              flex items-center justify-center
              shadow-sm shrink-0
            "
          >
            <Sparkles size={19} className="text-white" />
          </div>


          <div className={isRTL ? "text-right" : "text-left"}>
            <h2
              className="
                m-0
                text-[1.1rem]
                md:text-[1.2rem]
                font-bold
                text-[var(--bg-color-header)]
              "
            >
              {title || (isRTL ? "أسئلة مختارة" : "Selected Questions")}
            </h2>

            <p className="m-0 mt-1 text-sm text-gray-500">
              {subtitle}
            </p>
          </div>
        </div>


        {/* Questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {questions.map((q, i) => {

            const href =
              q.lang === "ar"
                ? `/ar/questions/${q.slug}`
                : `/questions/${q.slug}`;

            const readMoreLabel = isRTL
              ? "اقرأ الإجابة كاملة"
              : "Read full answer";


            return (
              <Link
                key={i}
                to={href}
                dir={direction}
                className={`
                  group
                  flex flex-col gap-2.5
                  rounded-2xl
                  bg-white
                  border border-gray-100
                  px-5 py-4
                  shadow-sm
                  hover:shadow-md
                  hover:border-[#c3a421]/40
                  hover:-translate-y-[2px]
                  transition-all duration-300
                  no-underline
                  ${isRTL ? "text-right" : "text-left"}
                `}
              >

                <p
                  className="
                    m-0
                    text-[0.95rem]
                    font-semibold
                    leading-relaxed
                    text-[var(--text-main)]
                    group-hover:text-[var(--bg-color-header)]
                    transition-colors
                    line-clamp-2
                  "
                >
                  {q.heading}
                </p>


                {q.snippet && (
                  <p
                    className="
                      m-0
                      text-[0.82rem]
                      leading-relaxed
                      text-gray-500
                      line-clamp-2
                    "
                  >
                    {q.snippet}
                  </p>
                )}


                <div
                  className={`
                    flex items-center gap-1.5 mt-1
                   
                  `}
                >

                  <span
                    className="
                      text-[0.78rem]
                      font-semibold
                      text-[#c3a421]
                      group-hover:text-[var(--bg-color-header)]
                      transition-colors
                    "
                  >
                    {readMoreLabel}
                  </span>


                  <span
                    className="
                      w-6 h-6
                      rounded-lg
                      bg-[#fff8dc]
                      flex items-center justify-center
                      shrink-0
                      group-hover:bg-[#c3a421]
                      transition-colors
                    "
                  >
                    <ArrowRight
                      size={13}
                      className="
                        text-[#c3a421]
                        group-hover:text-white
                        transition-colors
                      "
                      style={
                        isRTL
                          ? { transform: "rotate(180deg)" }
                          : undefined
                      }
                    />
                  </span>

                </div>

              </Link>
            );
          })}

        </div>
      </div>
    </section>
  );
}