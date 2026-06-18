import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "الوصول الصوتي الخاص",
  description: "نظام تحقق آمن للوصول إلى الملفات الصوتية الخاصة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
