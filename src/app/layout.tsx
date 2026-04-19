import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "心语 · 聆听你的内心",
  description: "当你心情不好的时候，来这里聊聊。心语提供温柔的情绪陪伴、倾听与支持，帮助你梳理情绪、找回内心的平静。",
  keywords: "心理支持, 情绪陪伴, 倾诉, 焦虑, 情绪低落, 心理健康",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
