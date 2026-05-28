import React from "react";
import { Link } from "react-router-dom";

export default function Success() {
  return (
    <div
      className="
        font-[var(--font-family)]
        bg-[var(--page-background)]
        min-h-[90vh]
        flex justify-center items-center
        p-5
      "
    >
      <div
        className="
          bg-white
          p-[40px_30px]
          rounded-[10px]
          text-center
          shadow-[0_4px_12px_rgba(0,0,0,0.1)]
          max-w-[450px]
          w-full
        "
      >
        <div
          className="
            text-[60px]
            text-[#1f6f3e]
            mb-[20px]
          "
        >
          ✓
        </div>

        <h1
          className="
            text-[28px]
            text-[#2c3e50]
            mb-[10px]
          "
        >
          Thank you!
        </h1>

        <p
          className="
            text-[16px]
            text-[#555]
            mb-[25px]
          "
        >
          Your donation has been successfully processed.
        </p>

        <Link
          to="/"
          className="
            inline-block
            mt-[10px]
            text-[#1f6f3e]
            font-bold
            no-underline
          "
        >
          ← Go back to AskSunnah
        </Link>
      </div>
    </div>
  );
}