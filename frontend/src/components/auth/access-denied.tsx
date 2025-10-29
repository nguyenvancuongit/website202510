"use client";

import { ArrowLeft, Lock,Shield } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function AccessDeniedPage() {
  const router = useRouter();

  return (
    <div className="h-[calc(100vh- 4rem - 68px)] bg-transparent relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-2xl animate-float opacity-20 transform rotate-12"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-[#ec4899] to-[#be185d] rounded-full animate-bounce-gentle opacity-25"></div>
        <div
          className="absolute bottom-32 left-20 w-24 h-24 bg-gradient-to-br from-[#34d399] to-[#059669] rounded-3xl animate-float opacity-20 transform -rotate-12"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-10 w-18 h-18 bg-gradient-to-br from-[#fb923c] to-[#ea580c] rounded-2xl animate-bounce-gentle opacity-25"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] rounded-full animate-float opacity-10 transform -translate-x-1/2 -translate-y-1/2"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#6366f1] to-[#4f46e5] rounded-3xl flex items-center justify-center animate-pulse-glow transform rotate-3 shadow-2xl">
              <Shield className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-[#ec4899] to-[#be185d] rounded-full flex items-center justify-center animate-bounce-gentle">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] text-balance">
            403
          </h1>

          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1d29] mb-4 text-balance">
            {"访问被拒绝"}
          </h2>

          <p className="text-lg text-[#64748b] mb-8 leading-relaxed max-w-lg mx-auto text-pretty">
            {
              "您没有访问此页面的权限。请联系管理员获取相应权限，或返回到您有权限访问的页面。"
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white px-8 py-3 text-lg font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {"返回首页"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
