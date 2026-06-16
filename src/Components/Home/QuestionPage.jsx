// src/Components/Home/QuestionPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { useSearchParams } from "react-router-dom";
import { fetchFatwaBySlug } from "../../api/fatwa";
import {
  ReportableContent
} from "../common/ReportableContent";

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
    if (!data?.relatedQuestions?.length) return;
    console.log("Fetching related:", data.relatedQuestions);
    Promise.all(
      data.relatedQuestions.map((rq) => fetchFatwaBySlug(rq.slug, rq.lang)),
    )
      .then((results) => {
        console.log("Related results:", results);
        setRelatedData(results.filter(Boolean));
      })
      .catch((err) => console.error("Related fetch error:", err));
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

  const sectionTitleMap = {
    quran: labels.fromQuran,
    sunnah: labels.fromSunnah,
    salaf: labels.fromSalaf,
    scholar: labels.fromScholars,
    normal: "",
  };

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
          <div
            key={idx}
            text={el.heading}
            as="div"
            className="mb-6"
          >
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
      */}

      <ReportableContent lang={language} contentType="question" slug={slug}>
        <div
          dir={direction}
          lang={language}
          className="
          p-8 max-w-[887px] mx-auto mt-8 text-[17px]
          max-[768px]:p-6 max-[768px]:max-w-[95%] max-[768px]:text-[16px]
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

              {/* <div
                text={data.conclusion}
                as="div"
                className="p-5 rounded-2xl border-2 border-[rgba(195,164,33,0.5)] shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
              >
                <div
                  style={{
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                  }}
                >
                  <p className="m-0 leading-[1.7] text-[#2b2b2b] whitespace-pre-wrap">
                    {renderTextWithRefs(data.conclusion, 0)}
                  </p>
                </div>
              </div> */}
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

          {/* Related Answers */}
          {relatedData.length > 0 && (
            <div className="mt-16">
              {/* Section header */}
              <div
                className={`flex items-center gap-4 mb-6 ${direction === "rtl" ? "flex-row-reverse" : ""}`}
              >
                {direction === "rtl" ? (
                  <>
                    <div className="flex-1 h-px bg-[rgba(40,115,70,0.15)]" />
                    <div className={`flex items-center gap-2 flex-row-reverse`}>
                      <span className="text-[var(--bg-color-header)] font-bold text-[0.9em] uppercase tracking-widest">
                        الفتاوى الحديثة
                      </span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--bg-color-header)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--bg-color-header)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                      <span className="text-[var(--bg-color-header)] font-bold text-[0.9em] uppercase tracking-widest">
                        Related Answers
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-[rgba(40,115,70,0.15)]" />
                  </>
                )}
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedData.map((item, i) => {
                  const rq = data.relatedQuestions[i];
                  const href =
                    rq.lang === "ar"
                      ? `/ar/questions/${rq.slug}`
                      : `/questions/${rq.slug}`;
                  const isCardRTL = rq.lang === "ar";
                  return (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      dir={isCardRTL ? "rtl" : "ltr"}
                      className="group flex flex-col gap-3 p-5 rounded-2xl border border-[rgba(40,115,70,0.15)] bg-[#fafcfb] hover:border-[var(--bg-color-header)] hover:shadow-[0_4px_20px_rgba(40,115,70,0.12)] transition-all duration-200 no-underline"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p
                          className={`m-0 text-[0.875em] font-semibold text-[#1c1c1c] leading-snug group-hover:text-[var(--bg-color-header)] transition-colors line-clamp-3 ${isCardRTL ? "text-right" : "text-left"}`}
                        >
                          {item.heading}
                        </p>
                        <span className="shrink-0 w-7 h-7 rounded-lg bg-[rgba(40,115,70,0.08)] flex items-center justify-center group-hover:bg-[var(--bg-color-header)] transition-colors mt-[1px]">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--bg-color-header)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="group-hover:stroke-white transition-colors"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </span>
                      </div>

                      <p
                        className={`m-0 text-[0.8em] text-[#777] leading-relaxed line-clamp-2 border-t border-[rgba(40,115,70,0.08)] pt-3 ${isCardRTL ? "text-right" : "text-left"}`}
                      >
                        {item.question}
                      </p>

                      <div
                        className={`flex items-center gap-1 mt-auto ${isCardRTL ? "flex-row-reverse" : ""}`}
                      >
                        <span className="text-[0.75em] font-semibold text-[var(--bg-color-header)] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wide">
                          {isCardRTL ? "اقرأ الإجابة" : "Read answer"}
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
                          className={`opacity-0 group-hover:opacity-100 transition-opacity ${isCardRTL ? "rotate-180" : ""}`}
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </ReportableContent>

      <Footer lang={language} />
    </>
  );
}

export default QuestionPage;
