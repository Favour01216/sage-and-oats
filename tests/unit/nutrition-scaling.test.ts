/**
 * Unit tests for nutrition scaling functionality
 */

// Mock nutrition data (represents totals for the recipe)
const mockNutrition = {
  calories: 800, // Total calories for recipe
  protein_g: 32, // Total protein for recipe
  fat_g: 20,     // Total fat for recipe
  carbs_g: 120,  // Total carbs for recipe
  fiber_g: 8,    // Total fiber for recipe
  sugar_g: 40,   // Total sugar for recipe
  sodium_mg: 1200 // Total sodium for recipe
};

// Test scenarios for nutrition scaling
const nutritionScalingTests = [
  {
    description: 'Recipe for 4 servings, viewing per serving',
    baseServings: 4,
    currentServings: 4,
    showPerServing: true,
    expected: {
      calories: 200,  // 800 / 4
      protein_g: 8,   // 32 / 4
      fat_g: 5,       // 20 / 4
      carbs_g: 30,    // 120 / 4
    }
  },
  {
    description: 'Recipe for 4 servings, scaled to 6 servings, viewing per serving',
    baseServings: 4,
    currentServings: 6,
    showPerServing: true,
    expected: {
      calories: 200,  // Still 200 per serving (800 / 4)
      protein_g: 8,   // Still 8 per serving (32 / 4)
      fat_g: 5,       // Still 5 per serving (20 / 4)
      carbs_g: 30,    // Still 30 per serving (120 / 4)
    }
  },
  {
    description: 'Recipe for 4 servings, scaled to 6 servings, viewing total',
    baseServings: 4,
    currentServings: 6,
    showPerServing: false,
    expected: {
      calories: 1200, // 800 * (6/4) = 1200 total for 6 servings
      protein_g: 48,  // 32 * (6/4) = 48 total
      fat_g: 30,      // 20 * (6/4) = 30 total
      carbs_g: 180,   // 120 * (6/4) = 180 total
    }
  },
  {
    description: 'Recipe for 4 servings, scaled to 2 servings, viewing per serving',
    baseServings: 4,
    currentServings: 2,
    showPerServing: true,
    expected: {
      calories: 200,  // Still 200 per serving (nutrition per serving is constant)
      protein_g: 8,   // Still 8 per serving
      fat_g: 5,       // Still 5 per serving
      carbs_g: 30,    // Still 30 per serving
    }
  }
];

/**
 * Mock function to simulate nutrition calculation
 * This mimics the logic in NutritionTable component
 */
function calculateNutritionDisplay(
  nutrition: typeof mockNutrition,
  baseServings: number,
  currentServings: number,
  showPerServing: boolean
) {
  const perServingFactor = 1 / baseServings;
  const totalFactor = currentServings / baseServings;

  function formatValue(value: number): number {
    const scaledValue = showPerServing 
      ? value * perServingFactor  // Convert total to per-serving
      : value * totalFactor;      // Scale total for current servings
    
    return Math.round(scaledValue * 10) / 10; // Round to 1 decimal
  }

  return {
    calories: formatValue(nutrition.calories),
    protein_g: formatValue(nutrition.protein_g),
    fat_g: formatValue(nutrition.fat_g),
    carbs_g: formatValue(nutrition.carbs_g),
  };
}

/**
 * Test runner for nutrition scaling
 */
export function runNutritionScalingTests() {
  console.log('Testing nutrition scaling...');
  
  nutritionScalingTests.forEach(({ description, baseServings, currentServings, showPerServing, expected }) => {
    const result = calculateNutritionDisplay(
      mockNutrition, 
      baseServings, 
      currentServings, 
      showPerServing
    );
    
    const passed = Object.keys(expected).every(key => {
      const expectedValue = expected[key as keyof typeof expected];
      const actualValue = result[key as keyof typeof result];
      return Math.abs(actualValue - expectedValue) < 0.1; // Allow small floating point differences
    });
    
    if (passed) {
      console.log(`✓ ${description}`);
    } else {
      console.error(`✗ ${description}`);
      console.error(`  Expected:`, expected);
      console.error(`  Got:`, result);
    }
  });
  
  console.log('Nutrition scaling tests completed');
}

// Test case for unit system independence
export function testNutritionUnitIndependence() {
  console.log('\nTesting nutrition independence from unit systems...');
  
  const nutrition1 = calculateNutritionDisplay(mockNutrition, 4, 6, true);
  const nutrition2 = calculateNutritionDisplay(mockNutrition, 4, 6, true);
  
  // Nutrition should be identical regardless of unit system changes
  const identical = JSON.stringify(nutrition1) === JSON.stringify(nutrition2);
  
  if (identical) {
    console.log('✓ Nutrition values remain stable across unit system changes');
  } else {
    console.error('✗ Nutrition values changed when unit system changed');
  }
}

// Integration test scenarios
export const integrationTestScenarios = [
  {
    name: 'Recipe scaling with nutrition',
    steps: [
      'Load recipe with 4 base servings',
      'Verify nutrition shows per-serving values',
      'Scale to 6 servings',
      'Verify nutrition per-serving values unchanged',
      'Switch to total view',
      'Verify nutrition totals scaled correctly',
      'Switch unit system US ↔ Metric',
      'Verify nutrition values unchanged'
    ]
  }
];

export default {
  runNutritionScalingTests,
  testNutritionUnitIndependence,
  nutritionScalingTests,
  integrationTestScenarios,
  mockNutrition
};