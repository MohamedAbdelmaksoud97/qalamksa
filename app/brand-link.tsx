import Image from "next/image";

export function BrandLink() {
  return (
    <a
      href="https://qalamksa.com/"
      className="mx-auto inline-flex w-fit items-center rounded-md outline-none transition focus:ring-4 focus:ring-[#b7dfe1]/50"
      aria-label="Qalam"
    >
      <Image
        src="/logo.png"
        alt="Qalam"
        width={96}
        height={96}
        priority
        className="h-24 w-24 rounded-md object-contain"
      />
    </a>
  );
}
