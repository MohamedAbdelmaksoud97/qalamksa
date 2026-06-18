import { OrderAccessForm } from "./order-access-form";

export default function Home() {
  return (
    <main className="min-h-dvh bg-[#f6fbfb] text-[#123133]" dir="rtl">
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-5 py-10 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="space-y-6">
            <p className="w-fit border-r-4 border-[#b7dfe1] pr-3 text-sm font-semibold text-[#37676a]">
              الوصول الصوتي الخاص
            </p>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-bold leading-tight text-[#102b2d] sm:text-5xl">
                أدخل رقم الطلب للوصول إلى ملفاتك الصوتية
              </h1>
              <p className="max-w-xl text-lg leading-8 text-[#496c6e]">
                امسح رمز QR ثم استخدم رقم طلبك من زد. إذا كان الطلب مسجلا
                لدينا سيتم فتح مكتبة الصوت الخاصة بك لمدة محدودة.
              </p>
            </div>
          </div>

          <OrderAccessForm />
        </div>
      </section>
    </main>
  );
}
