"use client"

import type * as React from "react"
import Link from "next/link"
import { Bell, BriefcaseBusiness, FileCheck, FileText, Home, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SarkariLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
        <div className="flex flex-1 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary text-xl">
            <span className="hidden md:inline">Sarkari Babu</span>
            <span className="md:hidden">SR</span>
          </Link>
          <div className="relative hidden md:flex w-full max-w-sm items-center mx-4">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for jobs, results..."
              className="w-full rounded-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex">
              Sign In
            </Button>
            <Button size="sm">Subscribe</Button>
          </div>
        </div>
      </header>
      <main className="p-4 md:p-6">{children}</main>
      <footer className="border-t bg-muted/50 py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p> {new Date().getFullYear()} Sarkari Babu. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link href="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
