import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "سالن زیبایی رویای زیبا | رزرو آنلاین وقت",
  description: "سالن زیبایی رویای زیبا - خدمات کوتاهی مو، رنگ مو، مژه، ناخن و آرایش عروس",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 text-gray-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
