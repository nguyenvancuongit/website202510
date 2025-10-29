"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import { getCorporateHonors } from "@/services/corporate-honors.service";

import { GradientButton } from "../ui/gradient-button";

export default function CorporateHonors() {
  const {
    data: honors = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "corporate-honors",
      { limit: 3, sort_by: "sort_order", sort_order: "asc" },
    ],
    queryFn: () =>
      getCorporateHonors({
        limit: 3,
        sort_by: "sort_order",
        sort_order: "asc",
      }),
  });

  if (isLoading) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-charcoal mb-4">企业荣誉</h2>
          <p className="text-dark-blue-grey mb-12">
            荣誉见证服务品质，科技护航人才发展，象导生涯将坚守本心，砥砺前行。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-64 mb-4 relative overflow-hidden bg-gray-200 animate-pulse rounded-lg" />
                <div className="h-6 bg-gray-200 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-charcoal mb-4">企业荣誉</h2>
          <p className="text-dark-blue-grey mb-12">
            荣誉见证服务品质，科技护航人才发展，象导生涯将坚守本心，砥砺前行。
          </p>
          <div className="text-center text-gray-500">暂时无法加载荣誉信息</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-[59px] md:mb-20">
          <div>
            <h2 className="text-2xl sm:text-[64px] font-bold text-charcoal mb-[5px] md:mb-8">
              企业荣誉
            </h2>
            <p className=" text-sm text-dark-blue-grey">
              荣誉见证服务品质，科技护航人才发展，象导生涯将坚守本心，砥砺前行。
            </p>
          </div>
          <GradientButton className="hidden sm:flex">
            <span>查看更多</span>
            <Image
              alt="system guide"
              src="/icons/system-guide-icon.svg"
              height={36}
              width={36}
              className="w-6 h-6"
            />
          </GradientButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {honors.map((honor) => (
            <div key={honor.id} className="text-center">
              <div className="h-64 mb-4 relative overflow-hidden">
                <Image
                  src={
                    honor.image?.path ||
                    "/images/illustrations/honor-placeholder.png"
                  }
                  alt={honor.image?.alt_text || honor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-charcoal text-base sm:text-xl font-medium text-center">
                {honor.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
