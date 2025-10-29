export default function NewsListSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className='flex gap-6 bg-white rounded-lg'>
          <div className='w-80 h-48 bg-gray-200 rounded-lg flex-shrink-0'></div>
          <div className='flex-1 space-y-3'>
            <div className='h-6 bg-gray-200 rounded w-3/4'></div>
            <div className='space-y-2'>
              <div className='h-4 bg-gray-200 rounded'></div>
              <div className='h-4 bg-gray-200 rounded w-5/6'></div>
              <div className='h-4 bg-gray-200 rounded w-4/6'></div>
            </div>
            <div className='h-4 bg-gray-200 rounded w-24'></div>
          </div>
        </div>
      ))}
    </>
  )
}
