import Image from "next/image";

const logoVariants = {
  main: {
    imageClassName: "h-40 w-40 lg:h-40 lg:w-40",
    size: 160,
  },
  audio: {
    imageClassName: "h-40 w-40 sm:h-32 sm:w-32 lg:h-36 lg:w-36",
    size: 144,
  },
} as const;

type BrandLinkProps = {
  variant?: keyof typeof logoVariants;
};

export function BrandLink({ variant = "main" }: BrandLinkProps) {
  const { imageClassName, size } = logoVariants[variant];

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
