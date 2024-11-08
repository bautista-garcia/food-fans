import Link from 'next/link'
import './globals.css'

export const metadata = {
  title: 'FoodReview App',
  description: 'Upload and view food reviews on a map',
}

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen flex flex-col text-black">
        <header className="bg-white shadow-sm">
          <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-semibold text-gray-800">
              FoodReview
            </Link>
            <div className="space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-800">
                Add Review
              </Link>
              <Link href="/map" className="text-gray-600 hover:text-gray-800">
                Map
              </Link>
            </div>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-8 flex-grow">
          {children}
        </main>
        <footer className="bg-white shadow-sm mt-8">
          <div className="container mx-auto px-4 py-4 text-center text-gray-600">
            © 2023 FoodReview App
          </div>
        </footer>
      </body>
    </html>
  )
}