import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import GuardProvider from "@/providers/guard-provider";
import { QueryProvider } from "@/providers/query-provider";

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
  title: "管理面板",
  description: "管理面板 - Viansite",
  icons: {
    icon: "/logo.svg",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-y-hidden`}
      >
        <QueryProvider>
          <GuardProvider>{children}</GuardProvider>
        </QueryProvider>
        <Toaster
          position="top-right"
          richColors
          expand={true}
          closeButton
          toastOptions={{
            style: {
              fontSize: "14px",
            },
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
