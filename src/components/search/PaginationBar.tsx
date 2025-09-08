'use client'

import { Pagination } from 'react-instantsearch'

export default function PaginationBar() {
  return (
    <div className="flex justify-center">
      <Pagination
        classNames={{
          root: 'flex gap-2',
          list: 'flex gap-2',
          item: '',
          link: 'px-4 py-2 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg text-text dark:text-text-dark hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
          selectedItem: 'bg-primary text-white border-primary hover:bg-primary/90',
          disabledItem: 'opacity-50 cursor-not-allowed',
        }}
      />
    </div>
  )
}
