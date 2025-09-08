import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Left: Site name and tagline */}
          <div>
            <h3 className="text-lg font-serif font-semibold text-primary mb-1">
              Sage & Oat
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mindful recipes for nourishing meals
            </p>
          </div>

          {/* Right: Links */}
          <nav className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Link 
              href="/about" 
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1 py-1"
            >
              About
            </Link>
            <Link 
              href="/legal/nutrition-disclaimer" 
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1 py-1"
            >
              Nutrition Disclaimer
            </Link>
          </nav>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
            © {new Date().getFullYear()} Sage & Oat. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
