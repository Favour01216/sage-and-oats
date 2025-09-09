/**
 * Unit conversion utilities for US ↔ Metric systems
 * Includes accurate density tables for common ingredients
 */

import { formatMixedFraction } from '../fraction-utils';

// Unit types
export type UnitSystem = 'us' | 'metric';

export interface Unit {
  name: string;
  abbr: string;
  system: UnitSystem;
  type: 'volume' | 'weight' | 'count';
  toBase: number; // Conversion factor to base unit (ml for volume, g for weight)
}

// Volume units (base: milliliters)
const VOLUME_UNITS: Record<string, Unit> = {
  // Metric
  ml: { name: 'milliliter', abbr: 'ml', system: 'metric', type: 'volume', toBase: 1 },
  l: { name: 'liter', abbr: 'l', system: 'metric', type: 'volume', toBase: 1000 },
  
  // US
  tsp: { name: 'teaspoon', abbr: 'tsp', system: 'us', type: 'volume', toBase: 4.92892 },
  tbsp: { name: 'tablespoon', abbr: 'tbsp', system: 'us', type: 'volume', toBase: 14.7868 },
  floz: { name: 'fluid ounce', abbr: 'fl oz', system: 'us', type: 'volume', toBase: 29.5735 },
  cup: { name: 'cup', abbr: 'cup', system: 'us', type: 'volume', toBase: 236.588 },
  pint: { name: 'pint', abbr: 'pt', system: 'us', type: 'volume', toBase: 473.176 },
  quart: { name: 'quart', abbr: 'qt', system: 'us', type: 'volume', toBase: 946.353 },
  gallon: { name: 'gallon', abbr: 'gal', system: 'us', type: 'volume', toBase: 3785.41 },
};

// Weight units (base: grams)
const WEIGHT_UNITS: Record<string, Unit> = {
  // Metric
  mg: { name: 'milligram', abbr: 'mg', system: 'metric', type: 'weight', toBase: 0.001 },
  g: { name: 'gram', abbr: 'g', system: 'metric', type: 'weight', toBase: 1 },
  kg: { name: 'kilogram', abbr: 'kg', system: 'metric', type: 'weight', toBase: 1000 },
  
  // US
  oz: { name: 'ounce', abbr: 'oz', system: 'us', type: 'weight', toBase: 28.3495 },
  lb: { name: 'pound', abbr: 'lb', system: 'us', type: 'weight', toBase: 453.592 },
};

// Density table for common ingredients (grams per cup)
const DENSITY_TABLE: Record<string, number> = {
  // Flours
  'all-purpose flour': 120,
  'flour': 120,
  'bread flour': 127,
  'cake flour': 114,
  'whole wheat flour': 128,
  'almond flour': 96,
  'coconut flour': 128,
  
  // Sugars
  'granulated sugar': 200,
  'sugar': 200,
  'white sugar': 200,
  'brown sugar': 220,
  'packed brown sugar': 220,
  'powdered sugar': 120,
  'confectioners sugar': 120,
  'honey': 340,
  'maple syrup': 322,
  'corn syrup': 328,
  
  // Fats
  'butter': 227,
  'oil': 218,
  'vegetable oil': 218,
  'olive oil': 216,
  'coconut oil': 218,
  'shortening': 191,
  
  // Dairy
  'milk': 245,
  'whole milk': 245,
  'cream': 242,
  'heavy cream': 238,
  'sour cream': 230,
  'yogurt': 245,
  'greek yogurt': 285,
  
  // Others
  'water': 237,
  'cocoa powder': 85,
  'chocolate chips': 170,
  'oats': 80,
  'rolled oats': 80,
  'rice': 185,
  'salt': 288,
  'baking soda': 230,
  'baking powder': 230,
  'yeast': 142,
  'cornstarch': 128,
  'peanut butter': 258,
  'jam': 320,
  'nuts': 120,
  'chopped nuts': 120,
  'raisins': 145,
};

/**
 * Get density for an ingredient
 * @param ingredient - Ingredient name
 * @returns Grams per cup, or null if not found
 */
export function getIngredientDensity(ingredient: string): number | null {
  const normalized = ingredient.toLowerCase().trim();
  
  // Direct match
  if (DENSITY_TABLE[normalized]) {
    return DENSITY_TABLE[normalized];
  }
  
  // Try to find partial match
  for (const [key, density] of Object.entries(DENSITY_TABLE)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return density;
    }
  }
  
  return null;
}

/**
 * Convert between units
 * @param value - The numeric value to convert
 * @param fromUnit - Source unit
 * @param toUnit - Target unit
 * @param ingredient - Optional ingredient for density-based conversions
 * @returns Converted value, or null if conversion not possible
 */
export function convertUnit(
  value: number,
  fromUnit: string,
  toUnit: string,
  ingredient?: string
): number | null {
  const from = VOLUME_UNITS[fromUnit] || WEIGHT_UNITS[fromUnit];
  const to = VOLUME_UNITS[toUnit] || WEIGHT_UNITS[toUnit];
  
  if (!from || !to) {
    return null;
  }
  
  // Same unit
  if (fromUnit === toUnit) {
    return value;
  }
  
  // Same type conversion (volume to volume, weight to weight)
  if (from.type === to.type) {
    const baseValue = value * from.toBase;
    return baseValue / to.toBase;
  }
  
  // Volume to weight or weight to volume (needs density)
  if (from.type !== to.type && ingredient) {
    const density = getIngredientDensity(ingredient);
    if (!density) {
      return null;
    }
    
    if (from.type === 'volume' && to.type === 'weight') {
      // Convert volume to cups, then to grams using density
      const cups = (value * from.toBase) / VOLUME_UNITS.cup.toBase;
      const grams = cups * density;
      return grams / to.toBase;
    } else if (from.type === 'weight' && to.type === 'volume') {
      // Convert weight to grams, then to cups using density
      const grams = value * from.toBase;
      const cups = grams / density;
      return (cups * VOLUME_UNITS.cup.toBase) / to.toBase;
    }
  }
  
  return null;
}

/**
 * Convert a quantity to the target unit system
 * @param value - Numeric value
 * @param unit - Current unit
 * @param targetSystem - Target unit system
 * @param ingredient - Optional ingredient for density conversions
 * @returns Object with converted value and unit
 */
export function convertToSystem(
  value: number,
  unit: string,
  targetSystem: UnitSystem,
  ingredient?: string
): { value: number; unit: string } {
  const currentUnit = VOLUME_UNITS[unit] || WEIGHT_UNITS[unit];
  
  if (!currentUnit) {
    return { value, unit };
  }
  
  // Already in target system
  if (currentUnit.system === targetSystem) {
    return { value, unit };
  }
  
  // Define conversion targets
  const conversionMap: Record<string, string> = {
    // Metric to US
    ml_us: 'tsp',
    l_us: 'cup',
    g_us: 'oz',
    kg_us: 'lb',
    
    // US to Metric
    tsp_metric: 'ml',
    tbsp_metric: 'ml',
    cup_metric: 'ml',
    floz_metric: 'ml',
    pint_metric: 'ml',
    quart_metric: 'l',
    gallon_metric: 'l',
    oz_metric: 'g',
    lb_metric: 'g',
  };
  
  const targetUnit = conversionMap[`${unit}_${targetSystem}`];
  if (!targetUnit) {
    return { value, unit };
  }
  
  const converted = convertUnit(value, unit, targetUnit, ingredient);
  if (converted === null) {
    return { value, unit };
  }
  
  // Round to sensible values
  const finalValue = converted;
  
  // For US volume, prefer common measurements
  if (targetSystem === 'us' && currentUnit.type === 'volume') {
    if (converted >= 48) { // >= 1 cup
      const cups = converted / 48; // Convert tsp to cups
      return { value: cups, unit: 'cup' };
    } else if (converted >= 3) { // >= 1 tbsp
      const tbsp = converted / 3; // Convert tsp to tbsp
      return { value: tbsp, unit: 'tbsp' };
    }
  }
  
  // For metric, round to nice numbers
  if (targetSystem === 'metric') {
    if (targetUnit === 'ml' && finalValue >= 1000) {
      return { value: finalValue / 1000, unit: 'l' };
    } else if (targetUnit === 'g' && finalValue >= 1000) {
      return { value: finalValue / 1000, unit: 'kg' };
    }
  }
  
  return { value: finalValue, unit: targetUnit };
}

/**
 * Format a quantity with appropriate units and fractions
 * @param value - Numeric value
 * @param unit - Unit
 * @param system - Unit system for formatting
 * @returns Formatted string
 */
export function formatQuantity(
  value: number,
  unit: string,
  system: UnitSystem
): string {
  // Use fractions for US measurements
  const useFractions = system === 'us';
  const formatted = useFractions ? formatMixedFraction(value) : value.toFixed(1).replace(/\.0$/, '');
  
  // Pluralize unit if needed
  const unitObj = VOLUME_UNITS[unit] || WEIGHT_UNITS[unit];
  const unitDisplay = unitObj ? unitObj.abbr : unit;
  
  // Special pluralization for cups
  if (unit === 'cup') {
    // Only pluralize if value is greater than 1 (not for fractions like 3/4)
    const needsPlural = value > 1;
    return needsPlural ? `${formatted} cups` : `${formatted} cup`;
  }
  
  return `${formatted} ${unitDisplay}`;
}

/**
 * Pipeline for scaling, converting, and formatting
 * @param value - Original value
 * @param unit - Original unit
 * @param scaleFactor - Scaling factor
 * @param targetSystem - Target unit system
 * @param ingredient - Optional ingredient
 * @returns Formatted string
 */
export function processQuantity(
  value: number,
  unit: string,
  scaleFactor: number,
  targetSystem: UnitSystem,
  ingredient?: string
): string {
  // Step 1: Scale in original units (preferably metric for accuracy)
  const scaled = value * scaleFactor;
  
  // Step 2: Convert to target system
  const { value: converted, unit: targetUnit } = convertToSystem(scaled, unit, targetSystem, ingredient);
  
  // Step 3: Format with appropriate fractions
  return formatQuantity(converted, targetUnit, targetSystem);
}