import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import path from "path"
import fs from "fs/promises"

interface CoachingInstitute {
  name: string
  url: string
}

interface CoachingData {
  [key: string]: CoachingInstitute[]
}

export default async function CoachingPage({ params }: { params: { jobId: string } }) {
  // Decode the job title from URL
  const jobTitle = decodeURIComponent(params.jobId)

  // Read coaching data from JSON file
  const jsonPath = path.join(process.cwd(), 'public', 'coachingInstitutes.json')
  const jsonData = await fs.readFile(jsonPath, 'utf-8')
  const coachingData: CoachingData = JSON.parse(jsonData)

  // Find matching coaching institutes
  const institutes = coachingData[jobTitle] || []

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-700 text-white py-3 px-4 text-center">
        <div className="container mx-auto">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl md:text-3xl font-bold">SARKARI RESULTS</h1>
            <p className="text-sm mt-1">Latest Government Jobs, Results, Admit Cards</p>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <Link href="/jobs" className="text-blue-600 hover:underline flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Jobs
          </Link>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-xl font-bold mb-6">Best Coaching Institutes for {jobTitle}</h1>
            
            {institutes.length > 0 ? (
              <div className="space-y-4">
                {institutes.map((institute, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <Link 
                      href={institute.url}
                      target="_blank"
                      className="text-blue-600 hover:underline font-medium text-lg py-2 flex items-center"
                    >
                      {institute.name}
                      <ExternalLink className="h-4 w-4 ml-2 inline-block" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p className="text-gray-500">No coaching institutes found for this exam.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 