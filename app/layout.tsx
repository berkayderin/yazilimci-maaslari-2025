import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Yazılımcı Maaşları 2025 | Türkiye'de Yazılım Sektörü Maaş Analizi",
  description:
    "Türkiye ve yurt dışındaki yazılımcı maaşlarının kapsamlı analizi. Pozisyon, deneyim, şirket büyüklüğü ve çalışma türüne göre yazılımcı maaş istatistikleri.",
  keywords:
    "yazılımcı maaşları, yazılım maaşları, türkiye yazılımcı maaşları, yazılım sektörü, maaş analizi, developer maaşları, 2025 maaşları",
  authors: [
    {
      name: "Berkay Derin",
      url: "https://github.com/berkayderin",
    },
  ],
  creator: "Berkay Derin",
  openGraph: {
    title: "Yazılımcı Maaşları 2025 | Türkiye'de Yazılım Sektörü Maaş Analizi",
    description:
      "Türkiye ve yurt dışındaki yazılımcıların maaş analizi ve istatistikleri. Pozisyon, deneyim ve şirket büyüklüğüne göre detaylı veriler.",
    url: "https://yazilimci-maaslari.vercel.app",
    siteName: "Yazılımcı Maaşları",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Yazılımcı Maaşları 2025",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yazılımcı Maaşları 2025 | Türkiye'de Yazılım Sektörü Maaş Analizi",
    description:
      "Türkiye ve yurt dışındaki yazılımcıların maaş analizi ve istatistikleri. Pozisyon, deneyim ve şirket büyüklüğüne göre detaylı veriler.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
