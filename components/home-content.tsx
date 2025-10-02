'use client';

import Link from "next/link"
import { useState, useMemo, useEffect } from "react"
import { SearchBar } from "@/components/ui/search-bar"
import { useRouter } from "next/navigation"
import { NotificationPermissionModal } from "@/components/notification-permission-modal";

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array(Array.from(rawData, char => char.charCodeAt(0)));
}

interface SearchResult {
  id: string
  title: string
  category: string
  date: string
  matchCount: number
}

interface Item {
  id: string
  title: string
  date: string
  lastDate?: string
  category?: string
  isNew?: boolean
}

interface Data {
  latestUpdates: Item[]
  jobs: Item[]
  admitCards: Item[]
  results: Item[]
  answerKeys: Item[]
  sarkariYojana: Item[]
  internships: Item[]
  scholarshipTests: Item[]
}

const categories = [
  { name: "Latest Jobs/Exams", slug: "jobs", color: "bg-teal-600 hover:bg-teal-700" },
  { name: "Admit Cards", slug: "admit-cards", color: "bg-purple-600 hover:bg-purple-700" },
  { name: "Results", slug: "results", color: "bg-amber-600 hover:bg-amber-700" },
  { name: "Answer Keys", slug: "answer-keys", color: "bg-blue-600 hover:bg-blue-700" },
  { name: "Sarkari Yojana", slug: "sarkari-yojana", color: "bg-rose-600 hover:bg-rose-700" },
]

export function HomeContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [data, setData] = useState<Data | null>(null)
  const [quote, setQuote] = useState({ content: "", author: "" })
  const [isLoadingQuote, setIsLoadingQuote] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showContent, setShowContent] = useState(false)
  

  // Dynamic Notice Slider
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0)
  const [isSlideOut, setIsSlideOut] = useState(false)
  
  // Important Notice Slider: Get latest 3 jobs, 2 internships, 2 scholarship tests
  const noticeItems = useMemo(() => {
    if (!data) return [];
    const jobs = (data.jobs || []).slice(0, 3).map(item => ({ ...item, category: 'Jobs' }));
    const internships = (data.internships || []).slice(0, 2).map(item => ({ ...item, category: 'Internships' }));
    const scholarshipTests = (data.scholarshipTests || []).slice(0, 2).map(item => ({ ...item, category: 'Scholarship Tests' }));
    return [...jobs, ...internships, ...scholarshipTests];
  }, [data]);

  // validNotices ab ek flat list hai
  const validNotices = noticeItems;

  // Auto-cycle through notices
  useEffect(() => {
    if (validNotices.length > 1) {
      const timer = setInterval(() => {
        setIsSlideOut(true)
        setTimeout(() => {
          setCurrentNoticeIndex((prevIndex) => 
            (prevIndex + 1) % validNotices.length
          )
          setIsSlideOut(false)
        }, 500)
      }, 5000) // Change notice every 5 seconds

      return () => clearInterval(timer)
    }
  }, [validNotices.length])

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const notifFlag = localStorage.getItem('sarkari_notif_permission');
      if (!notifFlag) {
        setTimeout(() => setShowNotifModal(true), 1200);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data.json")
        const jsonData = await response.json()
        
        // Function to convert DD-MM-YYYY to Date object with error handling
        const parseDate = (dateString: string) => {
          try {
            const [day, month, year] = dateString.split('-').map(Number)
            return new Date(year, month - 1, day)
          } catch (error) {
            console.error(`Invalid date format: ${dateString}`)
            return new Date(0) // Return epoch start for invalid dates
          }
        }

        // Sort each category by date in descending order with fallback
        const sortByDate = (items: any[]) => 
          items.sort((a, b) => {
            const dateA = parseDate(a.date)
            const dateB = parseDate(b.date)
            return dateB.getTime() - dateA.getTime()
          })

        // Apply sorting to all categories
        const categoriesToSort = [
          'jobs', 
          'admitCards', 
          'results', 
          'answerKeys', 
          'sarkariYojana', 
          'latestUpdates',
          'internships',
          'scholarshipTests'
        ]

        categoriesToSort.forEach(category => {
          if (jsonData[category] && Array.isArray(jsonData[category])) {
            jsonData[category] = sortByDate(jsonData[category])
          }
        })

        setData(jsonData)
      } catch (error) {
        console.error("Error fetching or sorting data:", error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    // Wait for data to be loaded
    if (data) {
      // Add a small delay to ensure preloader is completely gone
      const timer = setTimeout(() => {
        setMounted(true)
        // Add another small delay before showing content
        setTimeout(() => setShowContent(true), 300)
      }, 1)
      
      return () => clearTimeout(timer)
    }
  }, [data])

  useEffect(() => {
    const defaultQuote = {
      content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    };

    const fetchQuote = async () => {
      try {
        setIsLoadingQuote(true);
        const response = await fetch("https://quotes-api-self.vercel.app/quote");
        
        if (!response.ok) {
          throw new Error('Failed to fetch quote');
        }
        
        const data = await response.json();
        // Check if quote is too long (more than 100 characters)
        if (data.quote.length > 100) {
          setQuote(defaultQuote);
        } else {
          setQuote({
            content: data.quote,
            author: data.author
          });
        }
      } catch (error) {
        console.error('Error fetching quote:', error);
        setQuote(defaultQuote);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    fetchQuote();
  }, [])

  const latestUpdates = useMemo(() => {
    if (!data) return []

    // Function to parse DD-MM-YYYY date
    const parseDate = (dateString: string) => {
      try {
        const [day, month, year] = dateString.split('-').map(Number)
        return new Date(year, month - 1, day)
      } catch (error) {
        console.error(`Invalid date format: ${dateString}`)
        return new Date(0) // Return epoch start for invalid dates
      }
    }

    // Collect first items from each category
    const latestItems = [
      data.jobs[0],
      data.admitCards[0],
      data.results[0],
      data.internships[0],
      data.scholarshipTests[0]
    ].filter(Boolean) // Remove any undefined items

    // Sort these items by date
    const sortedItems = latestItems
      .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime())
      .slice(0, 5) // Take top 5 items

    // Add 'isNew' flag to top 3 items
    return sortedItems.map((item, index) => ({
      ...item,
      isNew: index < 5
    }))
  }, [data])

  // Combine all items into one searchable array
  const allItems = useMemo(() => {
    if (!data) return []

    return [
      ...data.jobs,
      ...data.admitCards,
      ...data.results,
      ...data.answerKeys,
      ...data.sarkariYojana,
    ]
  }, [data])

  // Search and rank results
  const calculateMatchScore = (title: string, query: string) => {
    const normalizedTitle = title.toLowerCase()
    const normalizedQuery = query.toLowerCase()
    const queryWords = normalizedQuery.split(/\s+/)

    let score = 0

    // Exact phrase match
    if (normalizedTitle.includes(normalizedQuery)) {
      score += 100
    }

    // All words match
    if (queryWords.every(word => normalizedTitle.includes(word))) {
      score += 50
    }

    // Individual word matches
    score += queryWords.reduce((total, word) => 
      normalizedTitle.includes(word) ? total + 10 : total, 0)

    return score
  }

  const searchResults = useMemo(() => {
    if (!data || !searchQuery) return []

    // Normalize search query by removing extra spaces and converting to lowercase
    const normalizedQuery = searchQuery.trim().toLowerCase()

    // Split query into words for more flexible matching
    const queryWords = normalizedQuery.split(/\s+/)

    return allItems
      .filter((item) => {
        const normalizedTitle = item.title.toLowerCase()
        
        // Two matching strategies:
        // 1. Match ALL individual words
        const allWordsMatch = queryWords.every(word => 
          normalizedTitle.includes(word)
        )

        // 2. Match complete phrase
        const completePhaseMatch = normalizedTitle.includes(normalizedQuery)

        // Return true if either strategy matches
        return allWordsMatch || completePhaseMatch
      })
      .sort((a, b) => {
        // Prioritize results based on matching strategy
        const scoreA = calculateMatchScore(a.title, normalizedQuery)
        const scoreB = calculateMatchScore(b.title, normalizedQuery)
        return scoreB - scoreA || new Date(b.date).getTime() - new Date(a.date).getTime()
      })
      .slice(0, 10)
  }, [data, searchQuery, allItems])

  const handleAllowNotifications = async () => {
    setShowNotifModal(false);
    localStorage.setItem('sarkari_notif_permission', 'asked');
    if ('Notification' in window && navigator.serviceWorker) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY;
        if (!vapidKey) {
          alert('Notification setup error: VAPID key missing.');
          return;
        }
        const reg = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready; // Add this line!
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey)
        });
        await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sub),
        });
        localStorage.setItem('sarkari_notif_permission', 'granted');
      }
    }
  };
  const handleDenyNotifications = () => {
    setShowNotifModal(false);
    localStorage.setItem('sarkari_notif_permission', 'denied');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    const query = typeof e === 'string' ? e : e.target.value
    setSearchQuery(query)
    setShowResults(!!query)
  }

  const handleCloseResults = () => {
    setShowResults(false)
    setSearchQuery("")
  }

  if (!data) {
    return null
  }

  return (
    
    <div 
      className={`min-h-screen bg-gray-50 transition-all duration-1000 ease-in-out ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${showContent ? 'block' : 'hidden'}`}
    >
      <NotificationPermissionModal
  open={showNotifModal}
  onAllow={handleAllowNotifications}
  onDeny={handleDenyNotifications}
/>
      {/* Header */}
      <header className="bg-[#2F7A6D] text-white relative">
        <div className="container mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl font-bold mb-1">SARKARI BABU</h1>
          <p className="text-sm mb-4">Latest Government Jobs/Exams, Results, Admit Cards, Answer Keys</p>
          <h2 className="text-2xl font-semibold mb-8">Find Latest Government Jobs/Exams & Results</h2>
          <div className="max-w-2xl mx-auto mb-6 relative">
            <SearchBar onSearch={handleSearch} value={searchQuery} />
            
            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute w-full mt-2 bg-white rounded-md shadow-lg border border-gray-200 z-50 text-left">
                {searchResults.length > 0 ? (
                  <ul className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-white scrollbar-thumb-teal-600 scrollbar-thumb-rounded-lg hover:scrollbar-thumb-teal-700 transition-all duration-300 ease-in-out">
                    {searchResults.map((result) => (
                      <li key={result.id} className="border-b last:border-b-0">
                        <Link
                          href={`/detail/${result.id}`}
                          className="block p-3 hover:bg-gray-50"
                          onClick={handleCloseResults}
                        >
                          <div className="text-sm font-medium text-blue-600">{result.title}</div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                            {result.category && (
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                {result.category.replace('%20', ' ').split('-').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </span>
                            )}
                            <span>{result.date}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No results found 🔍 Try a different search term
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Important Notice Slider */}
      {validNotices.length > 0 && (
        <div className="bg-[#FFFCE6] border-y border-[#FFF5C2] py-2 px-4 text-center text-sm relative overflow-hidden">
          <div className="container mx-auto flex items-center justify-center">
            <div className="mr-2">
              {validNotices.length > 1 && (
                <button 
                  onClick={() => setCurrentNoticeIndex((prevIndex) => 
                    (prevIndex - 1 + validNotices.length) % validNotices.length
                  )}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ←
                </button>
              )}
            </div>
            
            <div 
              key={currentNoticeIndex} 
              className="flex-grow transition-all duration-700 ease-out transform"
              style={{
                opacity: isSlideOut ? 0 : 1,
                transform: isSlideOut 
                  ? 'translateX(-50px)' 
                  : 'translateX(0)',
                animation: !isSlideOut 
                  ? 'fadeInSlideRight 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards' 
                  : 'fadeOutSlideLeft 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards'
              }}
            >
              <strong>Important Notice:</strong>{' '}
              <span className="font-semibold text-gray-700">[{validNotices[currentNoticeIndex].category}]</span>{' '}
              <Link 
                href={`/detail/${validNotices[currentNoticeIndex].id}`} 
                className="underline hover:font-medium"
              >
                {validNotices[currentNoticeIndex].title}
              </Link>{' '}
              notification has been released. 
              Last date to apply is {validNotices[currentNoticeIndex].lastDate || validNotices[currentNoticeIndex].date}.
            </div>
            
            <div className="ml-2">
              {validNotices.length > 1 && (
                <button 
                  onClick={() => setCurrentNoticeIndex((prevIndex) => 
                    (prevIndex + 1) % validNotices.length
                  )}
                  className="text-gray-600 hover:text-gray-800"
                >
                  →
                </button>
              )}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-3 pb-0.5 mt-2">
            {validNotices.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentNoticeIndex(index)}
                className={`h-1 w-1 rounded-full ${
                  index === currentNoticeIndex ? 'bg-black' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Custom CSS for animation */}
          <style jsx>{`
            @keyframes fadeInSlideRight {
              0% {
                opacity: 0;
                transform: translateX(50px);
              }
              100% {
                opacity: 1;
                transform: translateX(0);
              }
            }

            @keyframes fadeOutSlideLeft {
              0% {
                opacity: 1;
                transform: translateX(0);
              }
              100% {
                opacity: 0;
                transform: translateX(-50px);
              }
            }
          `}</style>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="container mx-auto px-4 py-2 mb-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          <Link href="/jobs" className="bg-teal-600 text-white py-2 px-4 rounded text-center hover:bg-teal-700 text-sm font-medium">
            Latest Jobs/Exams
          </Link>
          <Link href="/admit-cards" className="bg-purple-600 text-white py-2.5 px-4 rounded text-center hover:bg-purple-700 text-sm font-medium">
            Admit Cards
          </Link>
          <Link href="/results" className="bg-amber-600 text-white py-2.5 px-4 rounded text-center hover:bg-amber-700 text-sm font-medium">
            Results
          </Link>
          <Link href="/answer-keys" className="bg-blue-600 text-white py-2.5 px-4 rounded text-center hover:bg-blue-700 text-sm font-medium">
            Answer Keys
          </Link>
          <Link href="/sarkari-yojana" className="bg-rose-600 text-white py-2.5 px-4 rounded text-center hover:bg-rose-700 text-sm font-medium">
            Sarkari Yojana
          </Link>
          <Link href="/internship" className="bg-emerald-600 text-white py-2.5 px-4 rounded text-center hover:bg-emerald-700 text-sm font-medium">
            Internships
          </Link>
          <Link href="/scholarship-test" className="bg-indigo-700 text-white py-2.5 px-4 rounded text-center hover:bg-indigo-800 text-sm font-medium">
            Scholarship Tests
            </Link>
                        </div>
                      </div>

      {/* Latest Updates */}
      <div className="container mx-auto px-4 pt-1">
        <div className="bg-white border rounded-sm p-3 mb-4">
          <div className="bg-teal-600 -mx-3 -mt-3 px-3 py-2 mb-3">
            <h2 className="text-lg font-bold text-white text-center">Latest Updates</h2>
          </div>
          <div className="flex flex-col md:flex-row">
  <ul className="space-y-2 flex-1">
    {latestUpdates.map((update) => (
      <li key={update.id} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
        <span className="text-gray-600 text-sm">{update.date}</span>
        <Link 
          href={`/detail/${update.id}`} 
          className="text-blue-600 no-underline text-base max-md:truncate-block"
        >
          <span className="hover:underline">{update.title}</span>
          {update.isNew && <span className="bg-red-500 text-white text-xs px-1 rounded ml-1">New</span>}
        </Link>
      </li>
    ))}
  </ul>

  {/* QUOTE BOX */}
  <div className="mt-4 md:mt-0 md:ml-8 md:w-[400px]">
    <div className="border-l-4 border-teal-600 pl-4 bg-[#F8F9FA] p-4">
      {isLoadingQuote ? (
        <div className="flex items-center justify-center h-[88px]">
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      ) : (
        <>
          <p style={{ fontFamily: "Georgia, serif" }} className="text-gray-800 italic mb-2 text-lg leading-relaxed text-center md:text-left">"{quote.content}"</p>
          <p className="text-gray-600 text-base text-center md:text-right">- {quote.author}</p>
        </>
      )}
    </div>
  </div>
</div>

        </div>
                  </div>

      {/* Main Content - Three Column Layout */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Latest Jobs Column */}
          <div className="bg-white border rounded-sm">
            <h2
              id="latest-jobs"
              className="text-white bg-teal-600 py-2 px-3 text-center font-medium"
            >
              Latest Jobs/Exams
            </h2>
            <ul className="p-3 space-y-2">
              {data.jobs.slice(0, 25).map((job) => (
                <li
                  key={job.id}
                  className="pb-2 border-b border-dashed last:border-0 flex items-center gap-3"
                >
                  <span className="text-gray-600 text-xs shrink-0 w-[90px]">
                    {job.date}
                  </span>
                  <Link
                    href={`/detail/${job.id}`}
                    className="text-blue-600 hover:underline text-sm truncate"
                  >
                    {job.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="bg-gray-100 p-2 text-center">
              <Link
                href="/jobs"
                className="text-blue-600 hover:underline text-sm inline-flex items-center"
              >
                View All Jobs/Exams →
              </Link>
                  </div>
                </div>

          {/* Middle Column - Admit Cards & Answer Keys & Internships */}
          <div className="bg-white border rounded-sm">
            {/* Admit Cards Section */}
            <div>
            <h2 id="admit-cards" className="text-white bg-purple-600 py-2 px-3 text-center font-medium">
              Admit Cards
            </h2>
            <ul className="p-3 space-y-2">
                {data.admitCards.slice(0, 10).map((job) => (
                  <li key={job.id} className="pb-2 border-b border-dashed last:border-0 flex items-center gap-3">
                    <span className="text-gray-600 text-xs shrink-0 w-[90px]">{job.date}</span>
                    <Link href={`/detail/${job.id}`} className="text-blue-600 hover:underline text-sm truncate">
                    {job.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="bg-gray-100 p-2 text-center">
              <Link href="/admit-cards" className="text-blue-600 hover:underline text-sm inline-flex items-center">
                  View All Cards →
                </Link>
              </div>
            </div>

            {/* Answer Keys Section */}
            <div className="border-t">
              <h2 id="answer-keys" className="text-white bg-blue-600 py-2 px-3 text-center font-medium">
                Answer Keys
              </h2>
              <ul className="p-3 space-y-2">
                {data.answerKeys.slice(0, 5).map((job) => (
                  <li key={job.id} className="pb-2 border-b border-dashed last:border-0 flex items-center gap-3">
                    <span className="text-gray-600 text-xs shrink-0 w-[90px]">{job.date}</span>
                    <Link href={`/detail/${job.id}`} className="text-blue-600 hover:underline text-sm truncate">
                      {job.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="bg-gray-100 p-2 text-center">
                <Link href="/answer-keys" className="text-blue-600 hover:underline text-sm inline-flex items-center">
                  View All Keys →
              </Link>
                  </div>
                </div>

            {/* Internships Section */}
            <div className="border-t">
              <h2 id="internships" className="text-white bg-emerald-600 py-2 px-3 text-center font-medium">
                Internships
              </h2>
              <ul className="p-3 space-y-2">
                {data.internships.slice(0, 5).map((job) => (
                  <li key={job.id} className="pb-2 border-b border-dashed last:border-0 flex items-center gap-3">
                    <span className="text-gray-600 text-xs shrink-0 w-[90px]">{job.date}</span>
                    <Link href={`/detail/${job.id}`} className="text-blue-600 hover:underline text-sm truncate">
                      {job.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="bg-gray-100 p-2 text-center">
                <Link href="/internship" className="text-blue-600 hover:underline text-sm inline-flex items-center">
                  View All Internships →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Results & Sarkari Yojana & Scholarship Tests */}
          <div className="bg-white border rounded-sm">
            {/* Results Section */}
            <div>
            <h2 id="results" className="text-white bg-amber-600 py-2 px-3 text-center font-medium">
              Results
            </h2>
            <ul className="p-3 space-y-2">
                {data.results.slice(0, 10).map((result) => (
                  <li key={result.id} className="pb-2 border-b border-dashed last:border-0 flex items-center gap-3">
                    <span className="text-gray-600 text-xs shrink-0 w-[90px]">{result.date}</span>
                    <Link href={`/detail/${result.id}`} className="text-blue-600 hover:underline text-sm truncate">
                      {result.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="bg-gray-100 p-2 text-center">
              <Link href="/results" className="text-blue-600 hover:underline text-sm inline-flex items-center">
                  View All Results →
                </Link>
              </div>
            </div>

            {/* Sarkari Yojana Section */}
            <div className="border-t">
              <h2 id="sarkari-yojana" className="text-white bg-rose-600 py-2 px-3 text-center font-medium">
                Sarkari Yojana
              </h2>
              <ul className="p-3 space-y-2">
                {data.sarkariYojana.slice(0, 5).map((scheme) => (
                  <li key={scheme.id} className="pb-2 border-b border-dashed last:border-0 flex items-center gap-3">
                    <span className="text-gray-600 text-xs shrink-0 w-[90px]">{scheme.date}</span>
                    <Link href={`/detail/${scheme.id}`} className="text-blue-600 hover:underline text-sm truncate">
                      {scheme.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="bg-gray-100 p-2 text-center">
                <Link href="/sarkari-yojana" className="text-blue-600 hover:underline text-sm inline-flex items-center">
                  View All Schemes →
              </Link>
              </div>
            </div>

            {/* Scholarship Tests Section */}
            <div className="border-t">
              <h2 id="scholarship-tests" className="text-white bg-indigo-700 py-2 px-3 text-center font-medium">
                Scholarship Tests
              </h2>
              <ul className="p-3 space-y-2">
                {data.scholarshipTests.slice(0, 5).map((test) => (
                  <li key={test.id} className="pb-2 border-b border-dashed last:border-0 flex items-center gap-3">
                    <span className="text-gray-600 text-xs shrink-0 w-[90px]">{test.date}</span>
                    <Link href={`/detail/${test.id}`} className="text-blue-600 hover:underline text-sm truncate">
                      {test.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="bg-gray-100 p-2 text-center">
                <Link href="/scholarship-test" className="text-blue-600 hover:underline text-sm inline-flex items-center">
                  View All Tests →
                </Link>
              </div>
                </div>
              </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="container mx-auto px-4 pb-8">
        <div className="bg-white border rounded-sm p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-teal-700">Quick Links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {[
              "UPSC",
              "SSC",
              "Railway",
              "Banking",
              "Defence",
              "Teaching",
              "State Govt.",
              "Police",
              "Engineering",
              "Medical",
              "UPSSSC",
              "UPPSC",
              "Central Govt.",
              "Agriculture",
              "Judiciary",
              "PSU",
              "Post Office",
              "Institutions",
            ].map((link, index) => (
              <Link
                key={index}
                href={`/category/${link === 'State Govt.' ? 'state-gov' : link.toLowerCase().replace(/\./g, '').replace(/ /g, '-').replace(/-{2,}/g, '-')}`}
                className="bg-gray-100 hover:bg-gray-200 text-center py-2 px-1 rounded text-sm border"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  )
}