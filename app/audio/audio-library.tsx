"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ProductKey = "product1" | "product2";

type AudioFile = {
  id: string;
  title: string;
  sort_order: number;
  product_key: ProductKey;
};

const products: { key: ProductKey; label: string; description: string }[] = [
  {
    key: "product1",
    label: "المنتج الأول",
    description: "ملفات المجلد product1",
  },
  {
    key: "product2",
    label: "المنتج الثاني",
    description: "ملفات المجلد product2",
  },
];

export function AudioLibrary() {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<ProductKey | null>(
    null,
  );
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    const loadAudioFiles = async () => {
      setIsLoading(true);
      setError("");
      setAudioUrl("");
      setSelectedId(null);

      const response = await fetch(`/api/audio?product=${selectedProduct}`, {
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
  }, [router, selectedProduct]);

  const playFile = async (fileId: string) => {
    if (!selectedProduct) {
      return;
    }

    setSelectedId(fileId);
    setError("");
    setIsPreparing(true);

    const response = await fetch(
      `/api/audio/${fileId}?product=${selectedProduct}`,
      { cache: "no-store" },
    );
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
    <div className="space-y-8">
      <section className="grid gap-3 sm:grid-cols-2">
        {products.map((product) => (
          <button
            key={product.key}
            type="button"
            onClick={() => setSelectedProduct(product.key)}
            className={`rounded-lg border p-5 text-right shadow-sm transition ${
              selectedProduct === product.key
                ? "border-[#73bdc2] bg-[#e8f6f7]"
                : "border-[#d7eff0] bg-white hover:border-[#8fcfd3]"
            }`}
          >
            <span className="block text-lg font-bold">{product.label}</span>
            <span className="mt-2 block text-sm text-[#496c6e]">
              {product.description}
            </span>
          </button>
        ))}
      </section>

      {!selectedProduct ? (
        <p className="rounded-lg border border-[#d7eff0] bg-white p-5 text-[#496c6e]">
          اختر المنتج لعرض الملفات الصوتية الخاصة به.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {isLoading ? (
              <p className="text-[#496c6e]">جاري تحميل الملفات...</p>
            ) : files.length === 0 ? (
              <p className="rounded-lg border border-[#d7eff0] bg-white p-5 text-[#496c6e]">
                لا توجد ملفات صوتية متاحة لهذا المنتج حاليا.
              </p>
            ) : (
              files.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => playFile(file.id)}
                  className="flex w-full items-center justify-between rounded-lg border border-[#d7eff0] bg-white p-4 text-right shadow-sm transition hover:border-[#8fcfd3] hover:bg-[#fbfefe]"
                >
                  <span className="font-semibold">{file.title}</span>
                  <span className="rounded-full bg-[#b7dfe1] px-3 py-1 text-sm font-bold text-[#173b3d]">
                    تشغيل
                  </span>
                </button>
              ))
            )}
          </div>

          <aside className="rounded-lg border border-[#d7eff0] bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">المشغل</h2>

            {error ? (
              <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <audio className="w-full" controls src={audioUrl || undefined} />

            <p className="mt-4 text-sm leading-6 text-[#496c6e]">
              {isPreparing
                ? "جاري تجهيز رابط آمن للتشغيل..."
                : selectedId
                  ? "رابط التشغيل صالح لمدة 10 دقائق."
                  : "اختر ملفا من القائمة لبدء الاستماع."}
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
