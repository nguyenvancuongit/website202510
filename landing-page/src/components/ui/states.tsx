import React from "react"

interface ActionButton {
  label: string
  onClick?: () => void
  href?: string
  variant?: "primary" | "secondary"
}

interface BaseStateProps {
  title?: string
  message?: string
  details?: string
  actions?: ActionButton[]
}

export function ErrorState({ title = "加载失败", message = "无法加载数据，请稍后重试", details, actions = [] }: BaseStateProps) {
  return (
    <div className='text-center py-12'>
      <div className='text-red-500 text-lg mb-2'>{title}</div>
      <p className='text-gray-600 mb-3'>{message}</p>
      {details && <p className='text-sm text-red-500 mb-4'>{details}</p>}
      <div className='flex items-center justify-center gap-3 flex-wrap'>
        {actions.map((a, idx) =>
          a.href ? (
            <a
              key={idx}
              href={a.href}
              className={a.variant === "secondary" ? "px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors" : "px-6 py-2 bg-vibrant-blue text-white rounded-lg hover:bg-blue-600 transition-colors"}
            >
              {a.label}
            </a>
          ) : (
            <button
              key={idx}
              onClick={a.onClick}
              className={a.variant === "secondary" ? "px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors" : "px-6 py-2 bg-vibrant-blue text-white rounded-lg hover:bg-blue-600 transition-colors"}
            >
              {a.label}
            </button>
          ),
        )}
      </div>
    </div>
  )
}

export function EmptyState({ title = "暂无数据", message = "当前没有可显示的内容", actions = [] }: BaseStateProps) {
  return (
    <div className='text-center py-12'>
      <div className='text-gray-500 text-lg mb-2'>{title}</div>
      <p className='text-gray-600 mb-4'>{message}</p>
      <div className='flex items-center justify-center gap-3 flex-wrap'>
        {actions.map((a, idx) =>
          a.href ? (
            <a
              key={idx}
              href={a.href}
              className={a.variant === "secondary" ? "px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors" : "px-6 py-2 bg-vibrant-blue text-white rounded-lg hover:bg-blue-600 transition-colors"}
            >
              {a.label}
            </a>
          ) : (
            <button
              key={idx}
              onClick={a.onClick}
              className={a.variant === "secondary" ? "px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors" : "px-6 py-2 bg-vibrant-blue text-white rounded-lg hover:bg-blue-600 transition-colors"}
            >
              {a.label}
            </button>
          ),
        )}
      </div>
    </div>
  )
}
