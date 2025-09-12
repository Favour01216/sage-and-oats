/**
 * Nutrition calculation utilities
 * Single source of truth for nutrition data
 */

export interface NutritionData {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  cholesterol?: number;
  saturatedFat?: number;
  transFat?: number;
}

export interface NutritionPerServing {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
  saturatedFat: number;
  transFat: number;
}

/**
 * Calculate nutrition per serving from total nutrition
 * @param totalNutrition - Total nutrition for entire recipe
 * @param servings - Number of servings
 * @returns Nutrition per serving
 */
export function calculatePerServing(
  totalNutrition: NutritionData,
  servings: number,
): NutritionPerServing {
  // Ensure servings is at least 1
  const validServings = Math.max(1, servings);

  return {
    calories: Math.round((totalNutrition.calories || 0) / validServings),
    protein: Math.round(((totalNutrition.protein || 0) / validServings) * 10) / 10,
    carbs: Math.round(((totalNutrition.carbs || 0) / validServings) * 10) / 10,
    fat: Math.round(((totalNutrition.fat || 0) / validServings) * 10) / 10,
    fiber: Math.round(((totalNutrition.fiber || 0) / validServings) * 10) / 10,
    sugar: Math.round(((totalNutrition.sugar || 0) / validServings) * 10) / 10,
    sodium: Math.round((totalNutrition.sodium || 0) / validServings),
    cholesterol: Math.round((totalNutrition.cholesterol || 0) / validServings),
    saturatedFat: Math.round(((totalNutrition.saturatedFat || 0) / validServings) * 10) / 10,
    transFat: Math.round(((totalNutrition.transFat || 0) / validServings) * 10) / 10,
  };
}

/**
 * Scale nutrition data by a factor
 * Used when changing servings
 * @param nutrition - Original nutrition data
 * @param scaleFactor - Scaling factor
 * @returns Scaled nutrition data
 */
export function scaleNutrition(nutrition: NutritionData, scaleFactor: number): NutritionData {
  return {
    calories: nutrition.calories ? nutrition.calories * scaleFactor : undefined,
    protein: nutrition.protein ? nutrition.protein * scaleFactor : undefined,
    carbs: nutrition.carbs ? nutrition.carbs * scaleFactor : undefined,
    fat: nutrition.fat ? nutrition.fat * scaleFactor : undefined,
    fiber: nutrition.fiber ? nutrition.fiber * scaleFactor : undefined,
    sugar: nutrition.sugar ? nutrition.sugar * scaleFactor : undefined,
    sodium: nutrition.sodium ? nutrition.sodium * scaleFactor : undefined,
    cholesterol: nutrition.cholesterol ? nutrition.cholesterol * scaleFactor : undefined,
    saturatedFat: nutrition.saturatedFat ? nutrition.saturatedFat * scaleFactor : undefined,
    transFat: nutrition.transFat ? nutrition.transFat * scaleFactor : undefined,
  };
}

/**
 * Format nutrition value for display
 * @param value - Nutrition value
 * @param unit - Unit to append
 * @param precision - Number of decimal places
 * @returns Formatted string
 */
export function formatNutritionValue(
  value: number | undefined,
  unit: string = "",
  precision: number = 1,
): string {
  if (value === undefined || value === null) {
    return "—";
  }

  // Round to specified precision
  const rounded =
    precision === 0
      ? Math.round(value)
      : Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);

  // Format with unit
  return unit ? `${rounded}${unit}` : rounded.toString();
}

/**
 * Calculate daily value percentage
 * Based on FDA 2000 calorie diet reference
 * @param value - Nutrient value
 * @param nutrient - Nutrient name
 * @returns Percentage of daily value
 */
export function calculateDailyValue(value: number, nutrient: keyof NutritionData): number {
  const dailyValues: Record<keyof NutritionData, number> = {
    calories: 2000,
    protein: 50,
    carbs: 275,
    fat: 78,
    fiber: 28,
    sugar: 50,
    sodium: 2300,
    cholesterol: 300,
    saturatedFat: 20,
    transFat: 0, // No daily value for trans fat
  };

  const dv = dailyValues[nutrient];
  if (!dv || dv === 0) {
    return 0;
  }

  return Math.round((value / dv) * 100);
}

/**
 * Get nutrition from recipe data
 * Handles various formats from different APIs
 * @param recipeData - Raw recipe data
 * @returns Normalized nutrition data
 */
export function extractNutrition(recipeData: any): NutritionData {
  // Check for nutrition in various formats
  if (recipeData.nutrition) {
    return normalizeNutrition(recipeData.nutrition);
  }

  if (recipeData.nutritionInfo) {
    return normalizeNutrition(recipeData.nutritionInfo);
  }

  if (recipeData.nutrients) {
    return normalizeNutrition(recipeData.nutrients);
  }

  // Check for individual fields
  const nutrition: NutritionData = {};

  if (recipeData.calories !== undefined) {
    nutrition.calories = recipeData.calories;
  }
  if (recipeData.protein !== undefined) {
    nutrition.protein = recipeData.protein;
  }
  if (recipeData.carbohydrates !== undefined || recipeData.carbs !== undefined) {
    nutrition.carbs = recipeData.carbohydrates || recipeData.carbs;
  }
  if (recipeData.fat !== undefined) {
    nutrition.fat = recipeData.fat;
  }
  if (recipeData.fiber !== undefined) {
    nutrition.fiber = recipeData.fiber;
  }
  if (recipeData.sugar !== undefined) {
    nutrition.sugar = recipeData.sugar;
  }
  if (recipeData.sodium !== undefined) {
    nutrition.sodium = recipeData.sodium;
  }

  return nutrition;
}

/**
 * Normalize nutrition data from various formats
 * @param data - Raw nutrition data
 * @returns Normalized nutrition data
 */
function normalizeNutrition(data: any): NutritionData {
  const nutrition: NutritionData = {};

  // Handle array format (Spoonacular style)
  if (Array.isArray(data)) {
    for (const nutrient of data) {
      const name = nutrient.name?.toLowerCase() || nutrient.title?.toLowerCase();
      const amount = nutrient.amount || nutrient.value;

      if (name?.includes("calor")) {
        nutrition.calories = amount;
      } else if (name?.includes("protein")) {
        nutrition.protein = amount;
      } else if (name?.includes("carb")) {
        nutrition.carbs = amount;
      } else if (
        name?.includes("fat") &&
        !name?.includes("saturated") &&
        !name?.includes("trans")
      ) {
        nutrition.fat = amount;
      } else if (name?.includes("fiber")) {
        nutrition.fiber = amount;
      } else if (name?.includes("sugar")) {
        nutrition.sugar = amount;
      } else if (name?.includes("sodium")) {
        nutrition.sodium = amount;
      } else if (name?.includes("cholesterol")) {
        nutrition.cholesterol = amount;
      } else if (name?.includes("saturated")) {
        nutrition.saturatedFat = amount;
      } else if (name?.includes("trans")) {
        nutrition.transFat = amount;
      }
    }
  } else if (typeof data === "object") {
    // Handle object format
    nutrition.calories = data.calories || data.kcal || data.energy;
    nutrition.protein = data.protein || data.proteinContent;
    nutrition.carbs = data.carbs || data.carbohydrates || data.carbohydrateContent;
    nutrition.fat = data.fat || data.totalFat || data.fatContent;
    nutrition.fiber = data.fiber || data.dietaryFiber || data.fiberContent;
    nutrition.sugar = data.sugar || data.sugars || data.sugarContent;
    nutrition.sodium = data.sodium || data.sodiumContent;
    nutrition.cholesterol = data.cholesterol || data.cholesterolContent;
    nutrition.saturatedFat = data.saturatedFat || data.saturatedFatContent;
    nutrition.transFat = data.transFat || data.transFatContent;
  }

  return nutrition;
}
