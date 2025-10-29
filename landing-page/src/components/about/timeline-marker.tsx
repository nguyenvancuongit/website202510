interface TimelineMarkerProps {
  delay: number
  zIndex?: number
  isVisible?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function TimelineMarker({
  delay,
  zIndex = 10,
  isVisible = true,
  className,
  style,
}: TimelineMarkerProps) {
  return (
    <div
      className={`absolute top-1/2 left-1/2 rounded-full ${className}`}
      style={{
        ...style,
        opacity: 0,
        transform: "translate(-50%, -0.75rem) scale(0.75)",
        animationName: isVisible ? "fadeInScale" : "none",
        animationDuration: isVisible ? "300ms" : "0ms",
        animationTimingFunction: isVisible ? "ease-out" : "ease",
        animationFillMode: isVisible ? "forwards" : "none",
        animationDelay: isVisible ? `${delay}ms` : "0ms",
        zIndex,
      }}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='25'
        viewBox='0 0 24 25'
        fill='none'
      >
        <circle
          cx='12'
          cy='12.5'
          r='11.5'
          stroke='#1D8BF8'
          fill='white'
        />
        <circle
          cx='12'
          cy='12.5'
          r='5.75'
          fill='#1D8BF8'
          stroke='#1D8BF8'
          strokeWidth='0.5'
        />
      </svg>
    </div>
  )
}
