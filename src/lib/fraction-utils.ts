/**
 * Fraction utilities for cooking measurements
 */

// Common cooking fractions
const COMMON_FRACTIONS = [
  { decimal: 1/8, fraction: '⅛' },
  { decimal: 1/4, fraction: '¼' },
  { decimal: 1/3, fraction: '⅓' },
  { decimal: 1/2, fraction: '½' },
  { decimal: 2/3, fraction: '⅔' },
  { decimal: 3/4, fraction: '¾' },
  { decimal: 7/8, fraction: '⅞' },
];

/**
 * Convert decimal to fraction string for US measurements
 */
export function decimalToFraction(decimal: number, tolerance = 0.05): string {
  // Handle whole numbers
  if (Math.abs(decimal - Math.round(decimal)) < 0.001) {
    return Math.round(decimal).toString();
  }

  // Split into whole and fractional parts
  const whole = Math.floor(decimal);
  const fractional = decimal - whole;

  // Find closest common fraction
  let closestFraction = null;
  let minDiff = Infinity;

  for (const frac of COMMON_FRACTIONS) {
    const diff = Math.abs(fractional - frac.decimal);
    if (diff < minDiff && diff <= tolerance) {
      minDiff = diff;
      closestFraction = frac;
    }
  }

  if (closestFraction) {
    if (whole > 0) {
      return `${whole} ${closestFraction.fraction}`;
    } else {
      return closestFraction.fraction;
    }
  }

  // If no close fraction found, use decimal
  if (whole > 0) {
    return `${whole}.${fractional.toFixed(2).substring(2)}`;
  } else {
    return fractional.toFixed(2);
  }
}

/**
 * Round quantity to cooking-friendly values
 */
export function roundFriendly(quantity: number, unit?: string): number {
  if (quantity <= 0) return 0;

  // For metric units, round to 1 decimal place
  if (unit && ['g', 'ml', 'l', 'kg'].includes(unit.toLowerCase())) {
    return Math.round(quantity * 10) / 10;
  }

  // For US units, we'll handle fractions in the formatting step
  // but round to reasonable precision for calculations
  if (quantity < 0.125) {
    return Math.round(quantity * 16) / 16; // Round to 1/16ths for very small amounts
  } else if (quantity < 1) {
    return Math.round(quantity * 8) / 8; // Round to 1/8ths
  } else if (quantity < 10) {
    return Math.round(quantity * 4) / 4; // Round to 1/4ths
  } else {
    return Math.round(quantity * 2) / 2; // Round to 1/2s for larger amounts
  }
}

/**
 * Format quantity with appropriate precision and fractions
 */
export function formatQuantity(quantity: number, unit?: string, unitSystem: 'us' | 'metric' = 'us'): string {
  const rounded = roundFriendly(quantity, unit);

  if (unitSystem === 'metric' || (unit && ['g', 'ml', 'l', 'kg'].includes(unit.toLowerCase()))) {
    // Metric: use decimal notation
    if (rounded % 1 === 0) {
      return rounded.toString();
    } else {
      return rounded.toFixed(1).replace(/\.0$/, '');
    }
  } else {
    // US: use fractions for common cooking measurements
    return decimalToFraction(rounded);
  }
}