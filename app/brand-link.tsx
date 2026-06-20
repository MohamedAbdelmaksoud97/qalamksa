import Image from "next/image";

type BrandLinkProps = {
  imageClassName?: string;
  size?: number;
};

export function BrandLink({
  imageClassName = "h-24 w-24",
  size = 96,
}: BrandLinkProps) {
  return (
    <a
      href="https://qalamksa.com/"
      className="mx-auto inline-flex w-fit items-center rounded-md outline-none transition focus:ring-4 focus:ring-[#b7dfe1]/50"
      aria-label="Qalam"
    >
      <Image
        src="/logo.png"
        alt="Qalam"
        width={size}
        height={size}
        priority
        className={`${imageClassName} object-contain`}
      />
    </a>
  );
}
