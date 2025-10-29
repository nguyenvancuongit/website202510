"use client";

import { useEffect, useMemo, useState } from "react";

import { useCaseStudies, useCaseStudyCategory } from "@/hooks/use-case-study";

import CompactPagination from "../ui/compact-pagination";
import { EmptyState } from "../ui/states";

import CaseStudyCard, { CaseStudyCardFallback } from "./case-study-card";
import CaseStudyCategoryTab from "./case-study-category-tab";

interface CaseStudyListProps {
  initialCategory?: string;
}

const CaseStudyList = ({ initialCategory = "all" }: CaseStudyListProps) => {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCaseStudyCategory();
  const { data, isLoading: isLoadingCaseStudies } = useCaseStudies({
    page: page,
    categoryId: selectedCategory === "all" ? undefined : selectedCategory,
    enabled: !isInitialLoad,
  });

  const categoryOptions = useMemo(
    () => [{ id: "all", name: "全部", slug: "all" }, ...categories],
    [categories]
  );

  useEffect(() => {
    if (!categories) return;
    const initCategory = categories.find(
      (cat) => cat.slug === initialCategory
    )?.id;
    if (!initCategory) {
      window.history.replaceState(null, "", "/case-study");
    }
    setSelectedCategory(initCategory ?? "all");
    setPage(1); // Reset to first page on category change
    setIsInitialLoad(false);
  }, [categories, initialCategory]);

  // Handle tab change with URL update using path parameters
  const handleTabChange = (categorySlug: string) => {
    const selectedCategory = categoryOptions.find(
      (cat) => cat.slug === categorySlug
    );

    setSelectedCategory(selectedCategory?.id ?? "all");
    setPage(1); // Reset to first page on category change

    // Update URL without page navigation - just update the browser's address bar
    const newUrl =
      categorySlug === "all" || !selectedCategory
        ? "/case-study"
        : `/case-study/${selectedCategory.slug}`;

    // Use window.history.replaceState to update URL without navigation
    window.history.replaceState(null, "", newUrl);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top of the case study list when page changes
    const element = document.getElementById("main-case-study-section");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen" id="main-case-study-section">
      <CaseStudyCategoryTab
        activeTab={selectedCategory}
        onTabChange={handleTabChange}
        tabs={categoryOptions}
        isLoading={isCategoriesLoading}
      />
      <div className="space-y-8">
        {data?.data && data.data.length === 0 && <EmptyState />}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {isLoadingCaseStudies ? (
            <>
              {Array.from({ length: 6 }).map((_, index) => (
                <CaseStudyCardFallback key={index} />
              ))}
            </>
          ) : (
            data?.data.map((caseStudy) => (
              <CaseStudyCard caseStudy={caseStudy} key={caseStudy.id} />
            ))
          )}
        </div>
        {data?.pagination.total_pages && data.pagination.total_pages > 1 && (
          <CompactPagination
            currentPage={page}
            onPageChange={handlePageChange}
            totalPages={data.pagination.total_pages || 1}
          />
        )}
      </div>
    </div>
  );
};

export default CaseStudyList;
