/**
 * Tests for nutrition utilities
 */

import {
  calculatePerServing,
  scaleNutrition,
  formatNutritionValue,
  calculateDailyValue,
  extractNutrition,
} from './nutrition';

describe('calculatePerServing', () => {
  test('calculates nutrition per serving correctly', () => {
    const total = {
      calories: 800,
      protein: 40,
      carbs: 100,
      fat: 32,
      fiber: 8,
      sugar: 20,
      sodium: 1200,
      cholesterol: 120,
      saturatedFat: 12,
      transFat: 0,
    };
    
    // 2 servings
    const perServing2 = calculatePerServing(total, 2);
    expect(perServing2.calories).toBe(400);
    expect(perServing2.protein).toBe(20);
    expect(perServing2.carbs).toBe(50);
    expect(perServing2.fat).toBe(16);
    
    // 4 servings (should halve the per-serving values)
    const perServing4 = calculatePerServing(total, 4);
    expect(perServing4.calories).toBe(200);
    expect(perServing4.protein).toBe(10);
    expect(perServing4.carbs).toBe(25);
    expect(perServing4.fat).toBe(8);
  });
  
  test('handles missing nutrition data', () => {
    const partial = {
      calories: 300,
      protein: 15,
    };
    
    const perServing = calculatePerServing(partial, 2);
    expect(perServing.calories).toBe(150);
    expect(perServing.protein).toBe(7.5);
    expect(perServing.carbs).toBe(0);
    expect(perServing.fat).toBe(0);
  });
  
  test('handles zero or negative servings', () => {
    const total = { calories: 400 };
    
    const perServing0 = calculatePerServing(total, 0);
    expect(perServing0.calories).toBe(400); // Uses 1 as minimum
    
    const perServingNeg = calculatePerServing(total, -2);
    expect(perServingNeg.calories).toBe(400); // Uses 1 as minimum
  });
});

describe('scaleNutrition', () => {
  test('scales nutrition data correctly', () => {
    const original = {
      calories: 200,
      protein: 10,
      carbs: 30,
      fat: 8,
    };
    
    const scaled2x = scaleNutrition(original, 2);
    expect(scaled2x.calories).toBe(400);
    expect(scaled2x.protein).toBe(20);
    expect(scaled2x.carbs).toBe(60);
    expect(scaled2x.fat).toBe(16);
    
    const scaledHalf = scaleNutrition(original, 0.5);
    expect(scaledHalf.calories).toBe(100);
    expect(scaledHalf.protein).toBe(5);
    expect(scaledHalf.carbs).toBe(15);
    expect(scaledHalf.fat).toBe(4);
  });
  
  test('preserves undefined values', () => {
    const partial = {
      calories: 300,
      protein: undefined,
      carbs: 40,
    };
    
    const scaled = scaleNutrition(partial, 2);
    expect(scaled.calories).toBe(600);
    expect(scaled.protein).toBeUndefined();
    expect(scaled.carbs).toBe(80);
  });
});

describe('formatNutritionValue', () => {
  test('formats values with units', () => {
    expect(formatNutritionValue(25, 'g')).toBe('25g');
    expect(formatNutritionValue(1200, 'mg')).toBe('1200mg');
    expect(formatNutritionValue(250, ' kcal')).toBe('250 kcal');
  });
  
  test('handles precision', () => {
    expect(formatNutritionValue(25.7, 'g', 0)).toBe('26g');
    expect(formatNutritionValue(25.7, 'g', 1)).toBe('25.7g');
    expect(formatNutritionValue(25.789, 'g', 2)).toBe('25.79g');
  });
  
  test('handles undefined values', () => {
    expect(formatNutritionValue(undefined)).toBe('—');
    expect(formatNutritionValue(null as any)).toBe('—');
  });
});

describe('calculateDailyValue', () => {
  test('calculates daily value percentages', () => {
    expect(calculateDailyValue(500, 'calories')).toBe(25); // 500/2000 = 25%
    expect(calculateDailyValue(25, 'protein')).toBe(50); // 25/50 = 50%
    expect(calculateDailyValue(39, 'fat')).toBe(50); // 39/78 = 50%
    expect(calculateDailyValue(14, 'fiber')).toBe(50); // 14/28 = 50%
  });
  
  test('returns 0 for nutrients without daily values', () => {
    expect(calculateDailyValue(5, 'transFat')).toBe(0);
  });
});

describe('extractNutrition', () => {
  test('extracts from nutrition field', () => {
    const recipe = {
      nutrition: {
        calories: 350,
        protein: 20,
        carbs: 45,
        fat: 12,
      },
    };
    
    const nutrition = extractNutrition(recipe);
    expect(nutrition.calories).toBe(350);
    expect(nutrition.protein).toBe(20);
    expect(nutrition.carbs).toBe(45);
    expect(nutrition.fat).toBe(12);
  });
  
  test('extracts from array format', () => {
    const recipe = {
      nutrition: [
        { name: 'Calories', amount: 280 },
        { name: 'Protein', amount: 15 },
        { name: 'Carbohydrates', amount: 35 },
        { name: 'Total Fat', amount: 10 },
      ],
    };
    
    const nutrition = extractNutrition(recipe);
    expect(nutrition.calories).toBe(280);
    expect(nutrition.protein).toBe(15);
    expect(nutrition.carbs).toBe(35);
    expect(nutrition.fat).toBe(10);
  });
  
  test('extracts from individual fields', () => {
    const recipe = {
      calories: 400,
      protein: 25,
      carbohydrates: 50,
      fat: 15,
    };
    
    const nutrition = extractNutrition(recipe);
    expect(nutrition.calories).toBe(400);
    expect(nutrition.protein).toBe(25);
    expect(nutrition.carbs).toBe(50);
    expect(nutrition.fat).toBe(15);
  });
  
  test('handles various field names', () => {
    const recipe = {
      nutritionInfo: {
        kcal: 300,
        proteinContent: 18,
        carbohydrateContent: 40,
        fatContent: 8,
        fiberContent: 5,
      },
    };
    
    const nutrition = extractNutrition(recipe);
    expect(nutrition.calories).toBe(300);
    expect(nutrition.protein).toBe(18);
    expect(nutrition.carbs).toBe(40);
    expect(nutrition.fat).toBe(8);
    expect(nutrition.fiber).toBe(5);
  });
});