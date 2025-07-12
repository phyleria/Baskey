import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Fragment } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-100 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-yellow-500 transition-colors">
            Baskey
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-4">
              {session ? (
                <Fragment>
                  <Link
                    href="/dashboard"
                    className="nav-link"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/pools/create"
                    className="btn btn-yellow"
                  >
                    + Create Pool
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="btn btn-outline-red"
                  >
                    Sign Out
                  </button>
                </Fragment>
              ) : (
                <Fragment>
                  <Link
                    href="/auth/signin"
                    className="nav-link"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="btn btn-yellow"
                  >
                    Sign Up
                  </Link>
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
