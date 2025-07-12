// pages/index.js
import Layout from '../components/Layout'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="text-center">
            <div className="mb-8">
            </div>
            
            <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-6 tracking-tight">
              Birthday Pool
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Create birthday gift pools with friends and family. Pool your money together to give amazing birthday gifts.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
              {session ? (
                <>
                  <Link
                    href="/pools/create"
                    className="bg-gray-900 text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-gray-800 transition-colors duration-200"
                  >
                    Create a Pool
                  </Link>
                  <Link
                    href="/dashboard"
                    className="bg-white text-gray-900 px-8 py-3 rounded-lg text-base font-medium border border-gray-300 hover:border-gray-400 transition-colors duration-200"
                  >
                    View Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signup"
                    className="bg-gray-900 text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-gray-800 transition-colors duration-200"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/auth/signin"
                    className="bg-white text-gray-900 px-8 py-3 rounded-lg text-base font-medium border border-gray-300 hover:border-gray-400 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}