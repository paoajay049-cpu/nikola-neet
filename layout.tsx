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
  metadataBase: new URL("https://nikolaneet.com"),
  title: { default: "Nikola NEET | Physics Courses for NEET", template: "%s | Nikola NEET" },
  description: "Live and recorded NEET Physics courses for Class 11, Class 12, Target Batch and Pre-Foundation students, with chapter booklets, DPPs and tests.",
  keywords: ["Nikola NEET", "NEET Physics", "NEET Physics course", "Class 11 Physics", "Class 12 Physics", "Ajay Yadav Physics"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: { title: "Nikola NEET | Physics Courses for NEET", description: "Live classes, recorded lectures, chapter booklets, DPPs and tests for NEET Physics.", url: "https://nikolaneet.com", siteName: "Nikola NEET", type: "website", locale: "hi_IN" },
  other: { "codex-preview": "development" },
  icons: { icon: "/nikola-neet-logo.jpg", shortcut: "/nikola-neet-logo.jpg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hi">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
