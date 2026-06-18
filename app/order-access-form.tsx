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
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/verify-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order_id: orderId.trim() }),
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
      className="space-y-5 rounded-lg border border-[#d7eff0] bg-white p-6 shadow-sm"
    >
      <div className="space-y-2">
        <label htmlFor="order-id" className="block text-sm font-semibold">
          رقم الطلب
        </label>
        <input
          id="order-id"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={orderId}
          onChange={(event) => setOrderId(event.target.value)}
          placeholder="مثال: 70827912"
          className="h-12 w-full rounded-md border border-[#c9e8ea] bg-[#fbfefe] px-4 text-right text-lg outline-none transition focus:border-[#73bdc2] focus:ring-4 focus:ring-[#b7dfe1]/40"
          required
        />
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-md bg-[#8fcfd3] px-5 font-bold text-[#102b2d] transition hover:bg-[#7ac5ca] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "جاري التحقق..." : "الدخول إلى الملفات الصوتية"}
      </button>
    </form>
  );
}
