import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Preloader from "@/components/preloader"
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sarkari Babu - Latest Government Jobs & Results",
  description: "Your one-stop destination for the latest government job notifications, exam results, admit cards, and sarkari yojana updates.",
  creator: 'Rishaank Gupta',
  keywords: ['sarkari job', 'government jobs', 'sarkari result', 'exam admit card', 'rojgar', 'sarkari yojana', 'latest govt jobs', 'job alerts'],
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  themeColor: '#008080',
  viewport: 'width=device-width, initial-scale=1.0',
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Sarkari Babu - Latest Government Jobs & Results',
    description: 'Your one-stop destination for the latest government job notifications, exam results, admit cards, and sarkari yojana updates.',
    url: 'https://yourdomain.com',
    siteName: 'Sarkari Babu',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sarkari Babu Preview',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sarkari Babu - Latest Government Jobs, Results, Admit Cards, Answer Keys, Internships, Scholarships.',
    description: 'Stay updated with latest sarkari job alerts and results.',
    images: ['/og-image.png'],
    creator: '@the_lost_boy_231',
  },
  alternates: {
    canonical: 'https://yourdomain.com',
    languages: {
      'en-IN': 'https://yourdomain.com/en-IN',
      'hi-IN': 'https://yourdomain.com/hi-IN',
    },
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className={`${inter.className} overflow-x-hidden min-h-screen flex flex-col`}>
        <Preloader />
        <main className="flex-grow">{children}</main>
        <Footer className="flex-shrink-0" />
      </body>
    </html>
  )
}