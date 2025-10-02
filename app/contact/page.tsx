import Link from 'next/link'
import { Home, Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react'

export default function ContactUs() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-t-xl p-6 text-center">
        <h1 className="text-4xl font-bold text-teal-800 mb-4 flex items-center justify-center gap-4">
          <MessageCircle className="w-12 h-12 text-teal-600" />
          Contact Us
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We're here to help! Reach out to us for any queries, support, or feedback.
        </p>
      </div>

      <div className="bg-white shadow-2xl rounded-b-xl p-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: Mail,
              title: "Email Support",
              content: "support@sarkaribabu.com",
              description: "Our support team responds within 24-48 hours"
            },
            {
              icon: Phone,
              title: "Phone Support",
              content: "+91 9876 543 210",
              description: "Available Monday-Saturday, 9 AM to 6 PM"
            }
          ].map(({ icon: Icon, title, content, description }, index) => (
            <a 
              href={
                title === "Email Support" ? `mailto:${content}` : 
                title === "Phone Support" ? `tel:${content.replace(/\s+/g, '')}` : 
                undefined
              }
              key={index} 
              className={`
                border-l-4 border-teal-600 
                pl-4 
                hover:bg-teal-50 
                transition-colors 
                group 
                py-4 
                rounded-r-md
                cursor-pointer
                ${title === "Email Support" ? 'hover:border-teal-800' : 
                  title === "Phone Support" ? 'hover:border-teal-800' : ''}
              `}
            >
              <div className="flex items-center mb-3">
                <Icon className="w-8 h-8 text-teal-600 mr-4 group-hover:scale-110 transition-transform" />
                <h2 className="text-2xl font-semibold text-teal-800">{title}</h2>
              </div>
              <p className="text-gray-700 font-medium">{content}</p>
              <p className="text-sm text-gray-500">{description}</p>
            </a>
          ))}
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg hover:bg-blue-100 transition-colors cursor-pointer hover:bg-teal-50 
                transition-colors 
                group 
                py-4 
                rounded-r-md
                cursor-pointer">
          <div className="flex items-center mb-2">
            <MapPin className="w-9 h-9 text-teal-600 mr-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold text-blue-800">Our Address</h3>
          </div>
          <a 
            href="https://www.google.com/maps/search/?api=1&query=New+Delhi+Government+Information+Center" 
            target="_blank" 
            rel="noopener noreferrer"
            className="
              block 
              text-gray-700 
              p-2 
              rounded-lg 
              transition-colors 
              cursor-pointer
            "
          >
            Sarkari Babu Headquarters<br />
            123, Government Information Center<br />
            New Delhi, India - 110001
          </a>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg hover:bg-green-100 transition-colors cursor-pointer hover:border-green-800 hover:shadow-md">
          <div className="flex items-center mb-2">
            <Send className="w-6 h-6 text-green-600 mr-3" />
            <h3 className="text-xl font-semibold text-green-800">Send Us a Message</h3>
          </div>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-teal-800 mb-2">Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  id="name" 
                  className="
                    block w-full px-4 py-3 
                    border border-teal-300 
                    rounded-lg 
                    text-teal-900 
                    placeholder-teal-500 
                    focus:outline-none 
                    focus:ring-2 focus:ring-teal-500 
                    focus:border-transparent 
                    transition-all duration-300 
                    shadow-sm
                    hover:border-teal-500
                  "
                  placeholder="Enter your full name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-teal-800 mb-2">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  id="email" 
                  className="
                    block w-full px-4 py-3 
                    border border-teal-300 
                    rounded-lg 
                    text-teal-900 
                    placeholder-teal-500 
                    focus:outline-none 
                    focus:ring-2 focus:ring-teal-500 
                    focus:border-transparent 
                    transition-all duration-300 
                    shadow-sm
                    hover:border-teal-500
                  "
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-teal-800 mb-2">Message</label>
              <textarea 
                id="message" 
                rows={4} 
                className="
                  block w-full px-4 py-3 
                  border border-teal-300 
                  rounded-lg 
                  text-teal-900 
                  placeholder-teal-500 
                  focus:outline-none 
                  focus:ring-2 focus:ring-teal-500 
                  focus:border-transparent 
                  transition-all duration-300 
                  shadow-sm
                  hover:border-teal-500
                  resize-y
                "
                placeholder="Write your message here..."
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="
                w-full 
                bg-teal-600 
                text-white 
                py-3 
                rounded-lg 
                hover:bg-teal-700 
                transition-colors 
                duration-300 
                ease-in-out 
                shadow-md 
                hover:shadow-lg 
                focus:outline-none 
                focus:ring-2 
                focus:ring-teal-500 
                focus:ring-opacity-50
              "
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="text-center mt-8 space-x-4">
          <Link 
            href="/" 
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors inline-flex items-center gap-2"
          >
            <Home className="w-5 h-5" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Contact Us - Sarkari Babu',
  description: 'Get in touch with Sarkari Babu for support, queries, and feedback',
  keywords: ['contact us', 'support', 'sarkari babu', 'customer service']
}