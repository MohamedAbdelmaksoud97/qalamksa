import type { Metadata } from "next";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://qalamksa.com/"),
  title: "الوصول الصوتي الخاص | قلم",
  description: "نظام تحقق آمن للوصول إلى الملفات الصوتية الخاصة.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "الوصول الصوتي الخاص | قلم",
    description: "نظام تحقق آمن للوصول إلى الملفات الصوتية الخاصة.",
    url: "https://qalamksa.com/",
    siteName: "Qalam",
    images: [
      {
        url: "/logo.png",
        width: 175,
        height: 175,
        alt: "Qalam",
      },
    ],
    locale: "ar_SA",
    type: "website",
  },
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
