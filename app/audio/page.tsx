import Link from "next/link";
import { BrandLink } from "../brand-link";
import { AudioLibrary } from "./audio-library";

export default function AudioPage() {
  return (
    <main
      className="min-h-dvh overflow-x-hidden bg-[#f5f9fa] text-[#3d4a50]"
      dir="rtl"
    >
      <header className="relative flex h-24 items-center justify-center bg-[#b7dfe1] px-14 shadow-md shadow-[#9bbec1]/25 sm:h-32 lg:h-36">
        <Link
          href="/"
          aria-label="العودة إلى صفحة رقم الطلب"
          className="absolute right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white text-[#173b3d] shadow-sm transition hover:bg-[#f6fbfb] focus:outline-none focus:ring-4 focus:ring-white/60 sm:right-5 sm:h-11 sm:w-11"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.25"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>

        <BrandLink imageClassName="h-20 w-20 sm:h-28 sm:w-28 lg:h-32 lg:w-32" size={128} />
      </header>

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
        <div className="mb-8 text-center sm:mb-10">
          <h1 className="text-3xl font-bold leading-tight text-[#3d4a50] sm:text-4xl lg:text-5xl">
            مكتبة قلم الصوتية
          </h1>
        </div>

        <AudioLibrary />
      </section>
    </main>
  );
}
