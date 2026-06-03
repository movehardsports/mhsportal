import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Header } from "@/components/header";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MHS",
  description: "Move Hard Sports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-[family-name:var(--font-dm-sans)]">
        <Header />
        {children}
      </body>
    </html>
  );
}
