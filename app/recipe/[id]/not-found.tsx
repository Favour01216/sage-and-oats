import { Metadata } from "next";
import Link from "next/link";
import { ChefHat, Search, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Recipe Not Found - Sage & Oat",
  description: "The recipe you're looking for could not be found.",
};

export default function RecipeNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <ChefHat className="mx-auto h-24 w-24 text-green-600" />
        </div>

        <h1 className="mb-4 text-3xl font-bold text-gray-900">Recipe Not Found</h1>

        <p className="mb-8 text-lg text-gray-600">
          Sorry, we couldn't find the recipe you're looking for. It might have been removed or the
          link might be incorrect.
        </p>

        <div className="space-y-4">
          <Link
            href="/search"
            className="inline-flex items-center rounded-lg bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700"
          >
            <Search className="mr-2 h-5 w-5" />
            Search for Recipes
          </Link>

          <div className="text-gray-500">or</div>

          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-green-600 px-6 py-3 text-green-600 transition-colors hover:bg-green-50"
          >
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </Link>
        </div>

        <div className="mt-8 rounded-lg bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            <strong>Having trouble?</strong> Try searching for the recipe by name or ingredients
            instead.
          </p>
        </div>
      </div>
    </div>
  );
}
