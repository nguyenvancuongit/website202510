"use client"

import * as React from "react"
import { CheckIcon, ChevronDown } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface ComboboxProps {
  options: string[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "请选择或输入",
  disabled = false,
  className,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(value || "")
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Update input value when value prop changes
  React.useEffect(() => {
    setInputValue(value || "")
  }, [value])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onValueChange?.(newValue)
    setIsOpen(true)
  }

  // Handle option selection
  const handleOptionSelect = (option: string) => {
    setInputValue(option)
    onValueChange?.(option)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  // Filter options based on input
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  )

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={cn("relative h-10", className)} ref={dropdownRef}>
      <div className="relative h-full">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
          placeholder={placeholder}
          className="bg-white border-[#d9d9d9] pr-8 h-full data-[placeholder]:text-muted-foreground"
        />
        <ChevronDown
          className={cn(
            "absolute right-3 top-1/2 transform -translate-y-1/2 size-4 opacity-25 transition-transform pointer-events-none shrink-0",
            isOpen && "rotate-180",
          )}
        />
      </div>

      {isOpen && !disabled && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 rounded-md border shadow-md max-h-60 overflow-y-auto p-1">
          {filteredOptions.map((option) => (
            <div
              key={option}
              onClick={() => handleOptionSelect(option)}
              className={cn(
                "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground",
                inputValue === option && "bg-accent text-accent-foreground"
              )}
            >
              <span className="absolute right-2 flex size-3.5 items-center justify-center">
                {inputValue === option && <CheckIcon className="opacity-25" />}
              </span>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}