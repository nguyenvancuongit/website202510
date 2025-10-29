"use client";

import { useEffect } from "react";
import Image from "next/image";

import { useBreadcrumbStore } from "@/store/breadcrumb-store";

export default function AdminPage() {
  const { setBreadcrumbs } = useBreadcrumbStore();

  useEffect(() => {
    setBreadcrumbs([
    ]);
  }, [setBreadcrumbs]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-8 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-8">
        {/* Bouncing icon */}
        <div className="flex justify-center animate-bounce">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
            <div className="relative bg-blue-50 p-4 rounded-2xl shadow-xl">
              <Image src="/logo.svg" alt="Vian Logo" width={80} height={80} className="w-20 h-20" />
            </div>
          </div>
        </div>

        {/* Welcome text with staggered animations */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold animate-fade-in">
            <span className="bg-gradient-to-r from-primary via-blue-800 to-blue-400 bg-clip-text text-transparent animate-slide-in-up">
              欢迎来到
            </span>
          </h1>
          <h2
            className="text-5xl md:text-6xl font-bold text-gray-900 animate-slide-in-up"
            style={{ animationDelay: "200ms" }}
          >
            Vian 后台管理系统
          </h2>
          <div
            className="flex items-center justify-center gap-2 text-lg text-gray-500 animate-slide-in-up"
            style={{ animationDelay: "400ms" }}
          >
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-primary" />
            <span>开始您的管理之旅</span>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
