import React from "react";

export default function Cancel() {
  return (
    <div className="text-center py-[50px] px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
        Donation Cancelled
      </h1>

      <p className="text-sm sm:text-base text-gray-600 mb-6">
        You have cancelled the payment. If this was a mistake, please try again.
      </p>

      <a
        href="/donate"
        className="inline-block text-[var(--bg-color-header)] font-medium underline hover:opacity-80 transition"
      >
        Go Back to Donate
      </a>
    </div>
  );
}
