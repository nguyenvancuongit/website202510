"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CompactPagination from "@/components/ui/compact-pagination";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EmptyState } from "@/components/ui/states";
import { cn } from "@/lib/utils";
import {
  getJobCategories,
  getJobs,
  JOB_TYPE_LABELS,
  JOB_TYPES,
} from "@/services/careers.service";

const typeOptions = [
  { value: "all", label: "全部" },
  { value: JOB_TYPES.FULL_TIME, label: JOB_TYPE_LABELS[JOB_TYPES.FULL_TIME] },
  { value: JOB_TYPES.INTERNSHIP, label: JOB_TYPE_LABELS[JOB_TYPES.INTERNSHIP] },
];

export default function CareersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeJobIndex, setActiveJobIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Initialize state from URL params
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [queryTerm, setQueryTerm] = useState(searchParams.get("search") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const categories = searchParams.get("categories");
    return categories ? categories.split(",") : ["all"];
  });
  const [selectedTypes, setSelectedTypes] = useState<string[]>(() => {
    const types = searchParams.get("types");
    return types ? types.split(",") : ["all"];
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page) : 1;
  });

  const getPreviewText = (html: string, maxLen = 120) => {
    const text = html
      ? html
          .replace(/<[^>]*>/g, "")
          .replace(/\s+/g, " ")
          .trim()
      : "";
    return text.length > maxLen ? `${text.slice(0, maxLen)}…` : text;
  };

  // Fetch job categories
  const { data: jobCategories = [] } = useQuery({
    queryKey: ["job-categories"],
    queryFn: () => getJobCategories(),
    select: (data) => [{ id: "all", name: "全部", slug: "all" }, ...data],
  });

  // Fetch jobs with filters
  const {
    data: jobsData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [
      "jobs",
      {
        category_id:
          selectedCategories[0] === "all"
            ? undefined
            : selectedCategories.map((id) => parseInt(id)),
        type:
          selectedTypes.length === 1 && selectedTypes[0] !== "all"
            ? selectedTypes[0]
            : selectedTypes.length > 1 && !selectedTypes.includes("all")
            ? selectedTypes
            : undefined,
        search: queryTerm || undefined,
        page: currentPage,
        limit: 10,
      },
    ],
    queryFn: () =>
      getJobs({
        category_id:
          selectedCategories[0] === "all"
            ? undefined
            : selectedCategories.map((id) => parseInt(id)),
        type:
          selectedTypes.length === 1 && selectedTypes[0] !== "all"
            ? selectedTypes[0]
            : selectedTypes.length > 1 && !selectedTypes.includes("all")
            ? selectedTypes.toString()
            : undefined,
        search: queryTerm || undefined,
        page: currentPage,
        limit: 10,
      }),
  });

  const jobs = jobsData?.data || [];
  const totalPages = jobsData?.pagination?.total_pages || 1;

  // Update URL params
  const updateURLParams = (params: {
    categories?: string[];
    types?: string[];
    search?: string;
    page?: number;
  }) => {
    const newParams = new URLSearchParams();

    const cats = params.categories ?? selectedCategories;
    const types = params.types ?? selectedTypes;
    const search = params.search ?? queryTerm;
    const page = params.page ?? currentPage;

    // Only add non-default params to URL
    if (cats.length > 0 && cats[0] !== "all") {
      newParams.set("categories", cats.join(","));
    }
    if (types.length > 0 && types[0] !== "all") {
      newParams.set("types", types.join(","));
    }
    if (search) {
      newParams.set("search", search);
    }
    if (page > 1) {
      newParams.set("page", page.toString());
    }

    const newURL = newParams.toString()
      ? `?${newParams.toString()}`
      : window.location.pathname;
    router.push(newURL, { scroll: false });
  };

  const handleCategoryChange = (categoryId: string) => {
    let newCategories: string[];

    if (categoryId === "all") {
      newCategories = ["all"];
    } else {
      const base = selectedCategories.filter((c) => c !== "all");
      const next = base.includes(categoryId)
        ? base.filter((c) => c !== categoryId)
        : [...base, categoryId];
      newCategories = next.length === 0 ? ["all"] : next;
    }

    setSelectedCategories(newCategories);
    setCurrentPage(1);
    updateURLParams({ categories: newCategories, page: 1 });
  };

  const handleTypeChange = (typeValue: string) => {
    let newTypes: string[];

    if (typeValue === "all") {
      newTypes = ["all"];
    } else {
      const base = selectedTypes.filter((t) => t !== "all");
      const next = base.includes(typeValue)
        ? base.filter((t) => t !== typeValue)
        : [...base, typeValue];
      newTypes = next.length === 0 ? ["all"] : next;
    }

    setSelectedTypes(newTypes);
    setCurrentPage(1);
    updateURLParams({ types: newTypes, page: 1 });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setQueryTerm(searchTerm);
    updateURLParams({ search: searchTerm, page: 1 });
  };

  // When input is cleared, auto-clear search param and fetch all
  useEffect(() => {
    if (searchTerm === "" && queryTerm !== "") {
      setCurrentPage(1);
      setQueryTerm("");
      updateURLParams({ search: "", page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-white pt-20">
      <section className="h-[480px] relative">
        <Image
          src="/images/careers/banner.png"
          alt="加入我们  成就精彩的你"
          width={1920}
          height={480}
          className="absolute top-0 left-1/2 -translate-x-1/2 media h-[480px] inset-0 object-cover"
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(90deg, #0A0909 3.96%, rgba(112, 105, 105, 0.00) 73.85%)",
          }}
        />
        <div className="max-w-7xl text-center mx-auto px-4 sm:px-6 lg:px-8 relative z-10 top-1/3 flex items-center justify-center">
          <h1
            className={cn(
              "text-4xl lg:text-5xl text-center font-bold leading-tight text-balance text-white"
            )}
          >
            加入我们 成就精彩的你
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Left Sidebar - Filters */}
          <div className="w-full hidden sm:block lg:w-1/5 space-y-6">
            {/* Job Category Filter */}
            <div className="mt-20">
              <h3 className="font-medium text-xl text-charcoal mb-4">
                职位类别
              </h3>
              <div className="space-y-3">
                {jobCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleCategoryChange(category.id)}
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Type Filter */}
            <div>
              <h3 className="font-medium text-xl text-charcoal mb-4">
                职位性质
              </h3>
              <div className="space-y-3">
                {typeOptions.map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${opt.value}`}
                      checked={selectedTypes.includes(opt.value)}
                      onCheckedChange={() => handleTypeChange(opt.value)}
                    />
                    <label
                      htmlFor={`type-${opt.value}`}
                      className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {opt.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Job Listings */}
          <div className="w-full sm:w-4/5">
            {/* Search Bar */}
            <div className="relative mb-6 md:mb-7">
              <div className="flex items-stretch sm:items-center overflow-hidden gap-0 md:w-4/5 w-full">
                <div className="flex-1 flex items-center border rounded-l-md sm:rounded-l-full rounded-r-none ">
                  <Search className="ml-4 stroke-medium-light-blue-grey w-4 h-4 block" />
                  <Input
                    type="text"
                    placeholder="请输入职位名称"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 focus-visible:ring-0 shadow-none focus-visible:ring-offset-0 px-4 sm:pl-3 sm:pr-4 py-3 sm:py-4 md:py-6 rounded-full sm:rounded-none"
                  />
                </div>
                <Button
                  className="w-auto cursor-pointer text-sm sm:text-lg bg-vibrant-blue hover-none sm:hover:bg-vibrant-blue text-white px-6 py-5 md:py-6 rounded-none rounded-r-md sm:rounded-r-full border-0 disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleSearch}
                  disabled={isFetching}
                  aria-busy={isFetching}
                >
                  {isFetching ? "搜索中…" : "搜索职位"}
                </Button>
              </div>
            </div>

            <div
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex items-start sm:items-center justify-between w-full border-none sm:border-b border-muted-foreground"
            >
              <h2 className="text-lg sm:text-xl font-medium text-charcoal mb-4 sm:mb-0 pb-2">
                职位列表 ({jobs.length})
              </h2>
              <div className="flex items-start space-x-2 sm:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M12.4172 1.47656C12.6394 1.47655 12.8554 1.54984 13.0318 1.68507C13.4745 2.02451 13.5583 2.65862 13.2188 3.10134L8.99279 8.61314V15.07C8.99279 15.1894 8.96493 15.3072 8.91145 15.414L8.90231 15.4316C8.70258 15.8057 8.23749 15.947 7.86346 15.7472L5.98667 14.7451C5.52618 14.4992 5.2386 14.0196 5.2386 13.4975V8.63467L0.982016 3.10271C0.85037 2.93165 0.776991 2.72283 0.772654 2.50694L0.772461 2.48672C0.772461 1.92883 1.22473 1.47656 1.7826 1.47656H12.4172ZM15.8062 13.6792C16.0963 13.6792 16.3315 13.9144 16.3315 14.2045C16.3315 14.4905 16.103 14.7231 15.8186 14.7297L15.8062 14.7298H10.7958C10.5056 14.7298 10.2705 14.4946 10.2705 14.2045C10.2705 13.9186 10.499 13.686 10.7834 13.6794L10.7958 13.6792H15.8062ZM15.8062 10.8508C16.0963 10.8508 16.3315 11.086 16.3315 11.3761C16.3315 11.662 16.103 11.8946 15.8186 11.9012L15.8062 11.9014H10.7958C10.5056 11.9014 10.2705 11.6662 10.2705 11.3761C10.2705 11.0901 10.499 10.8575 10.7834 10.851L10.7958 10.8508H15.8062ZM15.8062 8.02237C16.0963 8.02237 16.3315 8.25755 16.3315 8.54766C16.3315 8.83362 16.103 9.06622 15.8186 9.07279L15.8062 9.07293H10.7958C10.5056 9.07293 10.2705 8.83775 10.2705 8.54766C10.2705 8.2617 10.499 8.02911 10.7834 8.02251L10.7958 8.02237H15.8062Z"
                    fill="#4E5969"
                  />
                </svg>
                <span className="leading-none">筛选</span>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-full rounded-lg border border-gray-200 p-6"
                  >
                    <div className="animate-pulse space-y-4">
                      <div className="h-6 w-1/3 rounded bg-gray-200" />
                      <div className="h-4 w-1/4 rounded bg-gray-200" />
                      <div className="space-y-2">
                        <div className="h-4 w-full rounded bg-gray-100" />
                        <div className="h-4 w-11/12 rounded bg-gray-100" />
                        <div className="h-4 w-10/12 rounded bg-gray-100" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <EmptyState
                title="暂无职位"
                message="当前暂无招聘职位，敬请关注。"
              />
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {jobs.map((job, index) => (
                  <Link
                    key={job.slug ?? job.id}
                    href={`/careers/${job.slug ?? job.id}`}
                  >
                    <div
                      className="flex flex-col items-start gap-2 sm:gap-3 lg:gap-5 border-b border-dashed sm:border-none w-full p-4 px-0 sm:p-5 lg:py-6 lg:px-0 rounded-none sm:rounded-lg cursor-pointer transition-all duration-300"
                      style={{
                        boxShadow:
                          activeJobIndex === index
                            ? "0 24px 52px -48px #1D8BF8"
                            : "",
                      }}
                      onMouseEnter={() => setActiveJobIndex(index)}
                      onClick={() => setActiveJobIndex(index)}
                    >
                      <div className="flex flex-col space-y-3 w-full">
                        <div className="flex items-center justify-between">
                          <h3
                            className={`font-bold text-xl sm:text-lg transition-colors duration-300 ${
                              activeJobIndex === index
                                ? "text-vibrant-blue"
                                : "text-charcoal"
                            }`}
                          >
                            {job.job_title}
                          </h3>
                          <div className="block sm:hidden text-xs sm:text-sm text-medium-dark-blue-grey">
                            {JOB_TYPE_LABELS[job.job_type]} |{" "}
                            {job.recruitment_post_type.name}
                          </div>
                        </div>

                        <div className="hidden sm:block text-xs sm:text-sm text-medium-dark-blue-grey">
                          {JOB_TYPE_LABELS[job.job_type]} |{" "}
                          {job.recruitment_post_type.name}
                        </div>

                        <div className="text-sm text-dark-blue-grey leading-relaxed break-words">
                          {getPreviewText(job.job_description)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && jobs.length > 0 && totalPages > 1 && (
              <div className="mt-6 md:mt-8 flex justify-center">
                <CompactPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    updateURLParams({ page });
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="bg-white w-full gap-2 overflow-auto h-full mb-20"
        >
          <SheetHeader className="pb-0">
            <SheetTitle className="text-left font-semibold text-lg text-charcoal flex items-center justify-between">
              <Link href={"/"} className="flex items-center space-x-2">
                <Image
                  src="/images/logos/logo.svg"
                  alt="象导生涯"
                  width={32}
                  height={32}
                />
                <span className="font-semibold text-lg text-charcoal">
                  象导生涯
                </span>
              </Link>
            </SheetTitle>
          </SheetHeader>
          <div
            className="space-y-4 pt-6 px-6"
            style={{
              background:
                "linear-gradient(180deg, #C1E3FF 0.02%, #E1F8FF 8.7%, #FFF 19.08%, #FFF 99.98%)",
            }}
          >
            {/* Job Category Filter */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-charcoal">
                  职位类别
                </h3>
                <Button
                  variant={"ghost"}
                  size="icon"
                  className="text-charcoal hover:text-vibrant-blue"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <XIcon className="size-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {jobCategories.map((category) => {
                  const isSelected =
                    category.id === "all"
                      ? selectedCategories.length === 0 ||
                        selectedCategories.includes("all")
                      : selectedCategories.includes(category.id);
                  return (
                    <button
                      key={category.slug}
                      onClick={() => {
                        handleCategoryChange(category.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors w-26 truncate ${
                        isSelected
                          ? "bg-vibrant-blue text-white"
                          : "bg-white text-charcoal border border-gray-200 hover:border-vibrant-blue"
                      }`}
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Job Nature Filter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-charcoal">职位性质</h3>
              <div className="grid grid-cols-3 gap-3">
                {typeOptions.map((option) => {
                  const isSelected =
                    option.value === "all"
                      ? selectedTypes.length === 0
                      : selectedTypes.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        handleTypeChange(option.value);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors w-26 truncate ${
                        isSelected
                          ? "bg-vibrant-blue text-white"
                          : "bg-white text-charcoal border border-gray-200 hover:border-vibrant-blue"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
