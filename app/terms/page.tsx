import Link from 'next/link'
import { Shield, Globe, Lock, Mail, FileText, Home, Edit2, Scale } from 'lucide-react'

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-t-xl p-6 text-center">
        <h1 className="text-4xl font-bold text-teal-800 mb-4 flex items-center justify-center gap-4">
          <FileText className="w-12 h-12 text-teal-600" />
          Terms of Service
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="bg-white shadow-2xl rounded-b-xl p-8 space-y-8">
        {[
          {
            icon: Shield,
            title: "1. Acceptable Use",
            content: "Our platform is dedicated to providing accurate government job and exam information. Users must use the site responsibly, ethically, and in compliance with all applicable laws."
          },
          {
            icon: Globe,
            title: "2. Content Accuracy",
            content: "While we strive to provide the most up-to-date information, users are advised to verify critical details from official government sources. We are not liable for any discrepancies."
          },
          {
            icon: Lock,
            title: "3. Data Privacy",
            content: "We respect your privacy. Personal information is handled securely and in accordance with our Privacy Policy. We do not sell or share personal data with third parties."
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

        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <div className="flex items-center mb-2">
            <Edit2 className="w-6 h-6 text-amber-600 mr-3" />
            <h3 className="text-xl font-semibold text-amber-800">Modification Rights</h3>
          </div>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Sarkari Babu reserves the right to modify these Terms of Service at any time</li>
            <li>Changes will be effective immediately upon posting on the website</li>
            <li>Continued use of the platform after changes constitutes acceptance of new terms</li>
            <li>We recommend reviewing these terms periodically for updates</li>
          </ul>
          <p className="text-sm text-gray-600 mt-3 italic">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-center mb-2">
            <Scale className="w-6 h-6 text-red-600 mr-3" />
            <h3 className="text-xl font-semibold text-red-800">Limitation of Liability</h3>
          </div>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Sarkari Babu provides information "as is" without any warranties</li>
            <li>We are not liable for any direct, indirect, incidental, or consequential damages</li>
            <li>The platform is not responsible for the accuracy of government job information</li>
            <li>Users are advised to verify all critical information from official sources</li>
            <li>Maximum liability is limited to the cost of services used, if any</li>
          </ul>
          <p className="text-sm text-red-600 mt-3 italic">
            This section is crucial for understanding our legal boundaries
          </p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <div className="flex items-center mb-2">
            <Mail className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-blue-800">Contact Us</h3>
          </div>
          <p className="text-gray-700">
            For any questions, concerns, or clarifications regarding these terms, please contact us at:
            <a 
              href="mailto:support@sarkaribabu.com" 
              className="text-blue-600 hover:underline ml-2 font-medium"
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
            href="/privacy" 
            className="border-2 border-teal-600 text-teal-600 px-6 py-3 rounded-lg hover:bg-teal-50 transition-colors inline-flex items-center justify-center gap-2 w-full sm:w-auto text-center"
          >
            <Lock className="w-5 h-5 mr-2" /> Privacy Policy
          </Link>
        </div>
      </div>

    </div>
  )
}

export const metadata = {
  title: 'Terms of Service - Sarkari Babu',
  description: 'Comprehensive Terms of Service for Sarkari Babu - Your trusted platform for government job updates',
  keywords: ['terms of service', 'sarkari babu', 'government jobs', 'legal terms']
}