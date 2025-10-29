import type { Metadata } from "next";
import localFont from "next/font/local";

import { ConditionalFooter } from "@/components/layouts/conditional-footer";
import { Header } from "@/components/layouts/header";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const sourceHanSansCN = localFont({
  src: "../../public/fonts/Source-Han-Sans-CN-Regular.otf",
  variable: "--font-source-han-sans-cn",
  display: "swap",
  weight: "400",
});

const meibeiHeHe = localFont({
  src: "../../public/fonts/Meibei-Hehe-Body.ttf",
  variable: "--font-meibei-he-he",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "象导生涯",
  description:
    "象导生涯 - 专注于职业教育与职业发展的综合服务平台，提供优质的课程、培训和职业指导，助力个人实现职业目标。",
  icons: {
    icon: "/images/logos/logo.svg",
  },
  openGraph: {
    title: "象导生涯",
    description:
      "象导生涯 - 专注于职业教育与职业发展的综合服务平台，提供优质的课程、培训和职业指导，助力个人实现职业目标。",
    images: "/images/logos/logo.svg",
    siteName: "象导生涯",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sourceHanSansCN.className} ${meibeiHeHe.variable} antialiased relative`}>
        <Providers>
          <Header />
          {children}
          <ConditionalFooter />
          <Toaster position="top-right" richColors expand={true} closeButton />
        </Providers>
      </body>
    </html>
  );
}
