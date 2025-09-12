import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-surface">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="font-serif text-xl font-bold text-primary">
                Admin
              </Link>
              <Link href="/admin/recipes" className="text-muted hover:text-text">
                Recipes
              </Link>
              <Link href="/admin/recipes/new" className="text-muted hover:text-text">
                New Recipe
              </Link>
            </div>
            <Link href="/" className="text-sm text-muted hover:text-text">
              View Site →
            </Link>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
