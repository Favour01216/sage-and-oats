import { Metadata } from "next";
import Link from "next/link";
import { ChefHat, Search, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Recipe Not Found - Sage & Oat",
  description: "The recipe you're looking for could not be found.",
};

export default function RecipeNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <ChefHat className="mx-auto h-24 w-24 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Recipe Not Found
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn't find the recipe you're looking for. It might have
          been removed or the link might be incorrect.
        </p>

        <div className="space-y-4">
          <Link
            href="/search"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Search className="w-5 h-5 mr-2" />
            Search for Recipes
          </Link>

          <div className="text-gray-500">or</div>

          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Having trouble?</strong> Try searching for the recipe by
            name or ingredients instead.
          </p>
        </div>
      </div>
    </div>
  );
}
