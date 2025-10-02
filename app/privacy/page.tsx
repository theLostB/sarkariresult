import Link from 'next/link'
import { Shield, Lock, Database, Eye, UserCheck, Mail, Home, FileText, Edit2 } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-t-xl p-6 text-center">
        <h1 className="text-4xl font-bold text-teal-800 mb-4 flex items-center justify-center gap-4">
          <Lock className="w-12 h-12 text-teal-600" />
          Privacy Policy
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="bg-white shadow-2xl rounded-b-xl p-8 space-y-8">
        {[
          {
            icon: Shield,
            title: "1. Information We Collect",
            content: "We collect minimal personal information necessary for providing job and exam updates. This may include email for notifications, browsing data for personalization."
          },
          {
            icon: Database,
            title: "2. Data Usage",
            content: "Your data is used solely to enhance user experience, provide relevant job updates, and improve our platform's functionality. We never sell or share personal data with third parties."
          },
          {
            icon: Eye,
            title: "3. Data Transparency",
            content: "We believe in complete transparency. You can request to view, modify, or delete your personal information at any time by contacting our support team."
          }
        ].map(({ icon: Icon, title, content }, index) => (
          <div 
            key={index} 
            className="border-l-4 border-teal-600 pl-4 hover:bg-teal-50 transition-colors group py-1 rounded-r-md"
          >
            <div className="flex items-center mb-3">
              <Icon className="w-8 h-8 text-teal-600 mr-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-semibold text-teal-800">{title}</h2>
            </div>
            <p className="text-gray-700">{content}</p>
          </div>
        ))}

<div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mt-8">
          <div className="flex items-center mb-2">
            <Edit2 className="w-6 h-6 text-amber-600 mr-3" />
            <h3 className="text-xl font-semibold text-amber-800">Modification Rights</h3>
          </div>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Sarkari Babu reserves the right to modify this Privacy Policy at any time</li>
            <li>Changes will be effective immediately upon posting on the website</li>
            <li>Continued use of the platform after changes constitutes acceptance of new privacy terms</li>
            <li>We recommend reviewing this policy periodically for updates</li>
          </ul>
          <p className="text-sm text-gray-600 mt-3 italic">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
          <div className="flex items-center mb-2">
            <UserCheck className="w-6 h-6 text-green-600 mr-3" />
            <h3 className="text-xl font-semibold text-green-800">Your Rights</h3>
          </div>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Right to access your personal data</li>
            <li>Right to request data deletion</li>
            <li>Right to opt-out of marketing communications</li>
          </ul>
        </div>

        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
          <div className="flex items-center mb-2">
            <Mail className="w-6 h-6 text-indigo-600 mr-3" />
            <h3 className="text-xl font-semibold text-indigo-800">Contact for Privacy Concerns</h3>
          </div>
          <p className="text-gray-700">
            For any privacy-related queries or requests, contact us at:
            <a 
              href="mailto:support@sarkaribabu.com" 
              className="text-indigo-600 hover:underline ml-2 font-medium"
            >
              support@sarkaribabu.com
            </a>
          </p>
        </div>

        <div className="text-center mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link 
            href="/" 
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors inline-flex items-center justify-center gap-2 w-full sm:w-auto text-center"
          >
            <Home className="w-5 h-5 mr-2" /> Back to Home
          </Link>
          <Link 
            href="/terms" 
            className="border-2 border-teal-600 text-teal-600 px-6 py-3 rounded-lg hover:bg-teal-50 transition-colors inline-flex items-center justify-center gap-2 w-full sm:w-auto text-center"
          >
            <FileText className="w-5 h-5 mr-2" /> Terms of Service
          </Link>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Privacy Policy - Sarkari Babu',
  description: 'Comprehensive Privacy Policy for Sarkari Babu - Protecting your data and ensuring transparency',
  keywords: ['privacy policy', 'data protection', 'sarkari babu', 'user rights']
}