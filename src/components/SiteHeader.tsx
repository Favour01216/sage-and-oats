"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <a
        href="#content"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-white focus:not-sr-only focus:absolute focus:left-2 focus:top-2"
      >
        Skip to content
      </a>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="rounded font-serif text-2xl font-semibold text-primary transition-colors hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Sage & Oat
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            <Link
              href="/search"
              className="rounded px-2 py-1 text-gray-700 transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:text-gray-300 dark:hover:text-primary"
            >
              Recipes
            </Link>
            <Link
              href="/collections"
              className="rounded px-2 py-1 text-gray-700 transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:text-gray-300 dark:hover:text-primary"
            >
              My Collection
            </Link>
            <Link
              href="/about"
              className="rounded px-2 py-1 text-gray-700 transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:text-gray-300 dark:hover:text-primary"
            >
              About
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-md p-2 text-gray-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:hidden dark:text-gray-300"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden dark:border-gray-800">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/search"
                className="rounded px-2 py-1 text-gray-700 transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:text-gray-300 dark:hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Recipes
              </Link>
              <Link
                href="/collections"
                className="rounded px-2 py-1 text-gray-700 transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:text-gray-300 dark:hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                My Collection
              </Link>
              <Link
                href="/about"
                className="rounded px-2 py-1 text-gray-700 transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:text-gray-300 dark:hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
