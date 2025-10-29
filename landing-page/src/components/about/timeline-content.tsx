interface TimelineContentProps {
  date: string
  text: string
  delay: number
  direction: "left" | "right"
  isVisible?: boolean
}

export default function TimelineContent({
  date,
  text,
  delay,
  direction,
  isVisible = true,
}: TimelineContentProps) {
  const isLeft = direction === "left"

  return (
    <div
      className={`absolute top-1/2 min-w-[250px] w-fit xl:w-[412px] flex justify-center items-center z-30 ${isLeft ? "right-[200px]" : "left-[200px]"
        }`}
      style={{
        opacity: 0,
        transform: `translateY(-50%) translateX(${isLeft ? "-16px" : "16px"})`,
        animationName: isVisible ? (isLeft ? "slideInLeft" : "slideInRight") : "none",
        animationDuration: isVisible ? "500ms" : "0ms",
        animationTimingFunction: isVisible ? "ease-out" : "ease",
        animationFillMode: isVisible ? "forwards" : "none",
        animationDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      <div className='bg-light-blue-bg w-full px-8 pt-3 pb-4 rounded-lg border border-light-blue-border shadow-sm'>
        <div className='text-vibrant-blue-hover font-bold text-xl mb-2'>{date}</div>
        <p className='text-dark-blue-grey text-base'>{text}</p>
      </div>
    </div>
  )
}
