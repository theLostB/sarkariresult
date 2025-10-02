'use client';

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface DetailContentProps {
  detail: {
    title: string;
    type?: string;
    date?: string;
  }
}

export function DetailContent({ detail }: DetailContentProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#2F7A6D] text-white relative">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-white hover:text-gray-200 flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
            <Link href="/jobs" className="text-white hover:text-gray-200 flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Latest Jobs
            </Link>
          </div>
          <h1 className="text-2xl font-bold">{detail.title}</h1>
        </div>
      </header>

      {/* Rest of the code ... */}
    </div>
  )
}