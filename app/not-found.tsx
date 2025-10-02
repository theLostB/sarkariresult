import Link from 'next/link'
import { HomeIcon, SearchIcon, BriefcaseIcon } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFCE6] px-4 py-12">
      <div className="max-w-xl w-full text-center">
        <div className="relative">
          <h1 className="text-9xl font-extrabold text-teal-700/10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
            404
          </h1>
          <h2 className="text-4xl font-bold text-teal-700 relative z-10 mb-4">
            Page Not Found
          </h2>
        </div>
        
        <p className="text-gray-600 text-lg mb-8">
          Oops! The page you are looking for seems to have wandered off into the government job wilderness.
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Link 
            href="/" 
            className="flex flex-col items-center justify-center p-4 border-2 border-teal-600 rounded-lg hover:bg-teal-50 transition-colors group"
          >
            <HomeIcon className="w-8 h-8 text-teal-600 group-hover:text-teal-700 mb-2" />
            <span className="text-teal-600 group-hover:text-teal-700">Home</span>
          </Link>
          
          <Link 
            href="/" 
            className="flex flex-col items-center justify-center p-4 border-2 border-teal-600 rounded-lg hover:bg-teal-50 transition-colors group"
          >
            <SearchIcon className="w-8 h-8 text-teal-600 group-hover:text-teal-700 mb-2" />
            <span className="text-teal-600 group-hover:text-teal-700">Search</span>
          </Link>
          
          <Link 
            href="/jobs" 
            className="flex flex-col items-center justify-center p-4 border-2 border-teal-600 rounded-lg hover:bg-teal-50 transition-colors group"
          >
            <BriefcaseIcon className="w-8 h-8 text-teal-600 group-hover:text-teal-700 mb-2" />
            <span className="text-teal-600 group-hover:text-teal-700">Jobs</span>
          </Link>
        </div>
        
        <div className="bg-teal-100 border-l-4 border-teal-500 p-4 rounded-r-lg text-teal-900">
          <p className="text-sm">
            Tip: Check the URL for typos or return to our homepage to explore latest government job opportunities and many more things.
          </p>
        </div>
      </div>
    </div>
  )
}