import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import data from "@/public/data.json"

// Define types for data items
interface Item {
  id: string
  title: string
  date: string
  category?: string
}

// Define the props type for the page component
type CategoryPageProps = {
  params: {
    name: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { name } = params

  // Format the category name for display
  const displayName = name
    .split("-")
    .map((word) =>
      word === "upsc" || word === "ssc" || word === "ibps" || word === "rrb" || word === "uppsc" || word === "upsssc" || word === "psu"
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ")

  // Get all items from data.json that have category field
  const allItems: Item[] = [
    ...data.jobs,
    ...data.admitCards,
    ...data.results,
    ...data.answerKeys
  ]

  // Slugify/normalize function for category
  function normalizeCategory(str: string) {
    return str
      .toLowerCase()
      .replace(/%20/g, ' ')
      .replace(/[.]/g, '') // Remove dots
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ') // Collapse multiple spaces
      .trim();
  }

  // Format category name for comparison
  const searchCategory = normalizeCategory(name);
  // console.log("Search category:", searchCategory)

  // Filter items based on category name (case-insensitive)
  const categoryItems = allItems.filter((item) => {
    if (!item.category) {
      // console.log("Item without category:", item)
      return false;
    }
    const itemCategory = normalizeCategory(item.category);
    // console.log("Comparing:", itemCategory, "with", searchCategory)
    return itemCategory === searchCategory;
  });

  // console.log("Found items:", categoryItems)

  // Sort items by date
  const sortedItems = categoryItems.sort((a, b) => {
    const dateA = new Date(a.date.split("-").reverse().join("-"))
    const dateB = new Date(b.date.split("-").reverse().join("-"))
    return dateB.getTime() - dateA.getTime()
  })

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
            <span className="font-medium">{displayName}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white border rounded-sm p-4 mb-6 overflow-x-hidden">
          <h1 className="text-xl font-bold mb-4 pb-2 border-b text-teal-700">
            {displayName} Jobs, Results, Admit Cards, Answer Keys 
          </h1>

          {sortedItems.length > 0 ? (
            <ul className="space-y-3">
              {sortedItems.map((item) => (
                <li key={item.id} className="pb-2 border-b border-dashed last:border-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                    <span className="text-gray-600 text-xs">{item.date}</span>
                    <div className="flex items-center gap-2">
                      <Link href={`/detail/${item.id}`} className="text-blue-600 hover:underline text-sm">
                        {item.title}
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">No items found for {displayName}</p>
          )}
        </div>
      </div>


    </div>
  )
}
