import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          {/* Left: Site name and tagline */}
          <div>
            <h3 className="mb-1 font-serif text-lg font-semibold text-primary">Sage & Oat</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mindful recipes for nourishing meals
            </p>
          </div>

          {/* Right: Links */}
          <nav className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <Link
              href="/about"
              className="rounded px-1 py-1 text-sm text-gray-600 transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:text-gray-400 dark:hover:text-primary"
            >
              About
            </Link>
            <Link
              href="/legal/nutrition-disclaimer"
              className="rounded px-1 py-1 text-sm text-gray-600 transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:text-gray-400 dark:hover:text-primary"
            >
              Nutrition Disclaimer
            </Link>
          </nav>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-800">
          <p className="text-center text-xs text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} Sage & Oat. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
