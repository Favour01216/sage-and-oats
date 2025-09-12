import Link from "next/link";
import { createClient } from "@/src/lib/supabase/server";
import { formatTime } from "@/src/lib/utils";

export default async function AdminRecipesPage() {
  const supabase = await createClient();

  const { data: recipes } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">Manage Recipes</h1>
        <Link
          href="/admin/recipes/new"
          className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          New Recipe
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg bg-surface shadow">
        <table className="w-full">
          <thead className="bg-background">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recipes?.map(recipe => (
              <tr key={recipe.id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium">{recipe.title}</div>
                    <div className="text-sm text-muted">{recipe.slug}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      recipe.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {recipe.status || "draft"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted">
                  {formatTime(recipe.total_minutes || 0)}
                </td>
                <td className="px-6 py-4 text-sm text-muted">
                  {new Date(recipe.created_at).toLocaleDateString()}
                </td>
                <td className="space-x-2 px-6 py-4 text-right text-sm font-medium">
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
  );
}
