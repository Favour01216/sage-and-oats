import Link from 'next/link'
import { createClient } from '@/src/lib/supabase/server'
import { formatTime } from '@/src/lib/utils'

export default async function AdminRecipesPage() {
  const supabase = await createClient()
  
  const { data: recipes } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold">Manage Recipes</h1>
        <Link
          href="/admin/recipes/new"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          New Recipe
        </Link>
      </div>

      <div className="bg-surface rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-background">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recipes?.map((recipe) => (
              <tr key={recipe.id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium">{recipe.title}</div>
                    <div className="text-sm text-muted">{recipe.slug}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    recipe.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {recipe.status || 'draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted">
                  {formatTime(recipe.total_minutes || 0)}
                </td>
                <td className="px-6 py-4 text-sm text-muted">
                  {new Date(recipe.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                  <Link
                    href={`/recipe/${recipe.slug}`}
                    className="text-primary hover:text-primary/80"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/recipes/${recipe.id}/edit`}
                    className="text-primary hover:text-primary/80"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
