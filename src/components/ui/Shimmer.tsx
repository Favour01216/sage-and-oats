import { cn } from '@/src/lib/utils'

interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export default function Shimmer({ className, children, ...props }: ShimmerProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Skeleton components for common use cases
export function SkeletonText({ lines = 1, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      <Shimmer className="aspect-[4/3] w-full rounded-2xl" />
      <div className="space-y-2">
        <Shimmer className="h-5 w-3/4" />
        <Shimmer className="h-4 w-1/2" />
      </div>
    </div>
  )
}
