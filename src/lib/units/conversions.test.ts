/**
 * Tests for unit conversion utilities
 */

import {
  convertUnit,
  getIngredientDensity,
  convertToSystem,
  formatQuantity,
  processQuantity,
} from './conversions';

describe('getIngredientDensity', () => {
  test('returns correct density for known ingredients', () => {
    expect(getIngredientDensity('flour')).toBe(120);
    expect(getIngredientDensity('sugar')).toBe(200);
    expect(getIngredientDensity('brown sugar')).toBe(220);
    expect(getIngredientDensity('butter')).toBe(227);
  });
  
  test('handles case insensitive matching', () => {
    expect(getIngredientDensity('FLOUR')).toBe(120);
    expect(getIngredientDensity('All-Purpose Flour')).toBe(120);
  });
  
  test('returns null for unknown ingredients', () => {
    expect(getIngredientDensity('unicorn dust')).toBeNull();
  });
});

describe('convertUnit', () => {
  // Volume to volume conversions
  test('converts between volume units', () => {
    // 240 ml ↔ 1 cup (approximately)
    const mlToCup = convertUnit(240, 'ml', 'cup');
    expect(mlToCup).toBeCloseTo(1.014, 2);
    
    const cupToMl = convertUnit(1, 'cup', 'ml');
    expect(cupToMl).toBeCloseTo(236.588, 1);
    
    // 1 cup = 16 tbsp
    expect(convertUnit(1, 'cup', 'tbsp')).toBeCloseTo(16, 1);
    
    // 1 tbsp = 3 tsp
    expect(convertUnit(1, 'tbsp', 'tsp')).toBeCloseTo(3, 1);
  });
  
  // Weight to weight conversions
  test('converts between weight units', () => {
    expect(convertUnit(1000, 'g', 'kg')).toBe(1);
    expect(convertUnit(1, 'lb', 'oz')).toBeCloseTo(16, 1);
    expect(convertUnit(454, 'g', 'lb')).toBeCloseTo(1, 1);
  });
  
  // Volume to weight with density
  test('converts volume to weight using density', () => {
    // 1 cup flour = 120g
    const cupToGrams = convertUnit(1, 'cup', 'g', 'flour');
    expect(cupToGrams).toBeCloseTo(120, 1);
    
    // 120g flour = 1 cup
    const gramsToCup = convertUnit(120, 'g', 'cup', 'flour');
    expect(gramsToCup).toBeCloseTo(1, 1);
    
    // 1 cup butter = 227g
    expect(convertUnit(1, 'cup', 'g', 'butter')).toBeCloseTo(227, 1);
  });
  
  test('returns null for impossible conversions', () => {
    // Volume to weight without ingredient
    expect(convertUnit(1, 'cup', 'g')).toBeNull();
    
    // Unknown units
    expect(convertUnit(1, 'invalid', 'cup')).toBeNull();
  });
});

describe('convertToSystem', () => {
  test('converts metric to US', () => {
    const result = convertToSystem(250, 'ml', 'us');
    expect(result.value).toBeCloseTo(1.06, 1); // About 1 cup (250ml ≈ 1.06 cups)
    expect(result.unit).toBe('cup');
    
    const gToOz = convertToSystem(100, 'g', 'us');
    expect(gToOz.value).toBeCloseTo(3.527, 1);
    expect(gToOz.unit).toBe('oz');
  });
  
  test('converts US to metric', () => {
    const cupToMl = convertToSystem(1, 'cup', 'metric');
    expect(cupToMl.value).toBeCloseTo(236.588, 1);
    expect(cupToMl.unit).toBe('ml');
    
    const lbToG = convertToSystem(1, 'lb', 'metric');
    expect(lbToG.value).toBeCloseTo(453.592, 1);
    expect(lbToG.unit).toBe('g');
  });
  
  test('returns original if already in target system', () => {
    const result = convertToSystem(100, 'g', 'metric');
    expect(result.value).toBe(100);
    expect(result.unit).toBe('g');
  });
});

describe('formatQuantity', () => {
  test('formats US measurements with fractions', () => {
    expect(formatQuantity(1.5, 'cup', 'us')).toBe('1 ½ cups');
    expect(formatQuantity(0.75, 'cup', 'us')).toBe('¾ cup');
    expect(formatQuantity(1, 'cup', 'us')).toBe('1 cup');
    expect(formatQuantity(2, 'cup', 'us')).toBe('2 cups');
  });
  
  test('formats metric measurements with decimals', () => {
    expect(formatQuantity(250, 'ml', 'metric')).toBe('250 ml');
    expect(formatQuantity(1.5, 'l', 'metric')).toBe('1.5 l');
    expect(formatQuantity(100, 'g', 'metric')).toBe('100 g');
  });
});

describe('processQuantity', () => {
  test('scales and converts correctly', () => {
    // 1 cup × 1.5 → "1 1/2 cups"
    const scaled = processQuantity(1, 'cup', 1.5, 'us');
    expect(scaled).toBe('1 ½ cups');
    
    // 100g × 2 → "200 g"
    const scaledMetric = processQuantity(100, 'g', 2, 'metric');
    expect(scaledMetric).toBe('200 g');
  });
  
  test('handles cross-system conversions', () => {
    // 1 cup flour to metric (scaled by 2)
    const result = processQuantity(1, 'cup', 2, 'metric', 'flour');
    // 2 cups = ~473ml
    expect(result).toMatch(/473/);
  });
});