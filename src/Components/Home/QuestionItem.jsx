import { Link } from "react-router-dom";
import React from "react";

const QuestionItem = ({
  item,
  index,
  labelPrefix = "Q",
  direction = "ltr",
  currentPage = 1,
}) => {
  const isRTL = direction === "rtl";
  const basePath = isRTL
    ? `/ar/questions/${item.slug}`
    : `/questions/${item.slug}`;
  const backPage = currentPage > 1 ? `?page=${currentPage}` : "";

  return (
    <Link
      to={`${basePath}${backPage}`}
      dir={direction}
      className={`
        block
        mt-4 sm:mt-6

        p-3 sm:p-4

        rounded-[5px]
        no-underline

        transition-all duration-200

        border border-[#eee]
        bg-[#fefefe]

        text-[var(--text-main)]

        hover:bg-[var(--bg-secondary)]
        hover:cursor-pointer

        text-[0.9rem]
        leading-6

        sm:text-[1rem]

        break-words

        ${
          isRTL
            ? "border-r-[5px] border-r-[var(--bg-color-header)] text-right"
            : "border-l-[5px] border-l-[var(--bg-color-header)] text-left"
        }
      `}
    >
      <strong className="text-[0.9rem] sm:text-[1rem]">
        {labelPrefix}
        {index + 1}:
      </strong>{" "}
      <span className="text-[0.9rem] sm:text-[1rem] leading-6">
        {item.heading}
      </span>
    </Link>
  );
};

export default QuestionItem;
