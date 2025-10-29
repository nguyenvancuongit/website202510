import Image from "next/image"
import Link from "next/link"

import { formatDateISO, getImageSrc } from "@/lib/utils"
import type { LatestNewsItem } from "@/services/latest-news.service"

export default function NewsListItem({
  item,
  href,
}: {
  item: LatestNewsItem
  href: string
}) {
  return (
    <Link
      href={href}
      className='block'
    >
      <div className='group flex not-even:gap-4 md:gap-6 bg-white rounded-2xl transition-shadow hover:shadow-[0_24px_20px_-20px_rgba(164,173,221,0.25)]'>
        <div className='w-1/3 md:w-80 h-24 md:h-48 flex-shrink-0 relative overflow-hidden rounded-[2px] sm:rounded-md'>
          <Image
            src={getImageSrc(item.web_thumbnail)}
            alt={item.title}
            fill
            loading='lazy'
            className='object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105'
          />
        </div>
        <div className='flex flex-col justify-center md:justify-between gap-4 md:gap-0 md:px-0 pb-0'>
          <div>
            <h3 className='text-sm md:text-xl font-semibold text-charcoal mb-0 md:mb-3 line-clamp-2'>
              {item.title}
            </h3>
            {item.description && (
              <p
                className='text-sm hidden md:block md:text-base text-gray-600 line-clamp-3 md:line-clamp-none'
                dangerouslySetInnerHTML={{ __html: item.description }}
              ></p>
            )}
          </div>
          <div className='text-xs md:text-sm text-medium-dark-blue-grey md:mt-0'>
            <span className='hidden md:inline'>发布时间：</span>
            {formatDateISO(item.published_date)}
          </div>
        </div>
      </div>
    </Link>
  )
}
