"use client";

import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center space-y-8">
          {/* 404 Number with floating animation */}
          <div className="relative">
            <div className="absolute inset-0 blur-3xl opacity-30">
              <div className="w-full h-full bg-primary rounded-full" />
            </div>
            <h1 className="text-[12rem] md:text-[16rem] font-bold text-primary leading-none tracking-tighter animate-float relative">
              404
            </h1>
          </div>

          {/* Main message */}
          <div className="space-y-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              页面走丢了
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
              抱歉，您访问的页面似乎不存在或已被移除。
              <br />
              让我们帮您找到正确的方向。
            </p>
          </div>

          {/* Decorative elements */}
          <div className="flex justify-center gap-4 py-8">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 backdrop-blur-sm animate-bounce-slow"
              style={{ animationDelay: "0s" }}
            />
            <div
              className="w-16 h-16 rounded-2xl bg-accent/10 backdrop-blur-sm animate-bounce-slow"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 backdrop-blur-sm animate-bounce-slow"
              style={{ animationDelay: "0.4s" }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="gap-2 min-w-[200px]">
              <Link href="/">
                <Home className="w-5 h-5" />
                返回首页
              </Link>
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              size="lg"
              className="gap-2 min-w-[200px] bg-transparent"
            >
              <ArrowLeft className="w-5 h-5" />
              返回上一页
            </Button>
          </div>
        </div>
      </div>

      {/* Background decorative circles */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        />
      </div>
    </div>
  );
}
