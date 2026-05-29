// src/Components/Home/QuestionPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "../Footer";
import Navbar from "../Navbar";

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

  // Default nav items per language
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
      const result = await fetchQuestionBySlug(slug);
      if (result) {
        setData(result);
        document.title = result.heading;
      }
      setLoading(false);
    };
    loadFatwa();
  }, [slug]);

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
          <p key={idx} className="whitespace-pre-wrap leading-[1.6] mb-4">
            {el}
          </p>
        );
      }
      if (el.type === "section") {
        const sectionNumber = manualSectionCounter++;
        return (
          <div key={idx} className="mb-6">
            <p className="text-[18px] mb-2">{`${sectionNumber}. ${el.heading}`}</p>
            <ul className="pl-6">
              {el.bullets.map((b, i) => (
                <li key={i} className="text-[17px]">
                  {b}
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
              <li key={i} className="text-[17px]">
                {item}
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

      <div
        dir={direction}
        lang={language}
        className="
          p-8 max-w-[887px] mx-auto mt-8
          max-[1024px]:p-6 max-[1024px]:max-w-[90%]
          max-[900px]:p-4 max-[900px]:max-w-[95%]
          max-[768px]:p-6
          max-[550px]:p-6
          max-[480px]:p-3
        "
      >
        <h1
          className={`
            text-[var(--bg-color-header)] text-[2rem] leading-[1.6] mb-4 font-bold
            max-[1024px]:text-[1.875rem] max-[1024px]:leading-[1.3] max-[1024px]:mb-4
            max-[900px]:text-[1.7rem] max-[900px]:leading-[1.3] max-[900px]:mb-3
            max-[768px]:text-[1.4rem] max-[768px]:leading-[1.3] max-[768px]:mb-3
            max-[480px]:text-[1.2rem] max-[480px]:leading-[1.38] max-[480px]:mb-3
            ${direction === "rtl" ? "text-right" : "text-left"}
          `}
        >
          {data.heading}
        </h1>

        <p
          className={`
            mb-5 text-[18px] text-[var(--text-primary)]
            max-[1024px]:text-[1.125rem] max-[1024px]:mb-[1.1rem]
            max-[900px]:text-[17px] max-[900px]:mb-4
            max-[480px]:text-[14px] max-[480px]:mb-[0.9rem]
            leading-[1.8]
            ${direction === "rtl" ? "text-right" : "text-left"}
          `}
        >
          <strong>{labels.question}</strong> <span>{data.question}</span>
        </p>

        {data.conclusion && (
          <div>
            <h2 className="text-[1.1rem] font-bold text-[#c3a421]">
              {labels.conclusion}
            </h2>
            <div
              className="my-4 p-5 rounded-2xl border-2 border-[rgba(195,164,33,0.5)] shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
              style={{
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <p className="m-0 leading-[1.7] text-[17px] text-[#2b2b2b] whitespace-pre-wrap">
                {data.conclusion}
              </p>
            </div>
          </div>
        )}

        <div className="mb-6 text-[18px]">
          <p
            className={`
              text-[18px] mb-[1.3rem]
              max-[1024px]:text-[18px]
              max-[900px]:text-[17px]
              max-[480px]:text-[14px]
              leading-[1.8]
              ${direction === "rtl" ? "text-right" : "text-left"}
            `}
          >
            <strong>{labels.answer}</strong>
          </p>
          {data.answer && renderAnswer(data.answer)}
        </div>

        <div id="dynamic-content">
          {data.content?.map((section, idx) => {
            const sectionTitle = sectionTitleMap[section.type] || "";
            if (section.type === "normal") {
              return (
                <p
                  key={idx}
                  className="whitespace-pre-wrap leading-[1.6] mb-4 text-[18px] max-[1024px]:text-[1.125rem] max-[900px]:text-[17px] max-[480px]:text-[14px]"
                >
                  {section.text}
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
                      text-[var(--bg-color-header)] mt-8 mb-4 text-[1.3rem] font-bold
                      max-[1024px]:text-[1.25rem] max-[1024px]:leading-[1.3] max-[1024px]:mt-6 max-[1024px]:mb-3
                      max-[900px]:text-[1.2rem] max-[900px]:mt-5 max-[900px]:mb-[0.6rem]
                      max-[480px]:text-[0.8rem] max-[480px]:leading-[1.25] max-[480px]:mt-4 max-[480px]:mb-2
                      ${direction === "rtl" ? "text-right" : "text-left"}
                    `}
                  >
                    {sectionTitle}
                  </h2>
                )}
                <ul className="ps-5 list-disc">
                  {items.map((item, i) => (
                    <li
                      key={i}
                      className="mb-6 text-[17px] max-[1024px]:text-[1.125rem] max-[900px]:text-[17px] max-[480px]:text-[14px]"
                    >
                      {item.reference && (
                        <strong
                          className={`block mb-2 text-[16px] max-[1024px]:text-[1.125rem] max-[900px]:text-[18px] max-[480px]:text-[15px] ${direction === "rtl" ? "text-right" : "text-left"}`}
                        >
                          {item.reference}
                        </strong>
                      )}
                      {item.narrator && (
                        <em
                          className={`block mb-2 text-[16px] max-[1024px]:text-[1.125rem] max-[900px]:text-[16px] max-[480px]:text-[13px] ${direction === "rtl" ? "text-right" : "text-left"}`}
                        >
                          {item.narrator}
                        </em>
                      )}
                      <blockquote
                        className={`
                          bg-[var(--bg-light)] border-s-[5px] border-[var(--bg-color-header)]
                          my-6 px-5 py-4 italic text-[17.5px] mb-2
                          max-[1024px]:text-[1.125rem] max-[1024px]:px-[1.2rem] max-[1024px]:py-[0.9rem] max-[1024px]:my-[1.2rem]
                          max-[900px]:text-[16.5px] max-[900px]:px-4 max-[900px]:py-3 max-[900px]:my-[1.1rem]
                          max-[480px]:text-[14px] max-[480px]:px-[0.9rem] max-[480px]:py-[0.6rem] max-[480px]:my-4
                          ${direction === "rtl" ? "text-right" : "text-left"}
                        `}
                      >
                        {item.text}
                      </blockquote>
                      {item.commentary && (
                        <p className="whitespace-pre-wrap leading-[1.6] mb-4 text-[18px] max-[1024px]:text-[1.125rem] max-[900px]:text-[17px] max-[480px]:text-[14px]">
                          {item.commentary}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="h-px bg-[#c3a421] my-8 opacity-60" />

        <p className="text-[18px]">
          <strong>{labels.andAllahKnowsBest}</strong>
        </p>

        <Link
          to={language === "ar" ? "/ar" : "/"}
          className="inline-block mt-8 text-[var(--bg-color-header)] no-underline font-bold hover:underline"
        >
          {labels.back}
        </Link>
      </div>

      <Footer lang={language} />
    </>
  );
}

export default QuestionPage;
