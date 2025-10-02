import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import path from 'path'
import fs from 'fs/promises'
import { notFound } from 'next/navigation'

interface CategoryPageProps {
  params: {
    category: string
  }
}

type ItemType = {
  id: string
  title: string
  date: string
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = params.category

  // Map category slug to display name and color
  const categoryMap: Record<string, { name: string; color: string }> = {
    jobs: { name: "Latest Jobs", color: "bg-teal-600" },
    "admit-cards": { name: "Admit Cards", color: "bg-purple-600" },
    results: { name: "Results", color: "bg-amber-600" },
    "answer-keys": { name: "Answer Keys", color: "bg-black" },
    "sarkari-yojana": { name: "Sarkari Yojana", color: "bg-rose-600" },
    internship: { name: "Internships", color: "bg-emerald-600" },
    "scholarship-test": { name: "Scholarship Tests", color: "bg-indigo-700" },
  }

  // Sanitize category input
  const sanitizedCategory = category
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '') // Remove any non-alphanumeric characters except hyphen
    .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens

  // If category is not in predefined list or too long, trigger 404
  if (!categoryMap[sanitizedCategory] || sanitizedCategory.length > 50) {
    notFound()
  }

  // Get category details or use defaults
  const categoryDetails = categoryMap[sanitizedCategory] || {
    name: sanitizedCategory
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    color: "bg-gray-600",
  }

  // Read data from JSON file
  const jsonPath = path.join(process.cwd(), 'public', 'data.json')
  const jsonData = await fs.readFile(jsonPath, 'utf-8')
  const data = JSON.parse(jsonData)

  // Generate items based on category with sorting
  const generateItems = (): ItemType[] => {
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

    // Sort function for items
    const sortByDate = (items: ItemType[]) => 
      items.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime())

    // Select items based on category
    let items: ItemType[] = []
    switch (sanitizedCategory) {
      case "jobs":
        items = data.jobs
        break
      case "admit-cards":
        items = data.admitCards
        break
      case "results":
        items = data.results
        break
      case "answer-keys":
        items = data.answerKeys
        break
      case "sarkari-yojana":
        items = data.sarkariYojana
        break
      case "internship":
        items = data.internships
        break
      case "scholarship-test":
        items = data.scholarshipTests
        break
      default:
        return []
    }

    // Return sorted items
    return sortByDate(items)
  }

  const items = generateItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-teal-700 text-white py-3 px-4 text-center">
        <div className="container mx-auto">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl md:text-3xl font-bold">SARKARI RESULTS</h1>
            <p className="text-sm mt-1">Latest Government Jobs, Results, Admit Cards, Answer Keys</p>
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b py-2 px-4">
        <div className="container mx-auto">
          <div className="flex items-center text-sm">
            <Link href="/" className="text-blue-600 hover:underline flex items-center">
              <ArrowLeft className="h-3 w-3 mr-1" /> Home
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium">{categoryDetails.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white border rounded-sm p-4 mb-6">
          <h1 className={"text-xl font-bold mb-4 pb-2 border-b text-teal-600"}>
           All {categoryDetails.name} 
          </h1>

          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="pb-2 border-b border-dashed last:border-0">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-600 text-xs shrink-0 w-[90px]">{item.date}</span>
                  <div className="flex items-center justify-between flex-1">
                  <Link href={`/detail/${item.id}`} className="text-blue-600 hover:underline text-sm">
                    {item.title}
                  </Link>
                    {sanitizedCategory === "jobs" && (
                      <Link
                        href={`/coaching/${encodeURIComponent(item.title)}`}
                        className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded hover:bg-blue-200 shrink-0"
                      >
                        Best Coaching
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  )
}
