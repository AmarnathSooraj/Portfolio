import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const ndot57 = localFont({
  src: "../public/fonts/Ndot57-Regular.otf",
  variable: "--font-terminal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Amarnath | Portfolio",
  description: "Portfolio of Amarnath - Developer & Creator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ndot57.variable}`}>
      <body className="bg-[#0a0a0a] text-[#00ff41]">{children}</body>
    </html>
  );
}
