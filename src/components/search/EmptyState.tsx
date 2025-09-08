'use client'

import { ClearRefinements } from 'react-instantsearch'
import { useInstantSearch } from 'react-instantsearch'

export default function EmptyState() {
  const { results } = useInstantSearch()
  
  // Only show when there are no results
  if (results?.nbHits !== 0) {
    return null
  }

  const popularTags = [
    { name: 'vegan', label: 'Vegan' },
    { name: 'gluten-free', label: 'Gluten-Free' },
    { name: '30-minute', label: '30-Minute' },
    { name: 'high-protein', label: 'High-Protein' },
    { name: 'dinner', label: 'Dinner' },
    { name: 'dessert', label: 'Dessert' },
  ]

  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-2">
          No recipes match your filters
        </h3>
        <p className="text-muted dark:text-muted-dark mb-6">
          Try adjusting your search or browse popular categories
        </p>
        
        <div className="space-y-4">
          <ClearRefinements
            classNames={{
              root: 'block',
              button: 'px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
            }}
          />
          
          <div>
            <p className="text-sm text-muted dark:text-muted-dark mb-3">
              Popular categories:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {popularTags.map((tag) => (
                <button
                  key={tag.name}
                  className="px-3 py-1 text-sm bg-muted/10 dark:bg-muted-dark/10 text-text dark:text-text-dark rounded-full hover:bg-muted/20 dark:hover:bg-muted-dark/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  onClick={() => {
                    // This would need to be implemented with proper Algolia state management
                    console.log('Quick filter:', tag.name)
                  }}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
