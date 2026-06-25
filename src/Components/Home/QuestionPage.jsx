// src/Components/Home/QuestionPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "../common/Footer";
import Navbar from "../common/Navbar";
import { useSearchParams } from "react-router-dom";
import { fetchFatwaBySlug } from "../../api/fatwa";
import { ReportableContent } from "../common/ReportableContent";
import { Share2, Pin, ArrowRight } from "lucide-react";
import { API_BASE } from "../../../config";

/**
 * PinnedSidebar — compact rail shown alongside the question content.
 * Mirrors the homepage's pinned section style (title + short snippet +
 * "read full answer"), just sized down to fit a narrower rail.
 */
function PinnedSidebar({ language, direction, onLoaded }) {
  const [sections, setSections] = useState(null);
  const isRTL = direction === "rtl";

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE}/api/pinned?lang=${language}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.active && Array.isArray(d.sections) && d.sections.length > 0) {
          setSections(d.sections);
          onLoaded?.(true);
        } else {
          setSections([]);
          onLoaded?.(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSections([]);
          onLoaded?.(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [language]);

  if (!sections || sections.length === 0) return null;

  return (
    <aside dir={direction} className="space-y-6">
      {sections.map((section) => (
        <div
          key={section.id}
          className="
            rounded-2xl
            border border-[#c3a421]/20
            bg-gradient-to-br
            from-[#fffdf7]
            via-white
            to-[#fff8dc]
            p-4
            shadow-sm
          "
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="
                w-8 h-8 rounded-xl
                bg-[#c3a421]
                flex items-center justify-center
                shadow-sm shrink-0
              "
            >
              <Pin size={13} className="text-white" fill="white" />
            </div>
            <h3
              className={`
                m-0 text-[0.95rem] font-bold
                text-[var(--bg-color-header)]
                ${isRTL ? "text-right" : "text-left"}
              `}
            >
              {section.title || (isRTL ? "أسئلة مختارة" : "Selected Questions")}
            </h3>
          </div>

          {/* Question links — title + read-more only */}
          <div className="flex flex-col gap-2">
            {(section.questions || []).map((q, i) => {
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
                    flex flex-col gap-1.5
                    rounded-xl
                    bg-white
                    border border-gray-100
                    px-3.5 py-3
                    hover:border-[#c3a421]/40
                    hover:shadow-sm
                    transition-all duration-200
                    no-underline
                    ${isRTL ? "text-right" : "text-left"}
                  `}
                >
                  <p
                    className="
                      m-0
                      text-[0.85rem]
                      font-semibold
                      leading-snug
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
                        text-[0.78rem]
                        leading-relaxed
                        text-gray-500
                        line-clamp-2
                      "
                    >
                      {q.snippet}
                    </p>
                  )}

                  <div className="flex items-center gap-1">
                    <span
                      className="
                        text-[0.72rem]
                        font-semibold
                        text-[#c3a421]
                        group-hover:text-[var(--bg-color-header)]
                        transition-colors
                      "
                    >
                      {readMoreLabel}
                    </span>
                    <ArrowRight
                      size={11}
                      className="
                        text-[#c3a421]
                        group-hover:text-[var(--bg-color-header)]
                        transition-colors
                      "
                      style={
                        isRTL ? { transform: "rotate(180deg)" } : undefined
                      }
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}

/**
 * RelatedAnswersSidebar — same compact card treatment as PinnedSidebar
 * (title + snippet + read-more), so the two stack together as one
 * continuous rail. Takes the already-fetched relatedData/relatedQuestions
 * from QuestionPage rather than fetching its own data.
 */
function RelatedAnswersSidebar({ relatedData, relatedQuestions, direction }) {
  const isRTL = direction === "rtl";

  if (!relatedData || relatedData.length === 0) return null;

  const sectionTitle = isRTL ? "فتاوى ذات صلة" : "Related Answers";

  return (
    <div
      dir={direction}
      className="
        rounded-2xl
        border border-[rgba(40,115,70,0.15)]
        bg-[#fafcfb]
        p-4
        shadow-sm
      "
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="
            w-8 h-8 rounded-xl
            bg-[var(--bg-color-header)]
            flex items-center justify-center
            shadow-sm shrink-0
          "
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>
        <h3
          className={`
            m-0 text-[0.95rem] font-bold
            text-[var(--bg-color-header)]
            ${isRTL ? "text-right" : "text-left"}
          `}
        >
          {sectionTitle}
        </h3>
      </div>

      {/* Question links — title + snippet + read-more, same as PinnedSidebar */}
      <div className="flex flex-col gap-2">
        {relatedData.map((item, i) => {
          const rq = relatedQuestions?.[i];
          if (!rq) return null;
          const href =
            rq.lang === "ar"
              ? `/ar/questions/${rq.slug}`
              : `/questions/${rq.slug}`;
          const isCardRTL = rq.lang === "ar";
          const readMoreLabel = isCardRTL
            ? "اقرأ الإجابة كاملة"
            : "Read full answer";

          return (
            <Link
              key={i}
              to={href}
              dir={isCardRTL ? "rtl" : "ltr"}
              className={`
                group
                flex flex-col gap-1.5
                rounded-xl
                bg-white
                border border-gray-100
                px-3.5 py-3
                hover:border-[var(--bg-color-header)]/40
                hover:shadow-sm
                transition-all duration-200
                no-underline
                ${isCardRTL ? "text-right" : "text-left"}
              `}
            >
              <p
                className="
                  m-0
                  text-[0.85rem]
                  font-semibold
                  leading-snug
                  text-[var(--text-main)]
                  group-hover:text-[var(--bg-color-header)]
                  transition-colors
                  line-clamp-2
                "
              >
                {item.heading}
              </p>

              {item.question && (
                <p
                  className="
                    m-0
                    text-[0.78rem]
                    leading-relaxed
                    text-gray-500
                    line-clamp-2
                  "
                >
                  {item.question}
                </p>
              )}

              <div className="flex items-center gap-1">
                <span
                  className="
                    text-[0.72rem]
                    font-semibold
                    text-[var(--bg-color-header)]
                    transition-colors
                    whitespace-nowrap
                  "
                >
                  {readMoreLabel}
                </span>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--bg-color-header)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={
                    isCardRTL ? { transform: "rotate(180deg)" } : undefined
                  }
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function QuestionPage({
  fetchQuestionBySlug,
  direction = "ltr",
  language = "en",
  labels = {
    question: "Question:",
    answer: "Answer:",
    conclusion: "Summary:",
    back: "← Back to Questions",
    andAllahKnowsBest: "And Allah knows best.",
    fromQuran: `From the Qur'an:`,
    fromSunnah: "From the Sunnah:",
    fromSalaf: "From the Salaf:",
    fromScholars: "From the Scholars:",
  },
  navItems,
  languageSwitcher,
}) {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedData, setRelatedData] = useState([]);
  // PinnedSidebar fetches its own data async; these track whether that
  // fetch has resolved yet and what it found, so the sidebar column can
  // wait for both pieces before deciding whether to render at all —
  // otherwise a page with no pinned questions and no related answers
  // would briefly (or permanently) show an empty sidebar gap.
  const [pinnedLoaded, setPinnedLoaded] = useState(false);
  const [hasPinned, setHasPinned] = useState(false);

  const [searchParams] = useSearchParams();
  const backPage = searchParams.get("page");
  const backLink =
    language === "ar"
      ? `/ar${backPage ? `?page=${backPage}` : ""}`
      : `/${backPage ? `?page=${backPage}` : ""}`;

  const defaultNavItems =
    direction === "rtl"
      ? [
          { label: "الرئيسية", href: "/ar", internal: true },
          { label: "المكتبة", href: "/library_ar", internal: true },
          { label: "عن الموقع", href: "/about-us/ar", internal: true },
          { label: "شاركنا رأيك", href: "/feedback-ar", internal: true },
          { label: "ساهم", href: "/ar/contribute", internal: true },
        ]
      : [
          { label: "Home", href: "/", internal: true },
          { label: "Library", href: "/library", internal: true },
          { label: "About Us", href: "/about", internal: true },
          { label: "Feedback", href: "/feedback", internal: true },
          { label: "Contribute", href: "/contribute", internal: true },
        ];

  const defaultLanguageSwitcher =
    direction === "rtl"
      ? { href: "/", label: "English" }
      : { href: "/ar", label: "العربية" };

  useEffect(() => {
    const loadFatwa = async () => {
      setLoading(true);
      // Reset state tied to the previous question before fetching the
      // new one — otherwise, navigating from question A (which had
      // related answers) to question B (which has none) briefly shows
      // A's stale related cards, or an empty Related Answers section,
      // until the related-fetch effect below catches up.
      setData(null);
      setRelatedData([]);
      console.log(`Fetching fatwa for slug: ${slug} in language: ${language}`);
      const result = await fetchQuestionBySlug(slug);
      if (result) {
        setData(result);
        document.title = result.heading;
      }
      setLoading(false);
    };
    loadFatwa();
  }, [slug]);

  useEffect(() => {
    if (!data?.relatedQuestions?.length) {
      setRelatedData([]);
      return;
    }
    console.log("Fetching related:", data.relatedQuestions);
    let cancelled = false;
    Promise.all(
      data.relatedQuestions.map((rq) => fetchFatwaBySlug(rq.slug, rq.lang)),
    )
      .then((results) => {
        if (cancelled) return;
        console.log("Related results:", results);
        setRelatedData(results.filter(Boolean));
      })
      .catch((err) => console.error("Related fetch error:", err));
    return () => {
      cancelled = true;
    };
  }, [data]);

  if (loading) {
    return (
      <div className="text-center mt-[50px]">
        <div className="mx-auto w-[70px] h-[70px] rounded-full animate-spin border-[7px] border-[var(--bg-color-header)] border-t-[7px] border-t-[var(--text-accent)]" />
      </div>
    );
  }

  if (!data) {
    console.error(`No data found for slug: ${slug}`);
  }

  const handleShare = async () => {
    const url = window.location.href;

    const shareData = {
      title: data?.heading || "",
      text: language === "ar" ? "اقرأ هذه الفتوى" : "Read this answer",
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        alert(language === "ar" ? "تم نسخ الرابط" : "Link copied");
      }
    } catch (err) {
      console.log("Share cancelled");
    }
  };
  const sectionTitleMap = {
    quran: labels.fromQuran,
    sunnah: labels.fromSunnah,
    salaf: labels.fromSalaf,
    scholar: labels.fromScholars,
    normal: "",
  };

  const hasRelated = relatedData.length > 0;

  const renderTextWithRefs = (text, key = 0) => {
    const parts = text.split(/({{[^}]+\|[^}]+}}|\[\[[^\]]+\|[^\]]+\]\])/g);
    return parts.map((part, i) => {
      const internal = part.match(/^{{(.+?)\|(.+?)}}$/);
      const external = part.match(/^\[\[(.+?)\|(.+?)\]\]$/);
      if (internal) {
        const [, slug, label] = internal;
        const href =
          language === "ar" ? `/ar/questions/${slug}` : `/questions/${slug}`;
        return (
          <Link
            key={`${key}-${i}`}
            to={href}
            className="text-[var(--bg-color-header)] underline underline-offset-2 font-medium hover:opacity-70 transition-opacity"
          >
            {label}
          </Link>
        );
      }
      if (external) {
        const [, url, label] = external;
        return (
          <a
            key={`${key}-${i}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--bg-color-header)] underline underline-offset-2 font-medium hover:opacity-70 transition-opacity"
          >
            {label}
          </a>
        );
      }
      return <span key={`${key}-${i}`}>{part}</span>;
    });
  };

  const renderAnswer = (text) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const numberedHeadingRegex = /^\d+[\).]\s*/;
    const bulletRegex = /^[-•*]\s*/;
    const elements = [];
    let currentSection = null;

    lines.forEach((line) => {
      if (numberedHeadingRegex.test(line)) {
        if (currentSection) elements.push(currentSection);
        currentSection = {
          type: "section",
          heading: line.replace(numberedHeadingRegex, "").trim(),
          bullets: [],
        };
      } else if (bulletRegex.test(line)) {
        if (currentSection) {
          currentSection.bullets.push(line.replace(bulletRegex, "").trim());
        } else {
          elements.push({
            type: "ul",
            items: [line.replace(bulletRegex, "").trim()],
          });
        }
      } else {
        if (currentSection) {
          elements.push(currentSection);
          currentSection = null;
        }
        elements.push(line);
      }
    });

    if (currentSection) elements.push(currentSection);

    let manualSectionCounter = 1;

    return elements.map((el, idx) => {
      if (typeof el === "string") {
        return (
          <p
            key={idx}
            text={el}
            as="p"
            className="whitespace-pre-wrap leading-[1.7] mb-4"
          >
            {renderTextWithRefs(el, idx)}
          </p>
        );
      }

      if (el.type === "section") {
        const sectionNumber = manualSectionCounter++;
        return (
          <div key={idx} text={el.heading} as="div" className="mb-6">
            <p className="text-[1.05em] font-medium mb-2">{`${sectionNumber}. ${el.heading}`}</p>
            <ul className="pl-6">
              {el.bullets.map((b, i) => (
                <li key={i} className="leading-[1.7]">
                  {renderTextWithRefs(b, idx)}
                </li>
              ))}
            </ul>
          </div>
        );
      }

      if (el.type === "ul") {
        return (
          <ul key={idx}>
            {el.items.map((item, i) => (
              <li key={i} className="leading-[1.7]">
                {renderTextWithRefs(item, idx)}
              </li>
            ))}
          </ul>
        );
      }
      return null;
    });
  };

  return (
    <>
      <Navbar
        navItems={navItems ?? defaultNavItems}
        languageSwitcher={languageSwitcher ?? defaultLanguageSwitcher}
        dir={direction}
      />

      {/*
        BASE FONT SIZE lives here on the outer container.
        Everything inside uses em/inherit so one breakpoint scales the whole page.
        Desktop: 17px  |  ≤768px: 16px  |  ≤480px: 15px

        Layout: main content + pinned sidebar live in a two-column flex row
        on large screens (sidebar sits to the side of the question), and
        stack (sidebar below content) on smaller screens. The container is
        wider than the old single-column page (1180 -> 1320) specifically
        so the question content doesn't lose width to the sidebar — it
        keeps roughly its original ~887px reading width, with the sidebar
        added on top of that rather than carved out of it.

        flex-row vs flex-row-reverse: the sidebar is always the second
        element in the DOM (it needs to load after/alongside the question
        content), but visually it should sit on the *outer* side relative
        to reading direction — right of the question in English, left of
        the question in Arabic. flex-row-reverse on RTL flips the visual
        order without touching the DOM order.
      */}
      <div
        className={`
    max-w-[1320px] mx-auto mt-8 px-4
    flex flex-col gap-10 lg:items-start
    ${direction === "rtl" ? "lg:flex-row-reverse" : "lg:flex-row"}
    max-[768px]:mt-6 max-[768px]:px-3
  `}
      >
        <ReportableContent
          lang={language}
          contentType="question"
          slug={slug}
          className="flex-1 min-w-0 lg:min-w-[600px]"
        >
          <div
            dir={direction}
            lang={language}
            className="
        p-8 text-[17px]
        max-[768px]:p-6 max-[768px]:text-[16px]
        max-[480px]:p-4 max-[480px]:text-[15px]
      
          "
          >
            {/* H1 — display size, keeps its own breakpoints */}
            <h1
              className={`
              text-[var(--bg-color-header)] text-[2rem] leading-[1.5] mb-5 font-bold
              max-[768px]:text-[1.6rem] max-[768px]:mb-4
              max-[480px]:text-[1.3rem] max-[480px]:leading-[1.4] max-[480px]:mb-3
              ${direction === "rtl" ? "text-right" : "text-left"}
            `}
            >
              {data.heading}
            </h1>

            <div
              className={`flex mb-5 ${
                direction === "rtl" ? "justify-start" : "justify-end"
              }`}
            >
              <button
                onClick={handleShare}
                aria-label="Share"
                className="
      px-3 py-2
      rounded-lg
      border
      border-[rgba(40,115,70,0.25)]
      flex
      items-center
      justify-center
      text-[var(--bg-color-header)]
      hover:bg-[rgba(40,115,70,0.08)]
      transition-all
    "
              >
                <Share2 size={17} />
              </button>
            </div>
            <p
              text={data.question}
              as="p"
              className={`mb-5 leading-[1.8] ${direction === "rtl" ? "text-right" : "text-left"}`}
            >
              <strong>{labels.question}</strong> <span>{data.question}</span>
            </p>
            {/* Conclusion / Summary box */}
            {data.conclusion && (
              <div className="mb-6">
                <h2 className="text-[1.05em] font-bold text-[#c3a421] mb-2">
                  {labels.conclusion}
                </h2>
                <div
                  className="p-5 rounded-2xl border-2 border-[rgba(195,164,33,0.5)] shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
                  style={{
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                  }}
                >
                  <p className="m-0 leading-[1.7] text-[#2b2b2b] whitespace-pre-wrap">
                    {renderTextWithRefs(data.conclusion, 0)}
                  </p>
                </div>
              </div>
            )}

            {/* Answer */}
            <div className="mb-6">
              <p
                className={`
                mb-4 leading-[1.8]
                ${direction === "rtl" ? "text-right" : "text-left"}
              `}
              >
                <strong>{labels.answer}</strong>
              </p>
              {data.answer && renderAnswer(data.answer)}
            </div>

            {/* Dynamic content sections (Quran, Sunnah, Salaf, Scholars) */}
            <div id="dynamic-content">
              {data.content?.map((section, idx) => {
                const sectionTitle = sectionTitleMap[section.type] || "";

                if (section.type === "normal") {
                  return (
                    <p
                      key={idx}
                      text={section.text}
                      as="p"
                      className="whitespace-pre-wrap leading-[1.7] mb-4"
                    >
                      {renderTextWithRefs(section.text, idx)}
                    </p>
                  );
                }
                const items = Array.isArray(section.items)
                  ? section.items
                  : [section];
                return (
                  <div key={idx}>
                    {sectionTitle && (
                      <h2
                        className={`
                        text-[var(--bg-color-header)] mt-8 mb-4 text-[1.15em] font-bold
                        max-[480px]:mt-5 max-[480px]:mb-3
                        ${direction === "rtl" ? "text-right" : "text-left"}
                      `}
                      >
                        {sectionTitle}
                      </h2>
                    )}
                    <ul className="ps-5 list-disc">
                      {items.map((item, i) => (
                        <li key={i} className="mb-6">
                          {item.reference && (
                            <strong
                              className={`block mb-2 text-[0.9em] ${direction === "rtl" ? "text-right" : "text-left"}`}
                            >
                              {item.reference}
                            </strong>
                          )}
                          {item.narrator && (
                            <em
                              className={`block mb-2 text-[0.875em] ${direction === "rtl" ? "text-right" : "text-left"}`}
                            >
                              {item.narrator}
                            </em>
                          )}
                          <blockquote
                            className={`
                            bg-[var(--bg-light)] border-s-[5px] border-[var(--bg-color-header)]
                            my-5 px-5 py-4 italic mb-2
                            max-[480px]:px-4 max-[480px]:py-3 max-[480px]:my-4
                            ${direction === "rtl" ? "text-right" : "text-left"}
                          `}
                          >
                            {renderTextWithRefs(item.text, idx)}
                          </blockquote>
                          {item.commentary && (
                            <p className="whitespace-pre-wrap leading-[1.7] mb-4">
                              {renderTextWithRefs(item.commentary, idx)}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-[#c3a421] my-8 opacity-60" />

            <p>
              <strong>{labels.andAllahKnowsBest}</strong>
            </p>

            <Link
              to={backLink}
              className="inline-block mt-8 text-[var(--bg-color-header)] no-underline font-bold hover:underline"
            >
              {labels.back}
            </Link>
          </div>
        </ReportableContent>

        {/* Sidebar rail — Pinned questions first, Related Answers below it.
            Both use the same compact card styling so they read as one
            continuous "more to read" rail rather than two different UIs.
            We wait for PinnedSidebar's fetch to resolve (pinnedLoaded)
            before deciding whether to show the column at all, so a page
            with neither pinned nor related content doesn't leave an
            empty 300px gap (and, on mobile, empty space before the footer). */}
        {(!pinnedLoaded || hasPinned || hasRelated) && (
          <div className="w-full lg:w-[300px] shrink-0 mb-10 lg:mb-0 lg:pt-8 space-y-6">
            <PinnedSidebar
              language={language}
              direction={direction}
              onLoaded={(found) => {
                setHasPinned(found);
                setPinnedLoaded(true);
              }}
            />
            {hasRelated && (
              <RelatedAnswersSidebar
                relatedData={relatedData}
                relatedQuestions={data.relatedQuestions}
                direction={direction}
              />
            )}
          </div>
        )}
      </div>

      <Footer lang={language} />
    </>
  );
}

export default QuestionPage;
