/**
 * Comprehensive unit conversion system for cooking
 * 
 * This system provides conversions between US and metric units,
 * including density-based conversions for common ingredients.
 */

export type UnitSystem = 'us' | 'metric';
export type UnitType = 'volume' | 'weight' | 'temperature' | 'length';

// Volume conversions (US to ml)
const VOLUME_CONVERSIONS: Record<string, number> = {
  // Teaspoons and tablespoons
  'tsp': 4.929,
  'teaspoon': 4.929,
  'teaspoons': 4.929,
  'tbsp': 14.787,
  'tablespoon': 14.787,
  'tablespoons': 14.787,
  
  // Cups and fluid ounces
  'cup': 240, // Using 240ml for easier cooking conversions
  'cups': 240,
  'fl oz': 30, // Rounded for easier cooking
  'fluid ounce': 30,
  'fluid ounces': 30,
  'fl. oz': 30,
  
  // Larger volumes
  'pint': 473,
  'pints': 473,
  'pt': 473,
  'quart': 946,
  'quarts': 946,
  'qt': 946,
  'gallon': 3785,
  'gallons': 3785,
  'gal': 3785,
};

// Weight conversions (US to grams)
const WEIGHT_CONVERSIONS: Record<string, number> = {
  'oz': 28.35,
  'ounce': 28.35,
  'ounces': 28.35,
  'lb': 453.6,
  'lbs': 453.6,
  'pound': 453.6,
  'pounds': 453.6,
};

/**
 * Ingredient density table for volume ↔ weight conversions
 * Values are grams per cup (240ml)
 */
const INGREDIENT_DENSITIES: Record<string, number> = {
  // Flours
  'flour': 120,
  'all-purpose flour': 120,
  'plain flour': 120,
  'ap flour': 120,
  'bread flour': 127,
  'cake flour': 110,
  'whole wheat flour': 113,
  'almond flour': 96,
  'coconut flour': 112,
  
  // Sugars
  'sugar': 200,
  'granulated sugar': 200,
  'white sugar': 200,
  'cane sugar': 200,
  'brown sugar': 220, // packed
  'light brown sugar': 220,
  'dark brown sugar': 220,
  'powdered sugar': 120,
  'confectioner\'s sugar': 120,
  'icing sugar': 120,
  
  // Fats
  'butter': 227,
  'margarine': 227,
  'shortening': 191,
  'oil': 218,
  'vegetable oil': 218,
  'olive oil': 216,
  'coconut oil': 218,
  
  // Dairy
  'milk': 240,
  'heavy cream': 240,
  'sour cream': 240,
  'yogurt': 245,
  'cream cheese': 232,
  
  // Nuts and seeds
  'almonds': 143,
  'walnuts': 117,
  'pecans': 109,
  'pine nuts': 135,
  'sesame seeds': 144,
  'sunflower seeds': 140,
  
  // Grains and legumes
  'rice': 185,
  'quinoa': 173,
  'oats': 81,
  'rolled oats': 81,
  'breadcrumbs': 108,
  
  // Cocoa and chocolate
  'cocoa powder': 75,
  'chocolate chips': 175,
  
  // Common ingredients
  'salt': 292,
  'baking powder': 192,
  'baking soda': 220,
  'vanilla': 240, // liquid
  'honey': 336,
  'maple syrup': 322,
  'molasses': 337,
};

/**
 * Get the canonical ingredient name for density lookup
 */
function getCanonicalIngredient(ingredient: string): string {
  const lower = ingredient.toLowerCase().trim();
  
  // Try exact match first
  if (INGREDIENT_DENSITIES[lower]) {
    return lower;
  }
  
  // Try partial matches
  for (const key of Object.keys(INGREDIENT_DENSITIES)) {
    if (lower.includes(key) || key.includes(lower)) {
      return key;
    }
  }
  
  // Default fallbacks based on common patterns
  if (lower.includes('flour')) return 'flour';
  if (lower.includes('sugar')) return 'sugar';
  if (lower.includes('butter')) return 'butter';
  if (lower.includes('oil')) return 'oil';
  if (lower.includes('milk')) return 'milk';
  
  return lower;
}

/**
 * Convert volume to weight using ingredient density
 */
export function volumeToWeight(
  volumeInMl: number, 
  ingredient: string
): { grams: number; ingredient: string } | null {
  const canonical = getCanonicalIngredient(ingredient);
  const density = INGREDIENT_DENSITIES[canonical];
  
  if (!density) return null;
  
  // Density is grams per 240ml (1 cup)
  const grams = (volumeInMl / 240) * density;
  
  return { grams: Math.round(grams * 10) / 10, ingredient: canonical };
}

/**
 * Convert weight to volume using ingredient density
 */
export function weightToVolume(
  grams: number, 
  ingredient: string
): { ml: number; ingredient: string } | null {
  const canonical = getCanonicalIngredient(ingredient);
  const density = INGREDIENT_DENSITIES[canonical];
  
  if (!density) return null;
  
  // Density is grams per 240ml (1 cup)
  const ml = (grams / density) * 240;
  
  return { ml: Math.round(ml * 10) / 10, ingredient: canonical };
}

/**
 * Convert US unit to metric
 */
export function convertToMetric(
  quantity: number,
  unit: string,
  ingredient?: string
): { quantity: number; unit: string; converted: boolean } {
  const lowerUnit = unit.toLowerCase();
  
  // Try volume conversion first
  if (VOLUME_CONVERSIONS[lowerUnit]) {
    const ml = quantity * VOLUME_CONVERSIONS[lowerUnit];
    
    // For large volumes, convert to liters
    if (ml >= 1000) {
      return {
        quantity: Math.round(ml / 100) / 10, // Round to nearest 0.1L
        unit: 'L',
        converted: true
      };
    }
    
    return {
      quantity: Math.round(ml * 10) / 10,
      unit: 'ml',
      converted: true
    };
  }
  
  // Try weight conversion
  if (WEIGHT_CONVERSIONS[lowerUnit]) {
    const grams = quantity * WEIGHT_CONVERSIONS[lowerUnit];
    
    // For large weights, convert to kg
    if (grams >= 1000) {
      return {
        quantity: Math.round(grams / 100) / 10, // Round to nearest 0.1kg
        unit: 'kg',
        converted: true
      };
    }
    
    return {
      quantity: Math.round(grams * 10) / 10,
      unit: 'g',
      converted: true
    };
  }
  
  // If ingredient provided, try density-based conversion for volume units
  if (ingredient && ['cup', 'cups'].includes(lowerUnit)) {
    const weightResult = volumeToWeight(quantity * 240, ingredient);
    if (weightResult) {
      return {
        quantity: weightResult.grams,
        unit: 'g',
        converted: true
      };
    }
  }
  
  // No conversion available
  return {
    quantity,
    unit,
    converted: false
  };
}

/**
 * Convert metric unit to US
 */
export function convertToUS(
  quantity: number,
  unit: string,
  ingredient?: string
): { quantity: number; unit: string; converted: boolean } {
  const lowerUnit = unit.toLowerCase();
  
  // Convert from ml
  if (lowerUnit === 'ml') {
    // Prefer cups for larger volumes
    if (quantity >= 240) {
      return {
        quantity: Math.round((quantity / 240) * 4) / 4, // Round to 1/4 cups
        unit: 'cups',
        converted: true
      };
    }
    
    // Use tablespoons for medium volumes
    if (quantity >= 15) {
      return {
        quantity: Math.round((quantity / 14.787) * 4) / 4, // Round to 1/4 tbsp
        unit: 'tbsp',
        converted: true
      };
    }
    
    // Use teaspoons for small volumes
    return {
      quantity: Math.round((quantity / 4.929) * 4) / 4, // Round to 1/4 tsp
      unit: 'tsp',
      converted: true
    };
  }
  
  // Convert from liters
  if (lowerUnit === 'l') {
    const cups = quantity * (1000 / 240);
    return {
      quantity: Math.round(cups * 4) / 4,
      unit: 'cups',
      converted: true
    };
  }
  
  // Convert from grams
  if (lowerUnit === 'g') {
    // Try density-based conversion to volume if ingredient provided
    if (ingredient) {
      const volumeResult = weightToVolume(quantity, ingredient);
      if (volumeResult && volumeResult.ml >= 15) { // Only convert if reasonable volume
        const cups = volumeResult.ml / 240;
        if (cups >= 0.25) {
          return {
            quantity: Math.round(cups * 4) / 4,
            unit: 'cups',
            converted: true
          };
        }
      }
    }
    
    // Fallback to weight conversion
    if (quantity >= 454) { // About 1 pound
      return {
        quantity: Math.round((quantity / 453.6) * 4) / 4,
        unit: 'lbs',
        converted: true
      };
    }
    
    return {
      quantity: Math.round((quantity / 28.35) * 4) / 4,
      unit: 'oz',
      converted: true
    };
  }
  
  // Convert from kg
  if (lowerUnit === 'kg') {
    const pounds = quantity * (1000 / 453.6);
    return {
      quantity: Math.round(pounds * 4) / 4,
      unit: 'lbs',
      converted: true
    };
  }
  
  // No conversion available
  return {
    quantity,
    unit,
    converted: false
  };
}

/**
 * Convert between unit systems
 */
export function convertUnits(
  quantity: number,
  unit: string,
  targetSystem: UnitSystem,
  ingredient?: string
): { quantity: number; unit: string; converted: boolean } {
  if (targetSystem === 'metric') {
    return convertToMetric(quantity, unit, ingredient);
  } else {
    return convertToUS(quantity, unit, ingredient);
  }
}