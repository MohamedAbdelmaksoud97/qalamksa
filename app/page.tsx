import { BrandLink } from "./brand-link";
import { OrderAccessForm } from "./order-access-form";

export default function Home() {
  return (
    <main className="min-h-dvh bg-[#f5f9fa] text-[#3d4a50]" dir="rtl">
      <section className="flex min-h-dvh w-full flex-col bg-[#f5f9fa]">
        <header className="flex h-48 items-center justify-center bg-[#b6d9dd] px-6 lg:h-40">
          <BrandLink imageClassName="h-40 w-40 lg:h-40 lg:w-40" size={160} />
        </header>

        <div className="flex flex-1 flex-col px-5 pb-8 pt-10 text-center sm:px-6 lg:mx-auto lg:grid lg:w-full lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:gap-16 lg:px-10 lg:py-20">
          <section className="space-y-5 lg:text-right">
            <h1 className="text-[22px] font-bold leading-9 text-[#37464d] lg:max-w-2xl lg:text-5xl lg:leading-[1.25]">
              أهلا بك في المكتبة الصوتية من قلم
            </h1>
            <p className="mx-auto max-w-[340px] text-[17px] font-medium leading-8 text-[#66757b] lg:mx-0 lg:max-w-xl lg:text-xl lg:leading-9">
              مساحتك الصوتية الخاصة لتفعيل أدواتك التعليمية وتحقيق أقصى استفادة
              منها.
            </p>
            <p className="mx-auto mt-14 rounded-lg border border-[#c4e5e9] bg-[#eef8fa] px-5 py-4 text-[16px] leading-7 text-[#5f6d73] lg:mx-0 lg:mt-8 lg:max-w-xl">
              أدخل رقم الطلب المرسل لك عبر الواتساب أو الإيميل.
            </p>
          </section>

          <div className="mt-8 lg:mt-0">
            <OrderAccessForm />
          </div>

          <footer className="mt-4 text-[12px] leading-5 text-[#6c787d] lg:col-span-2 lg:mt-14 lg:text-center">
            جميع حقوق الطبع والنشر للملفات الصوتية محفوظة لقلم التعليمية © ٢٠٢٦
            <br />
            يمنع إعادة النشر أو التوزيع لضمان حقوق وأمان التجربة.
          </footer>
        </div>
      </section>
    </main>
  );
}
