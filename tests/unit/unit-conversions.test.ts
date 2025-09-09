/**
 * Unit tests for unit conversion system
 */

import { convertToMetric, convertToUS, convertUnits } from '../../src/lib/units/conversions';

// Test cases for US to Metric conversion
const usToMetricTests = [
  // Volume conversions
  { input: { qty: 1, unit: 'cup' }, expected: { qty: 240, unit: 'ml' }, desc: '1 cup → 240 ml' },
  { input: { qty: 2, unit: 'cups' }, expected: { qty: 480, unit: 'ml' }, desc: '2 cups → 480 ml' },
  { input: { qty: 1, unit: 'tbsp' }, expected: { qty: 14.8, unit: 'ml' }, desc: '1 tbsp → ~14.8 ml' },
  { input: { qty: 1, unit: 'tsp' }, expected: { qty: 4.9, unit: 'ml' }, desc: '1 tsp → ~4.9 ml' },
  { input: { qty: 4, unit: 'cups' }, expected: { qty: 1, unit: 'L' }, desc: '4 cups → 1 L' },
  
  // Weight conversions
  { input: { qty: 1, unit: 'lb' }, expected: { qty: 453.6, unit: 'g' }, desc: '1 lb → 453.6 g' },
  { input: { qty: 1, unit: 'oz' }, expected: { qty: 28.4, unit: 'g' }, desc: '1 oz → ~28.4 g' },
  { input: { qty: 2.2, unit: 'lbs' }, expected: { qty: 1, unit: 'kg' }, desc: '2.2 lbs → 1 kg' },
];

// Test cases for Metric to US conversion  
const metricToUSTests = [
  // Volume conversions
  { input: { qty: 240, unit: 'ml' }, expected: { qty: 1, unit: 'cups' }, desc: '240 ml → 1 cup' },
  { input: { qty: 480, unit: 'ml' }, expected: { qty: 2, unit: 'cups' }, desc: '480 ml → 2 cups' },
  { input: { qty: 15, unit: 'ml' }, expected: { qty: 1, unit: 'tbsp' }, desc: '15 ml → 1 tbsp' },
  { input: { qty: 5, unit: 'ml' }, expected: { qty: 1, unit: 'tsp' }, desc: '5 ml → 1 tsp' },
  { input: { qty: 1, unit: 'L' }, expected: { qty: 4, unit: 'cups' }, desc: '1 L → ~4 cups' },
  
  // Weight conversions
  { input: { qty: 454, unit: 'g' }, expected: { qty: 1, unit: 'lbs' }, desc: '454 g → 1 lb' },
  { input: { qty: 28, unit: 'g' }, expected: { qty: 1, unit: 'oz' }, desc: '28 g → 1 oz' },
  { input: { qty: 1, unit: 'kg' }, expected: { qty: 2.2, unit: 'lbs' }, desc: '1 kg → 2.2 lbs' },
];

// Test cases for ingredient-specific conversions
const ingredientConversionTests = [
  { 
    input: { qty: 1, unit: 'cup', ingredient: 'flour' }, 
    targetSystem: 'metric' as const,
    expected: { qty: 120, unit: 'g' }, 
    desc: '1 cup flour → 120 g' 
  },
  { 
    input: { qty: 1, unit: 'cup', ingredient: 'sugar' }, 
    targetSystem: 'metric' as const,
    expected: { qty: 200, unit: 'g' }, 
    desc: '1 cup sugar → 200 g' 
  },
  { 
    input: { qty: 1, unit: 'cup', ingredient: 'butter' }, 
    targetSystem: 'metric' as const,
    expected: { qty: 227, unit: 'g' }, 
    desc: '1 cup butter → 227 g' 
  },
  { 
    input: { qty: 120, unit: 'g', ingredient: 'flour' }, 
    targetSystem: 'us' as const,
    expected: { qty: 1, unit: 'cups' }, 
    desc: '120 g flour → 1 cup' 
  },
];

// Scaling + conversion integration tests
const scalingConversionTests = [
  {
    desc: '240 ml (1 cup) → "1 cup"; doubled → "2 cups"',
    original: { qty: 240, unit: 'ml', servings: 2 },
    scaled: { servings: 4 },
    targetSystem: 'us' as const,
    expected: '2 cups'
  },
  {
    desc: '120 g flour → "1 cup flour"; scaled ×1.5 → "1 ½ cups flour"',
    original: { qty: 120, unit: 'g', ingredient: 'flour', servings: 4 },
    scaled: { servings: 6 },
    targetSystem: 'us' as const,
    expected: '1 ½ cups flour'
  },
];

// Example test runner (would need actual test framework)
export function runUnitConversionTests() {
  console.log('Testing unit conversions...');
  
  // Test US to Metric
  console.log('\n--- US to Metric ---');
  usToMetricTests.forEach(({ input, expected, desc }) => {
    const result = convertToMetric(input.qty, input.unit);
    const qtyMatch = Math.abs(result.quantity - expected.qty) < 0.5;
    const unitMatch = result.unit === expected.unit;
    
    if (qtyMatch && unitMatch && result.converted) {
      console.log(`✓ ${desc}`);
    } else {
      console.error(`✗ ${desc} - Got: ${result.quantity} ${result.unit}, Expected: ${expected.qty} ${expected.unit}`);
    }
  });
  
  // Test Metric to US
  console.log('\n--- Metric to US ---');
  metricToUSTests.forEach(({ input, expected, desc }) => {
    const result = convertToUS(input.qty, input.unit);
    const qtyMatch = Math.abs(result.quantity - expected.qty) < 0.5;
    const unitMatch = result.unit === expected.unit;
    
    if (qtyMatch && unitMatch && result.converted) {
      console.log(`✓ ${desc}`);
    } else {
      console.error(`✗ ${desc} - Got: ${result.quantity} ${result.unit}, Expected: ${expected.qty} ${expected.unit}`);
    }
  });
  
  // Test ingredient-specific conversions
  console.log('\n--- Ingredient Conversions ---');
  ingredientConversionTests.forEach(({ input, targetSystem, expected, desc }) => {
    const result = convertUnits(input.qty, input.unit, targetSystem, input.ingredient);
    const qtyMatch = Math.abs(result.quantity - expected.qty) < 5; // Allow some tolerance
    const unitMatch = result.unit === expected.unit;
    
    if (qtyMatch && unitMatch && result.converted) {
      console.log(`✓ ${desc}`);
    } else {
      console.error(`✗ ${desc} - Got: ${result.quantity} ${result.unit}, Expected: ${expected.qty} ${expected.unit}`);
    }
  });
  
  console.log('\nUnit conversion tests completed');
}

export default {
  runUnitConversionTests,
  usToMetricTests,
  metricToUSTests,
  ingredientConversionTests,
  scalingConversionTests
};