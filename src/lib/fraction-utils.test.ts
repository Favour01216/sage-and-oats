/**
 * Tests for fraction utilities
 */

import { formatMixedFraction, parseFraction, scaleQuantity, roundToSensible } from './fraction-utils';

describe('formatMixedFraction', () => {
  // Test cases for formatting
  const testCases = [
    // Whole numbers
    { input: 1, expected: '1' },
    { input: 2, expected: '2' },
    { input: 0, expected: '0' },
    
    // Common fractions
    { input: 0.5, expected: '½' },
    { input: 0.25, expected: '¼' },
    { input: 0.75, expected: '¾' },
    { input: 0.333, expected: '⅓' },
    { input: 0.667, expected: '⅔' },
    
    // Mixed fractions
    { input: 1.5, expected: '1 ½' },
    { input: 2.25, expected: '2 ¼' },
    { input: 3.75, expected: '3 ¾' },
    { input: 1.333, expected: '1 ⅓' },
    
    // Edge cases
    { input: 0.33, expected: '⅓' },
    { input: 1.5 * 2, expected: '3' }, // 1.5 × 2 = 3
    { input: 0.33 * 3, expected: '1' }, // 0.33 × 3 ≈ 1
    
    // Decimals that don't match fractions
    { input: 0.15, expected: '0.15' },
    { input: 1.15, expected: '1.15' },
    { input: 2.6, expected: '2.6' },
  ];
  
  testCases.forEach(({ input, expected }) => {
    test(`formats ${input} as "${expected}"`, () => {
      expect(formatMixedFraction(input)).toBe(expected);
    });
  });
  
  test('forces decimal format when requested', () => {
    expect(formatMixedFraction(1.5, true)).toBe('1.5');
    expect(formatMixedFraction(0.333, true)).toBe('0.33');
  });
});

describe('parseFraction', () => {
  const testCases = [
    // Whole numbers
    { input: '1', expected: 1 },
    { input: '10', expected: 10 },
    
    // Decimals
    { input: '1.5', expected: 1.5 },
    { input: '0.33', expected: 0.33 },
    
    // Unicode fractions
    { input: '½', expected: 0.5 },
    { input: '¼', expected: 0.25 },
    { input: '¾', expected: 0.75 },
    { input: '⅓', expected: 0.333 },
    { input: '⅔', expected: 0.667 },
    
    // Regular fractions
    { input: '1/2', expected: 0.5 },
    { input: '3/4', expected: 0.75 },
    { input: '2/3', expected: 0.6667 },
    
    // Mixed fractions
    { input: '1 1/2', expected: 1.5 },
    { input: '2 3/4', expected: 2.75 },
    { input: '1-1/2', expected: 1.5 },
    { input: '3 1/3', expected: 3.3333 },
    
    // Mixed unicode fractions
    { input: '1 ½', expected: 1.5 },
    { input: '2 ¾', expected: 2.75 },
    
    // Edge cases
    { input: '', expected: 0 },
    { input: 'abc', expected: 0 },
  ];
  
  testCases.forEach(({ input, expected }) => {
    test(`parses "${input}" as ${expected}`, () => {
      const result = parseFraction(input);
      expect(result).toBeCloseTo(expected, 3);
    });
  });
});

describe('scaleQuantity', () => {
  const testCases = [
    // Simple scaling
    { input: '1 cup', scale: 2, expected: '2 cups' },
    { input: '0.5 tsp', scale: 2, expected: '1 tsp' },
    { input: '2 tbsp', scale: 0.5, expected: '1 tbsp' },
    
    // Fraction scaling
    { input: '1/2 cup', scale: 2, expected: '1 cup' },
    { input: '3/4 cup', scale: 2, expected: '1 ½ cups' },
    { input: '1 1/2 cups', scale: 2, expected: '3 cups' },
    
    // Metric scaling
    { input: '100 g', scale: 1.5, expected: '150 g' },
    { input: '250 ml', scale: 0.5, expected: '125 ml' },
    { input: '90 g', scale: 2/3, expected: '60 g' }, // 90 g × (2/3) = 60 g
    
    // No unit
    { input: '3', scale: 2, expected: '6' },
    { input: '1.5', scale: 2, expected: '3' },
    
    // Unicode fractions
    { input: '½ cup', scale: 3, expected: '1 ½ cups' },
    { input: '¾ tsp', scale: 2, expected: '1 ½ tsp' },
  ];
  
  testCases.forEach(({ input, scale, expected }) => {
    test(`scales "${input}" by ${scale} to "${expected}"`, () => {
      expect(scaleQuantity(input, scale)).toBe(expected);
    });
  });
});

describe('roundToSensible', () => {
  const testCases = [
    // Small values
    { input: 0.05, expected: 0.05 },
    { input: 0.12, expected: 0.12 },
    
    // Common fractions
    { input: 0.24, expected: 0.25 },
    { input: 0.26, expected: 0.25 },
    { input: 0.48, expected: 0.5 },
    { input: 0.74, expected: 0.75 },
    
    // Medium values
    { input: 1.4, expected: 1.5 },
    { input: 2.6, expected: 2.5 },
    { input: 3.1, expected: 3 },
    { input: 4.9, expected: 5 },
    
    // Large values
    { input: 98, expected: 100 },
    { input: 102, expected: 100 },
    { input: 247, expected: 245 },
    { input: 253, expected: 255 },
  ];
  
  testCases.forEach(({ input, expected }) => {
    test(`rounds ${input} to ${expected}`, () => {
      expect(roundToSensible(input)).toBeCloseTo(expected, 2);
    });
  });
});