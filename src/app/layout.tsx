import "@/styles/globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppInitializer from "./context/AppInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://soobaeki.github.io/how-to-merry"),

  title: "Marriage 💍",
  description: "소중한 추억과 마음을 담아 만든 특별한 공간입니다.",

  icons: {
    icon: "./icon.svg",
  },

  openGraph: {
    title: "Marriage 💍",
    description: "소중한 추억과 마음을 담아 만든 특별한 공간입니다.",
    url: "/",
    siteName: "How to Merry",
    images: [
      {
        url: "./og-image.png",
        width: 1200,
        height: 630,
        alt: "How to Merry Preview",
      },
    ],
    locale: "ko_KR",
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
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AppInitializer>
          <main className="flex-1 flex flex-col">{children}</main>
        </AppInitializer>
      </body>
    </html>
  );
}
