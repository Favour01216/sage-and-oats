import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nutrition Disclaimer - Sage & Oat",
  description:
    "Important information about nutrition data accuracy and limitations in our recipes.",
};

export default function NutritionDisclaimerPage() {
  return (
    <div className="bg-oat min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
          <h1 className="mb-6 font-serif text-3xl font-bold text-gray-900 dark:text-gray-100">
            Nutrition Disclaimer
          </h1>

          <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
            <p className="mb-4">
              The nutrition information provided on Sage & Oat is for informational purposes only
              and should not be considered as medical or dietary advice.
            </p>

            <h2 className="mb-4 mt-8 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Data Sources & Accuracy
            </h2>
            <p className="mb-4">
              Nutrition data is sourced from the Edamam Nutrition API and represents estimates based
              on standard ingredient databases. These values are:
            </p>
            <ul className="mb-6 list-disc pl-6">
              <li>Approximate and may vary based on actual ingredients used</li>
              <li>Calculated per serving as specified in each recipe</li>
              <li>Based on raw ingredients and may not account for cooking methods</li>
              <li>Subject to variation based on ingredient brands and preparation methods</li>
            </ul>

            <h2 className="mb-4 mt-8 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Important Limitations
            </h2>
            <p className="mb-4">Please note that:</p>
            <ul className="mb-6 list-disc pl-6">
              <li>Actual nutrition values may differ from estimates</li>
              <li>Portion sizes and serving counts are approximate</li>
              <li>Nutrition data does not account for dietary restrictions or allergies</li>
              <li>Values are rounded and may not be precise</li>
            </ul>

            <h2 className="mb-4 mt-8 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Medical & Dietary Advice
            </h2>
            <p className="mb-4">
              If you have specific dietary requirements, food allergies, or medical conditions:
            </p>
            <ul className="mb-6 list-disc pl-6">
              <li>Consult with a healthcare professional or registered dietitian</li>
              <li>Carefully review all ingredients before preparation</li>
              <li>Consider your individual nutritional needs</li>
              <li>Verify nutrition information with official sources when necessary</li>
            </ul>

            <h2 className="mb-4 mt-8 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Updates & Changes
            </h2>
            <p className="mb-6">
              Nutrition information may be updated periodically as ingredient databases are revised.
              We strive to provide accurate information but cannot guarantee the completeness or
              accuracy of nutrition data.
            </p>

            <div className="mt-8 border-l-4 border-blue-400 bg-blue-50 p-4 dark:bg-blue-900/20">
              <p className="text-blue-800 dark:text-blue-200">
                <strong>Disclaimer:</strong> This information is provided &quot;as is&quot; without
                any warranties. Sage & Oat is not responsible for any decisions made based on this
                nutrition information.
              </p>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
              <Link
                href="/"
                className="font-medium text-primary transition-colors hover:text-primary/80"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
