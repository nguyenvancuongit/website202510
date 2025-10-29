import React from "react"

import { Card, CardContent } from "@/components/ui/card"

interface NewsCardFallbackProps {
  variant?: "list" | "grid"
  items?: number
  showTitle?: boolean
}

export function NewsCardFallback({ variant = "list", items, showTitle }: NewsCardFallbackProps) {
  const numItems = items || (variant === "list" ? 6 : 3)

  if (variant === "grid") {
    return (
      <div className='space-y-16'>
        {Array.from({ length: numItems }).map((_, sectionIdx) => (
          <div key={sectionIdx} className='space-y-6'>
            {showTitle && <div className='h-7 w-40 bg-gray-200 rounded' />}
            <div className='grid grid-cols-2 md:grid-cols-3 md:gap-6 gap-4'>
              {Array.from({ length: numItems }).map((_, cardIdx) => (
                <Card
                  key={cardIdx}
                  className='overflow-hidden animate-pulse py-0 md:rounded-3xl rounded-sm shadow-none h-full border border-gray-200'
                >
                  <div className='md:w-full md:h-48 h-20 bg-gray-200'></div>
                  <CardContent className='px-4 pb-4 md:pt-4 pt-0'>
                    <div className='h-4 bg-gray-200 rounded mb-2 w-20'></div>
                    <div className='space-y-2'>
                      <div className='h-4 bg-gray-200 rounded'></div>
                      <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='md:space-y-20 space-y-5'>
      {Array.from({ length: numItems }).map((_, i) => (
        <div
          key={i}
          className='flex md:gap-6 gap-4 bg-white rounded-lg animate-pulse'
        >
          <div className='w-1/3 md:w-80 md:h-48sm:w-80 h-20 sm:h-48 bg-gray-200 rounded-lg flex-shrink-0'></div>
          <div className='flex-1 space-y-3 flex flex-col justify-between'>
            <div className='h-6 bg-gray-200 rounded w-3/4'></div>
            <div className='space-y-2 hidden md:block'>
              <div className='h-4 bg-gray-200 rounded'></div>
              <div className='h-4 bg-gray-200 rounded w-5/6'></div>
              <div className='h-4 bg-gray-200 rounded w-4/6'></div>
            </div>
            <div className='h-4 bg-gray-200 rounded w-24'></div>
          </div>
        </div>
      ))}
    </div>
  )
}
