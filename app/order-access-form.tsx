"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function OrderAccessForm() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const verifyOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedOrderId = orderId.trim();
    setError("");

    if (!trimmedOrderId) {
      setError("يرجى إدخال رقم الطلب أولا.");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/verify-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order_id: trimmedOrderId }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError("رقم الطلب غير صحيح أو غير مفعل. تأكد من الرقم وحاول مرة أخرى.");
      return;
    }

    router.push("/audio");
  };

  return (
    <form
      onSubmit={verifyOrder}
      noValidate
      className="space-y-6 rounded-xl border border-[#c7e7eb] bg-[#e8f4f6] px-6 py-5 shadow-sm lg:px-7 lg:py-7"
    >
      <div className="space-y-4">
        <label
          htmlFor="order-id"
          className="block text-right text-[20px] font-bold text-[#39484f]"
        >
          ادخل رقم الطلب
        </label>
        <input
          id="order-id"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={orderId}
          onChange={(event) => {
            setOrderId(event.target.value);
            if (error) {
              setError("");
            }
          }}
          placeholder="مثال : 70827912"
          aria-invalid={Boolean(error)}
          className="h-14 w-full rounded-md border border-[#c7e3e7] bg-white px-4 text-right text-[20px] font-medium text-[#39484f] outline-none transition placeholder:text-right placeholder:text-[#c5c9cc] focus:border-[#73bdc2] focus:ring-4 focus:ring-[#b7dfe1]/40 aria-invalid:border-red-300 aria-invalid:bg-red-50"
        />
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-right text-sm leading-6 text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-14 w-full rounded-md bg-[#b7dfe1] px-5 text-[20px] font-bold text-[#39484f] shadow-md shadow-[#8dbec2]/30 transition hover:bg-[#a8d7da] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "جاري التحقق..." : "الدخول للملفات الصوتية"}
      </button>
    </form>
  );
}
