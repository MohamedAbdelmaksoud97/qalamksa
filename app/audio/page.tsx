import { AudioLibrary } from "./audio-library";

export default function AudioPage() {
  return (
    <main className="min-h-dvh bg-[#f6fbfb] text-[#123133]" dir="rtl">
      <section className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8">
        <div className="mb-8 flex flex-col gap-2 border-b border-[#d7eff0] pb-6">
          <p className="text-sm font-semibold text-[#37676a]">
            مكتبة الصوت الخاصة
          </p>
          <h1 className="text-3xl font-bold">اختر المنتج ثم الملف الصوتي</h1>
        </div>

        <AudioLibrary />
      </section>
    </main>
  );
}
