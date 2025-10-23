import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mkp25.com'),
  title: "TASTY VIVID TUNE",
  description: "Magic Kingdom Project - TASTY VIVID TUNE",
  manifest: "/manifest.json",
  icons: {
    icon: "/background_logo.PNG",
    apple: "/background_logo.PNG",
  },
  openGraph: {
    title: "TASTY VIVID TUNE",
    description: "Magic Kingdom Project - TASTY VIVID TUNE",
    url: "/",
    siteName: "TASTY VIVID TUNE",
    images: [
      {
        url: "/Xサムネイル.png",
        width: 1200,
        height: 630,
        alt: "TASTY VIVID TUNE",
        type: "image/png",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TASTY VIVID TUNE",
    description: "Magic Kingdom Project - TASTY VIVID TUNE",
    images: ["/Xサムネイル.png"],
    creator: "@MagicKingdomProject",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="theme-color" content="#FF9A33" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased no-zoom`}
      >
        {children}
      </body>
    </html>
  );
}
