import {
  paginationSchema,
  searchQuerySchema,
  searchParamsSchema,
  heartPostSchema,
  heartDeleteSchema,
  mergeHeartsSchema,
  syncCatalogSchema,
  nutritionSchema,
  createCollectionSchema,
  updateCollectionSchema,
  addRecipeToCollectionSchema,
  cloudinaryUploadSchema,
  healthCheckSchema,
} from "./validation";

describe("Validation Schemas", () => {
  describe("paginationSchema", () => {
    it("should validate valid pagination data", () => {
      const validData = { page: 1, perPage: 10 };
      const result = paginationSchema.parse(validData);
      
      expect(result).toEqual(validData);
    });

    it("should apply default values", () => {
      const result = paginationSchema.parse({});
      
      expect(result).toEqual({ page: 1, perPage: 12 });
    });

    it("should coerce string numbers to integers", () => {
      const result = paginationSchema.parse({ page: "2", perPage: "20" });
      
      expect(result).toEqual({ page: 2, perPage: 20 });
    });

    it("should reject invalid page numbers", () => {
      expect(() => paginationSchema.parse({ page: 0 })).toThrow();
      expect(() => paginationSchema.parse({ page: -1 })).toThrow();
    });

    it("should reject invalid perPage values", () => {
      expect(() => paginationSchema.parse({ perPage: 0 })).toThrow();
      expect(() => paginationSchema.parse({ perPage: 101 })).toThrow();
    });
  });

  describe("searchQuerySchema", () => {
    it("should validate valid search query", () => {
      const validData = {
        q: "pasta",
        tags: ["vegetarian", "quick"],
        cuisine: ["italian"],
        time: 30,
        calorieMax: 500,
        calorieMin: 200,
      };
      
      const result = searchQuerySchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it("should handle optional fields", () => {
      const result = searchQuerySchema.parse({});
      expect(result).toEqual({});
    });
  });

  describe("heartPostSchema", () => {
    it("should validate valid heart post data", () => {
      const validData = { recipeId: "recipe-123", deviceId: "device-456" };
      const result = heartPostSchema.parse(validData);
      
      expect(result).toEqual(validData);
    });

    it("should require recipeId", () => {
      expect(() => heartPostSchema.parse({ deviceId: "device-456" })).toThrow();
    });

    it("should allow deviceId to be optional", () => {
      const result = heartPostSchema.parse({ recipeId: "recipe-123" });
      expect(result).toEqual({ recipeId: "recipe-123" });
    });
  });

  describe("heartDeleteSchema", () => {
    it("should validate valid heart delete data", () => {
      const validData = { recipeId: "recipe-123", deviceId: "device-456" };
      const result = heartDeleteSchema.parse(validData);
      
      expect(result).toEqual(validData);
    });

    it("should require recipeId", () => {
      expect(() => heartDeleteSchema.parse({ deviceId: "device-456" })).toThrow();
    });
  });

  describe("mergeHeartsSchema", () => {
    it("should validate valid merge hearts data", () => {
      const validData = { deviceId: "device-456" };
      const result = mergeHeartsSchema.parse(validData);
      
      expect(result).toEqual(validData);
    });

    it("should require deviceId", () => {
      expect(() => mergeHeartsSchema.parse({})).toThrow();
    });
  });

  describe("syncCatalogSchema", () => {
    it("should validate valid sync catalog data", () => {
      const validData = { full: true };
      const result = syncCatalogSchema.parse(validData);
      
      expect(result).toEqual(validData);
    });

    it("should apply default value for full", () => {
      const result = syncCatalogSchema.parse({});
      expect(result).toEqual({ full: false });
    });
  });

  describe("nutritionSchema", () => {
    it("should validate valid nutrition data", () => {
      const validData = { recipeId: "recipe-123", servings: 4 };
      const result = nutritionSchema.parse(validData);
      
      expect(result).toEqual(validData);
    });

    it("should apply default servings value", () => {
      const result = nutritionSchema.parse({ recipeId: "recipe-123" });
      expect(result).toEqual({ recipeId: "recipe-123", servings: 1 });
    });

    it("should coerce string servings to number", () => {
      const result = nutritionSchema.parse({ recipeId: "recipe-123", servings: "2.5" });
      expect(result).toEqual({ recipeId: "recipe-123", servings: 2.5 });
    });

    it("should reject invalid servings", () => {
      expect(() => nutritionSchema.parse({ recipeId: "recipe-123", servings: 0 })).toThrow();
      expect(() => nutritionSchema.parse({ recipeId: "recipe-123", servings: 101 })).toThrow();
    });
  });

  describe("createCollectionSchema", () => {
    it("should validate valid collection data", () => {
      const validData = {
        name: "My Favorites",
        description: "My favorite recipes",
        isPublic: false,
      };
      
      const result = createCollectionSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it("should apply default values", () => {
      const result = createCollectionSchema.parse({ name: "Test" });
      expect(result).toEqual({
        name: "Test",
        isPublic: false,
      });
    });

    it("should reject empty name", () => {
      expect(() => createCollectionSchema.parse({ name: "" })).toThrow();
    });

    it("should reject name that's too long", () => {
      const longName = "a".repeat(101);
      expect(() => createCollectionSchema.parse({ name: longName })).toThrow();
    });
  });

  describe("updateCollectionSchema", () => {
    it("should validate partial collection data", () => {
      const validData = { name: "Updated Name" };
      const result = updateCollectionSchema.parse(validData);
      
      expect(result).toEqual({ ...validData, isPublic: false });
    });

    it("should allow empty object", () => {
      const result = updateCollectionSchema.parse({});
      expect(result).toEqual({ isPublic: false });
    });
  });

  describe("addRecipeToCollectionSchema", () => {
    it("should validate valid add recipe data", () => {
      const validData = {
        collectionId: "123e4567-e89b-12d3-a456-426614174000",
        recipeUri: "recipe-123",
        notes: "Great recipe!",
      };
      
      const result = addRecipeToCollectionSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it("should require collectionId and recipeUri", () => {
      expect(() => addRecipeToCollectionSchema.parse({})).toThrow();
      expect(() => addRecipeToCollectionSchema.parse({ collectionId: "123" })).toThrow();
      expect(() => addRecipeToCollectionSchema.parse({ recipeUri: "recipe-123" })).toThrow();
    });

    it("should validate UUID format for collectionId", () => {
      expect(() => addRecipeToCollectionSchema.parse({
        collectionId: "invalid-uuid",
        recipeUri: "recipe-123",
      })).toThrow();
    });
  });

  describe("cloudinaryUploadSchema", () => {
    it("should validate valid upload data", () => {
      const validData = {
        publicId: "sample-image",
        folder: "recipes",
        transformation: "w_400,h_300",
      };
      
      const result = cloudinaryUploadSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it("should require publicId", () => {
      expect(() => cloudinaryUploadSchema.parse({})).toThrow();
    });
  });

  describe("healthCheckSchema", () => {
    it("should validate valid health check data", () => {
      const validData = {
        timestamp: "2023-01-01T00:00:00.000Z",
        uptime: 123.45,
      };
      
      const result = healthCheckSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it("should allow empty object", () => {
      const result = healthCheckSchema.parse({});
      expect(result).toEqual({});
    });
  });
});