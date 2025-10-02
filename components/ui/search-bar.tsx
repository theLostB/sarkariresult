import React, { useRef, useState, useEffect } from "react"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  value?: string
}

export function SearchBar({
  onSearch,
  placeholder = "Search for jobs, admit cards, results...",
  value = "",
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleClear = () => {
    setInputValue("")
    onSearch("")
    inputRef.current?.focus()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    onSearch(e.target.value)
  }

  const focusInput = () => {
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full">
      {/* Search Icon Clickable */}
      <div
        onClick={focusInput}
        role="button"
        tabIndex={0}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600 cursor-pointer"
      >
        <Search className="h-4 w-4" />
      </div>

      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        className="w-full h-12 pl-10 pr-10 rounded-md border-0 bg-white text-gray-900 placeholder:text-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
      />

      {/* Clear Button */}
      {inputValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
