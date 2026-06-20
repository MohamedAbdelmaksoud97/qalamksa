"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AudioFile = {
  id: string;
  title: string;
  sort_order: number;
  product_key: "product1";
};

const product = {
  key: "product1",
  title: "استراتيجية التمايز",
  description: "ملفات المجلد 3",
  helper: "اختر المنتج، ثم حدد الملف الصوتي",
  image: "/strategy-differentiation.jpeg",
};

export function AudioLibrary() {
  const router = useRouter();
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPreparing, setIsPreparing] = useState(false);

  useEffect(() => {
    const loadAudioFiles = async () => {
      setIsLoading(true);
      setError("");

      const response = await fetch(`/api/audio?product=${product.key}`, {
        cache: "no-store",
      });

      if (response.status === 401) {
        router.replace("/");
        return;
      }

      if (!response.ok) {
        setError("تعذر تحميل الملفات الصوتية. حاول مرة أخرى لاحقا.");
        setIsLoading(false);
        return;
      }

      const data = (await response.json()) as { files: AudioFile[] };
      setFiles(data.files);
      setIsLoading(false);
    };

    loadAudioFiles();
  }, [router]);

  const playFile = async (fileId: string) => {
    setSelectedId(fileId);
    setError("");
    setIsPreparing(true);

    const response = await fetch(`/api/audio/${fileId}?product=${product.key}`, {
      cache: "no-store",
    });

    setIsPreparing(false);

    if (response.status === 401) {
      router.replace("/");
      return;
    }

    if (!response.ok) {
      setError("تعذر تجهيز رابط التشغيل. حاول مرة أخرى.");
      return;
    }

    const data = (await response.json()) as { url: string };
    setAudioUrl(data.url);
  };

  return (
    <div className="mx-auto grid w-full min-w-0 max-w-xl gap-6 sm:gap-8 lg:max-w-none lg:grid-cols-[420px_minmax(0,1fr)] lg:items-start lg:gap-14">
      <section className="min-w-0 space-y-6 sm:space-y-8">
        <p className="w-full rounded-lg border border-[#c4e5e9] bg-[#e8f4f6] px-4 py-4 text-center text-[18px] font-medium leading-8 text-[#4f5d63] sm:px-5 sm:text-[19px]">
          {product.helper}
        </p>

        <article className="flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-[#bde3e7] bg-[#c7eef1] px-4 py-4 text-right shadow-md shadow-[#9bbec1]/25 sm:gap-5 sm:px-7">
          <div className="min-w-0 flex-1">
            <h2 className="break-words text-[18px] font-bold leading-7 text-[#3d4a50] sm:text-[20px]">
              {product.title}
            </h2>
            <p className="mt-1 text-[15px] font-medium leading-6 text-[#5d6b70] sm:text-[17px]">
              {product.description}
            </p>
          </div>

          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-white/50 sm:h-20 sm:w-28">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 96px, 112px"
              className="object-cover"
            />
          </div>
        </article>

        {audioUrl ? (
          <div className="w-full rounded-xl border border-[#c4e5e9] bg-white px-4 py-4 shadow-sm sm:px-5">
            <p className="mb-3 text-right text-sm font-semibold leading-6 text-[#5d6b70]">
              {isPreparing
                ? "جاري تجهيز رابط آمن للتشغيل..."
                : "رابط التشغيل صالح لمدة 10 دقائق."}
            </p>
            <audio className="w-full" controls src={audioUrl} autoPlay />
          </div>
        ) : null}
      </section>

      <section className="min-w-0 space-y-4 sm:space-y-5">
        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-right text-sm leading-6 text-red-700">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <p className="rounded-xl border border-[#c4e5e9] bg-white px-5 py-5 text-center text-[#66757b]">
            جاري تحميل الملفات...
          </p>
        ) : files.length === 0 ? (
          <p className="rounded-xl border border-[#c4e5e9] bg-white px-5 py-5 text-center text-[#66757b]">
            لا توجد ملفات صوتية متاحة حاليا.
          </p>
        ) : (
          files.map((file) => (
            <article
              key={file.id}
              className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-xl border bg-white px-4 py-4 shadow-md shadow-[#9bbec1]/20 transition sm:gap-4 sm:px-7 ${
                selectedId === file.id
                  ? "border-[#86cbd0]"
                  : "border-[#bde3e7]"
              }`}
            >
              <h3 className="min-w-0 flex-1 break-words text-right text-[17px] font-medium leading-7 text-[#4b565b] sm:text-[18px]">
                {file.title}
              </h3>

              <button
                type="button"
                onClick={() => playFile(file.id)}
                disabled={isPreparing && selectedId === file.id}
                className="h-10 min-w-24 shrink-0 rounded-md bg-[#b7dfe1] px-4 text-[16px] font-bold text-[#3d4a50] transition hover:bg-[#a8d7da] disabled:cursor-wait disabled:opacity-70 sm:h-11 sm:min-w-32 sm:px-6 sm:text-[17px]"
              >
                {isPreparing && selectedId === file.id ? "..." : "تشغيل"}
              </button>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
