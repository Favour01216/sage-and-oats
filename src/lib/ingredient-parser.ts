// Ingredient parsing and unit conversion utilities

import { formatMixedFraction, roundToSensible } from "./fraction-utils";
import { convertToSystem, formatQuantity } from "./units/conversions";

export type ParsedIngredient = {
  originalText: string;
  quantity?: number;
  unit?: string;
  ingredient: string;
  preparation?: string; // e.g., "chopped", "diced"
};

export type UnitSystem = "us" | "metric";

// Common measurement patterns
const MEASUREMENT_REGEX =
  /^(\d+(?:\.\d+)?(?:\/\d+)?|\d+\/\d+)\s*([a-zA-Z\s]+?)\s+(.+?)(?:\s*,\s*(.+))?$/;
const FRACTION_REGEX = /(\d+)?\/(\d+)/;

/**
 * Parse a fraction string to decimal
 */
function parseFraction(fractionStr: string): number {
  const match = fractionStr.match(FRACTION_REGEX);
  if (!match) return parseFloat(fractionStr) || 0;

  const [, numerator = "0", denominator] = match;
  if (!denominator) return 0;
  return parseInt(numerator) / parseInt(denominator);
}

/**
 * Parse quantity that might include fractions
 */
function parseQuantity(quantityStr: string): number {
  // Handle mixed numbers like "1 1/2" or "2¾"
  if (quantityStr.includes("/")) {
    const parts = quantityStr.split(/\s+/);
    if (parts.length === 2 && parts[0] && parts[1]) {
      // Mixed number like "1 1/2"
      const whole = parseInt(parts[0]) || 0;
      const fraction = parseFraction(parts[1]);
      return whole + fraction;
    } else {
      // Just fraction like "1/2"
      return parseFraction(quantityStr);
    }
  }

  // Handle unicode fractions
  const unicodeFractions: Record<string, number> = {
    "¼": 0.25,
    "½": 0.5,
    "¾": 0.75,
    "⅓": 0.333,
    "⅔": 0.667,
    "⅛": 0.125,
    "⅜": 0.375,
    "⅝": 0.625,
    "⅞": 0.875,
  };

  for (const [unicode, value] of Object.entries(unicodeFractions)) {
    if (quantityStr.includes(unicode)) {
      const remaining = quantityStr.replace(unicode, "").trim();
      const whole = remaining ? parseInt(remaining) : 0;
      return whole + value;
    }
  }

  return parseFloat(quantityStr) || 0;
}

/**
 * Parse an ingredient line into components
 */
export function parseIngredient(ingredientLine: string): ParsedIngredient {
  const trimmed = ingredientLine.trim();

  // Try to match quantity + unit + ingredient pattern
  const match = trimmed.match(MEASUREMENT_REGEX);

  if (match && match[1] && match[2] && match[3]) {
    const [, quantityStr, unitStr, ingredient, preparation] = match;

    return {
      originalText: trimmed,
      quantity: parseQuantity(quantityStr),
      unit: unitStr.trim().toLowerCase(),
      ingredient: ingredient.trim(),
      preparation: preparation?.trim(),
    };
  }

  // If no pattern matches, try to extract just a number at the beginning
  const numberMatch = trimmed.match(/^(\d+(?:\.\d+)?(?:\/\d+)?|\d+\/\d+)\s+(.+)$/);
  if (numberMatch && numberMatch[1] && numberMatch[2]) {
    const [, quantityStr, rest] = numberMatch;
    return {
      originalText: trimmed,
      quantity: parseQuantity(quantityStr),
      ingredient: rest.trim(),
    };
  }

  // No measurable quantity found
  return {
    originalText: trimmed,
    ingredient: trimmed,
  };
}

/**
 * Scale ingredient quantities for different serving sizes
 */
export function scaleIngredient(
  parsed: ParsedIngredient,
  originalServings: number,
  targetServings: number,
): ParsedIngredient {
  if (!parsed.quantity || originalServings <= 0 || targetServings <= 0) {
    return parsed;
  }

  const scaleFactor = targetServings / originalServings;
  const scaledQuantity = roundToSensible(parsed.quantity * scaleFactor);

  return {
    ...parsed,
    quantity: scaledQuantity,
  };
}

/**
 * Convert ingredient to different unit system
 */
export function convertIngredientUnits(
  parsed: ParsedIngredient,
  targetSystem: UnitSystem,
): ParsedIngredient {
  if (!parsed.quantity || !parsed.unit) {
    return parsed;
  }

  const result = convertToSystem(parsed.quantity, parsed.unit, targetSystem, parsed.ingredient);

  return {
    ...parsed,
    quantity: result.value,
    unit: result.unit,
  };
}

/**
 * Format a parsed ingredient back to a readable string
 */
export function formatIngredient(parsed: ParsedIngredient, unitSystem: UnitSystem = "us"): string {
  const converted = unitSystem === "metric" ? convertIngredientUnits(parsed, "metric") : parsed;

  let result = "";

  if (converted.quantity && converted.unit) {
    const formattedQty = formatQuantity(converted.quantity, converted.unit, unitSystem);
    result = `${formattedQty} ${converted.ingredient}`;
  } else if (converted.quantity) {
    const formattedQty =
      unitSystem === "us"
        ? formatMixedFraction(converted.quantity)
        : converted.quantity.toFixed(1).replace(/\.0$/, "");
    result = `${formattedQty} ${converted.ingredient}`;
  } else {
    result = converted.ingredient;
  }

  if (converted.preparation) {
    result += `, ${converted.preparation}`;
  }

  return result;
}

/**
 * Process all ingredients for a recipe with scaling and unit conversion
 */
export function processRecipeIngredients(
  ingredientLines: string[],
  originalServings: number,
  targetServings: number,
  unitSystem: UnitSystem = "us",
): { originalText: string; formattedText: string; parsed: ParsedIngredient }[] {
  return ingredientLines.map(line => {
    const parsed = parseIngredient(line);
    const scaled = scaleIngredient(parsed, originalServings, targetServings);
    const formatted = formatIngredient(scaled, unitSystem);

    return {
      originalText: line,
      formattedText: formatted,
      parsed: scaled,
    };
  });
}
