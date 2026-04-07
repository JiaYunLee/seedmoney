import type { Metadata } from "next";
import { Lato, Open_Sans } from "next/font/google";
import "./globals.css";

const lato = Lato({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

const openSans = Open_Sans({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-opensans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SeedMoney",
  description: "SeedMoney User Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lato.variable} ${openSans.variable} h-full`}>
      <body className="h-full font-[family-name:var(--font-lato)]">{children}</body>
    </html>
  );
}
