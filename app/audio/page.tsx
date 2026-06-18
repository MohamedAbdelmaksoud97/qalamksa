import Link from "next/link";
import { BrandLink } from "../brand-link";
import { AudioLibrary } from "./audio-library";

export default function AudioPage() {
  return (
    <main className="min-h-dvh bg-[#f6fbfb] text-[#123133]" dir="rtl">
      <section className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8">
        <header className="relative mb-8 flex min-h-24 items-center justify-center">
          <Link
            href="/"
            aria-label="العودة إلى صفحة رقم الطلب"
            className="absolute right-0 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d7eff0] bg-white text-[#173b3d] shadow-sm transition hover:border-[#8fcfd3] hover:bg-[#fbfefe] focus:outline-none focus:ring-4 focus:ring-[#b7dfe1]/50"
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

          <BrandLink />
        </header>

        <div className="mb-8 flex flex-col gap-2 border-b border-[#d7eff0] pb-6 text-center">
          <p className="text-sm font-semibold text-[#37676a]">
            مكتبة الصوت الخاصة
          </p>
          <h1 className="text-3xl font-bold">
            اختر المنتج ثم الملف الصوتي
          </h1>
        </div>

        <AudioLibrary />
      </section>
    </main>
  );
}
