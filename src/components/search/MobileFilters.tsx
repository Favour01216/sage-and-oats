'use client'

import { useState } from 'react'
import { X, Filter } from 'lucide-react'
import FacetsSidebar from './FacetsSidebar'

export default function MobileFilters() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <Filter className="w-4 h-4" />
        Filters
      </button>

      {/* Mobile Filters Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-background dark:bg-background-dark shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border dark:border-border-dark">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted/10 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto h-full">
              <FacetsSidebar />
            </div>
            
            <div className="p-4 border-t border-border dark:border-border-dark">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
