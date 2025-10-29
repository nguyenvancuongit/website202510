import type { Metadata } from "next";
import Localfont from "next/font/local";

import { Toaster } from "@/components/ui/sonner";
import GuardProvider from "@/providers/guard-provider";
import { QueryProvider } from "@/providers/query-provider";

import "./globals.css";

const alibabaPuHuiTi = Localfont({
  src: "../../public/fonts/Alibaba-PuHuiTi-R.ttf",
  variable: "--font-alibaba-puhuiti",
  weight: "400",
})

const sourceHanSans = Localfont({
  src: "../../public/fonts/SourceHanSans-Regular.otf",
  variable: "--font-source-han-sans",
  weight: "400",
})

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
        className={`${sourceHanSans.className} ${alibabaPuHuiTi.variable} antialiased overflow-y-hidden`}
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
