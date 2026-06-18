import { BrandLink } from "./brand-link";
import { OrderAccessForm } from "./order-access-form";

export default function Home() {
  return (
    <main className="min-h-dvh bg-[#f6fbfb] text-[#123133]" dir="rtl">
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-5 py-8 sm:px-8">
        <header className="flex justify-center">
          <BrandLink />
        </header>

        <div className="grid flex-1 gap-10 py-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="space-y-6 text-center lg:text-right">
            <p className="mx-auto w-fit border-b-4 border-[#b7dfe1] px-2 pb-2 text-sm font-semibold text-[#37676a] lg:mx-0 lg:border-b-0 lg:border-r-4 lg:pb-0 lg:pr-3">
              أهلا بك في قلم
            </p>
            <div className="space-y-4">
              <h1 className="mx-auto max-w-2xl text-4xl font-bold leading-tight text-[#102b2d] sm:text-5xl lg:mx-0">
                رحلتك الصوتية جاهزة
              </h1>
              <p className="mx-auto max-w-xl text-lg leading-8 text-[#496c6e] lg:mx-0">
                أدخل رقم طلبك لفتح مكتبة قلم الخاصة بك. سنعرض لك المنتجات
                المتاحة ونجهز روابط استماع آمنة تعمل لمدة محدودة.
              </p>
            </div>
            <p className="mx-auto max-w-lg rounded-lg border border-[#d7eff0] bg-white/70 px-4 py-3 text-sm leading-6 text-[#496c6e] lg:mx-0">
              رقم الطلب موجود في رسالة تأكيد الشراء من زد.
            </p>
          </div>

          <OrderAccessForm />
        </div>
      </section>
    </main>
  );
}
