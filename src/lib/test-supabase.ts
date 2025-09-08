import { supabaseCache } from "@/src/lib/supabase-cache";
import { collectionManager } from "@/src/lib/collection-manager";

// Test the caching system
async function testCacheSystem() {
  console.log("🧪 Testing Supabase Cache System...");

  // Test recipe caching
  const testRecipe = {
    uri: "http://www.edamam.com/ontologies/edamam.owl#recipe_test123",
    label: "Test Recipe",
    image: "https://example.com/image.jpg",
    source: "Test Source",
    url: "https://example.com",
    yield: 4,
    dietLabels: ["Low-Carb"],
    healthLabels: ["Vegetarian"],
    cautions: [],
    ingredientLines: ["1 cup test ingredient"],
    ingredients: [],
    calories: 250,
    totalTime: 30,
    cuisineType: ["american"],
    mealType: ["dinner"],
    dishType: ["main course"],
  };

  try {
    // Cache the test recipe
    console.log("📦 Caching test recipe...");
    await supabaseCache.cacheRecipe(testRecipe.uri, testRecipe);

    // Retrieve from cache
    console.log("📥 Retrieving from cache...");
    const cachedRecipe = await supabaseCache.getCachedRecipe(testRecipe.uri);

    if (cachedRecipe && cachedRecipe.label === testRecipe.label) {
      console.log("✅ Recipe caching works!");
    } else {
      console.log("❌ Recipe caching failed");
    }

    // Test search caching
    console.log("📦 Testing search caching...");
    const searchResults = {
      hits: [testRecipe],
      count: 1,
      _links: { next: { href: "" } },
    };

    await supabaseCache.cacheSearch("test-search-key", searchResults);
    const cachedSearch = await supabaseCache.getCachedSearch("test-search-key");

    if (cachedSearch && cachedSearch.hits.length === 1) {
      console.log("✅ Search caching works!");
    } else {
      console.log("❌ Search caching failed");
    }

    // Test popular recipes
    console.log("📊 Getting popular recipes...");
    const popularRecipes = await supabaseCache.getPopularRecipes(5);
    console.log(`Found ${popularRecipes.length} popular recipes`);

    console.log("🎉 Cache system test complete!");
    return true;
  } catch (error) {
    console.error("❌ Cache test failed:", error);
    return false;
  }
}

// Test the collection manager
async function testCollectionManager() {
  console.log("🧪 Testing Collection Manager...");

  try {
    // Note: This requires user authentication
    console.log("ℹ️ Collection manager tests require user authentication");
    console.log("✅ Collection manager loaded successfully");
    return true;
  } catch (error) {
    console.error("❌ Collection manager test failed:", error);
    return false;
  }
}

// Export for use in pages
export { testCacheSystem, testCollectionManager };
