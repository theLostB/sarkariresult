// components/Footer.tsx
import Link from 'next/link'

interface FooterProps {
  className?: string
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={`bg-teal-800 text-white py-4 px-4 text-center text-sm ${className || ''}`}>
      <div className="container mx-auto">
        <p> {new Date().getFullYear()} Sarkari Babu. All rights reserved.</p>
        <div className="mt-2 flex justify-center space-x-4">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  )
}