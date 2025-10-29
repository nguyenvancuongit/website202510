"use client";

import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"

import ApplicationModal from "@/components/careers/application-modal"
import { Button } from "@/components/ui/button"
import {
  getJobById,
  getLatestJobs,
  JOB_TYPE_LABELS,
} from "@/services/careers.service"

export default function JobDetailContent() {
  const params = useParams();
  const jobSlug = params?.slug as string;
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  const {
    data: jobDetail,
    isLoading,
    isError,
    error,
    refetch: handleRetry,
  } = useQuery({
    queryKey: ["jobs", "detail", jobSlug],
    queryFn: () => getJobById(jobSlug),
    enabled: !!jobSlug,
  });

  const { data: latestJobs = [], isLoading: isLoadingLatest } = useQuery({
    queryKey: ["jobs", "latest", jobDetail?.id],
    queryFn: () => getLatestJobs(jobDetail?.id ?? "", 4),
    enabled: !!jobDetail,
  });

  if (isLoading) {
    return (
      <div className='min-h-screen bg-white pt-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>
          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Main Content Skeleton */}
            <div className='lg:w-4/5'>
              <div className='mb-8 border-b-none sm:border-b border-footer-text-light'>
                <div className='animate-pulse space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='h-8 w-1/3 bg-gray-200 rounded' />
                    <div className='h-10 w-28 bg-gray-200 rounded-2xl' />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="h-4 w-1/4 bg-gray-200 rounded" />
                    <div className="h-4 w-1/4 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>

              <div className="space-y-6 animate-pulse">
                <div className="h-4 w-11/12 bg-gray-100 rounded" />
                <div className="h-4 w-10/12 bg-gray-100 rounded" />
                <div className="h-4 w-9/12 bg-gray-100 rounded" />
                <div className="h-64 w-full bg-gray-100 rounded" />
                <div className="h-4 w-8/12 bg-gray-100 rounded" />
                <div className="h-4 w-7/12 bg-gray-100 rounded" />
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="px-0 md:px-4 lg:w-1/5">
              <div className="sticky top-24">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 w-24 bg-gray-200 rounded" />
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="py-4">
                      <div className="h-4 w-3/4 bg-gray-100 rounded mb-2" />
                      <div className="h-3 w-1/2 bg-gray-100 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !jobDetail) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            职位未找到
          </h2>
          <p className="text-gray-600 mb-4">您查看的职位不存在或已被删除。</p>
          {error && (
            <p className="text-sm text-red-500 mb-4">
              错误: {(error as Error).message}
            </p>
          )}
          <div className="space-x-4">
            <Button onClick={() => handleRetry()}>重试</Button>
            <Link href="/careers">
              <Button variant="outline">返回职位列表</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-[calc(100vh-70px)] h-full bg-white pt-20'>
      {/* Mobile Fixed Button */}
      <Image
        src='/images/sitemap/bg.svg'
        alt='象导生涯'
        width={100}
        height={100}
        className='sm:hidden absolute top-[80px] left-1/2 -translate-x-1/2 z-0 w-full'
      />


      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 pb-20 sm:pb-20 md:pb-8 relative z-10 h-full'>
        <div className='sm:hidden fixed bottom-[0px] flex justify-center left-0 right-0 z-50 w-full bg-white px-2 py-3'>
          <Button
            onClick={() => setIsApplicationModalOpen(true)}
            className='w-full bg-vibrant-blue hover:bg-blue-700 text-lg text-white px-8 py-3 h-12 rounded-md'
          >
            立即投递
          </Button>
        </div>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Main Content */}
          <div className="lg:w-4/5">
            {/* Job Header */}
            <div className='mb-8 border-b-none sm:border-b border-footer-text-light'>
              <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mt-6 sm:mt-0'>
                <div className='flex flex-col w-full gap-2 sm:gap-6'>
                  <div className='flex items-center justify-between'>
                    <h1 className='text-xl sm:text-3xl font-bold text-charcoal mb-2'>
                      {jobDetail.job_title}
                    </h1>
                    <Button
                      onClick={() => setIsApplicationModalOpen(true)}
                      className='hidden md:block bg-vibrant-blue hover:bg-blue-700 text-white px-8 rounded-4xl'
                    >
                      立即投递
                    </Button>
                  </div>
                  <div className='flex items-center gap-4 text-medium-light-blue-grey mb-4 justify-between'>
                    <span className='text-xs sm:text-base'>
                      {JOB_TYPE_LABELS[jobDetail.job_type] ||
                        jobDetail.job_type}{" "}
                      | {jobDetail.recruitment_post_type.name}
                    </span>
                    <div className='flex items-center gap-1'>
                      <span className='text-xs sm:text-base'>
                        发布于
                        {new Date(jobDetail.created_at).toLocaleDateString(
                          "zh-CN"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Content from API */}
            {jobDetail.job_description && (
              <div className="mb-8">
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: jobDetail.job_description,
                  }}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="px-0 md:px-4 lg:w-1/5">
            <div className="sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="hidden sm:block w-1 h-6 bg-vibrant-blue"></div>
                <h3 className="text-lg sm:text-xl font-medium sm:font-semibold text-charcoal">
                  最新职位
                </h3>
              </div>

              <div className="space-y-4">
                {isLoadingLatest ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-vibrant-blue"></div>
                  </div>
                ) : (
                  latestJobs.map((job) => (
                    <Link
                      key={job.slug ?? job.id}
                      href={`/careers/${job.slug}`}
                      className="flex flex-row justify-between items-center border-b border-dashed sm:border-none sm:flex-col cursor-pointer sm:py-4 py-2 group"
                    >
                      <h4 className="text-lg sm:text-base font-bold text-dark-blue-grey mb-2 group-hover:text-vibrant-blue">
                        {job.job_title}
                      </h4>
                      <p className="text-xs sm:text-sm text-medium-dark-blue-grey">
                        {JOB_TYPE_LABELS[job.job_type]} |{" "}
                        {job.recruitment_post_type.name}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        jobTitle={jobDetail.job_title}
        jobId={jobDetail.id}
        onSuccess={() => {
          toast.success("职位申请成功，页面跳转中…")
        }}
        onError={(err) => {
          toast.error("提交失败，请重试", {
            description: err.message,
          });
        }}
      />
    </div>
  );
}
