/**
 * Fraction utilities for recipe scaling and display
 */

// Common fractions with their decimal equivalents
const FRACTION_MAP = new Map<number, string>([
  [0.125, "⅛"],
  [0.25, "¼"],
  [0.333, "⅓"],
  [0.375, "⅜"],
  [0.5, "½"],
  [0.625, "⅝"],
  [0.666, "⅔"],
  [0.667, "⅔"],
  [0.75, "¾"],
  [0.875, "⅞"],
]);

// Allowed denominators for mixed fractions
const ALLOWED_DENOMINATORS = [2, 3, 4, 8];

/**
 * Find the closest fraction with allowed denominators
 */
function findClosestFraction(decimal: number): { numerator: number; denominator: number } | null {
  let bestFraction = null;
  let minDiff = Infinity;

  for (const denominator of ALLOWED_DENOMINATORS) {
    for (let numerator = 1; numerator < denominator; numerator++) {
      const value = numerator / denominator;
      const diff = Math.abs(decimal - value);

      if (diff < minDiff && diff < 0.01) {
        // Within 0.01 tolerance
        minDiff = diff;
        bestFraction = { numerator, denominator };
      }
    }
  }

  return bestFraction;
}

/**
 * Format a number as a mixed fraction
 * @param value - The number to format
 * @param forceDecimal - If true, always return decimal format
 * @returns Formatted string (e.g., "1 ½", "2 ¾", "0.33")
 */
export function formatMixedFraction(value: number, forceDecimal = false): string {
  if (forceDecimal) {
    // Round to 2 decimal places, but remove trailing zeros
    return parseFloat(value.toFixed(2)).toString();
  }

  // Handle whole numbers
  if (Number.isInteger(value)) {
    return value.toString();
  }

  // Split into whole and decimal parts
  const whole = Math.floor(value);
  const decimal = value - whole;

  // Check for exact fraction matches
  for (const [dec, frac] of FRACTION_MAP.entries()) {
    if (Math.abs(decimal - dec) < 0.01) {
      return whole > 0 ? `${whole} ${frac}` : frac;
    }
  }

  // Try to find a close fraction
  const fraction = findClosestFraction(decimal);
  if (fraction) {
    const fractionStr = `${fraction.numerator}/${fraction.denominator}`;
    return whole > 0 ? `${whole} ${fractionStr}` : fractionStr;
  }

  // Fall back to decimal
  return parseFloat(value.toFixed(2)).toString();
}

/**
 * Parse a fraction string to a number
 * @param str - String like "1 1/2", "3/4", "2.5"
 * @returns Parsed number value
 */
export function parseFraction(str: string): number {
  // Remove extra whitespace
  str = str.trim();

  // Handle unicode fractions
  for (const [dec, frac] of FRACTION_MAP.entries()) {
    if (str === frac) {
      return dec;
    }
    // Handle mixed unicode fractions like "1 ½"
    const mixedMatch = str.match(/^(\d+)\s*(.+)$/);
    if (mixedMatch && mixedMatch[2] === frac) {
      return parseInt(mixedMatch[1]) + dec;
    }
  }

  // Handle regular fractions like "3/4"
  const fractionMatch = str.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    return parseInt(fractionMatch[1]) / parseInt(fractionMatch[2]);
  }

  // Handle mixed fractions like "1 1/2" or "1-1/2"
  const mixedFractionMatch = str.match(/^(\d+)\s*[-\s]\s*(\d+)\/(\d+)$/);
  if (mixedFractionMatch) {
    const whole = parseInt(mixedFractionMatch[1]);
    const numerator = parseInt(mixedFractionMatch[2]);
    const denominator = parseInt(mixedFractionMatch[3]);
    return whole + numerator / denominator;
  }

  // Handle decimals and whole numbers
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

/**
 * Scale a quantity string (number + optional unit)
 * @param quantity - String like "1.5 cups", "200g", "3"
 * @param scaleFactor - Multiplier for scaling
 * @returns Scaled quantity string
 */
export function scaleQuantity(quantity: string, scaleFactor: number): string {
  // Extract number and unit
  const match = quantity.match(/^([\d\s.\/⅛¼⅓⅜½⅝⅔¾⅞-]+)\s*(.*)$/);
  if (!match) {
    return quantity; // Return as-is if no number found
  }

  const [, numberPart, unit] = match;
  const value = parseFraction(numberPart);
  const scaledValue = value * scaleFactor;

  // Format the scaled value
  const formatted = formatMixedFraction(scaledValue);

  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Round a number to a sensible cooking measurement
 * @param value - The number to round
 * @returns Rounded value
 */
export function roundToSensible(value: number): number {
  // For very small values, keep precision
  if (value < 0.125) {
    return Math.round(value * 100) / 100; // 2 decimal places
  }

  // For values less than 1, try to match common fractions
  if (value < 1) {
    const fraction = findClosestFraction(value);
    if (fraction) {
      return fraction.numerator / fraction.denominator;
    }
  }

  // For larger values, round to nearest quarter
  if (value < 10) {
    return Math.round(value * 4) / 4;
  }

  // For very large values, round to nearest 5
  if (value >= 100) {
    return Math.round(value / 5) * 5;
  }

  // Otherwise round to nearest half
  return Math.round(value * 2) / 2;
}
