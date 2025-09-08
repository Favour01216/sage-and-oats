import { cn } from '@/src/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary'
  children: React.ReactNode
}

export default function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium'
  
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700',
    primary: 'bg-primary/10 text-primary border border-primary/20'
  }

  return (
    <span
      className={cn(baseClasses, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  )
}
