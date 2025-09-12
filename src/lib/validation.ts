import { z } from "zod";

// Common validation schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(12),
});

export const searchQuerySchema = z.object({
  q: z.string().optional(),
  tags: z.array(z.string()).optional(),
  cuisine: z.array(z.string()).optional(),
  time: z.coerce.number().int().min(0).optional(),
  timeMin: z.coerce.number().int().min(0).optional(),
  calorieMax: z.coerce.number().int().min(0).optional(),
  calorieMin: z.coerce.number().int().min(0).optional(),
});

export const searchParamsSchema = searchQuerySchema.merge(paginationSchema);

// Heart API schemas
export const heartPostSchema = z.object({
  recipeId: z.string().min(1, "Recipe ID is required"),
  deviceId: z.string().optional(),
});

export const heartDeleteSchema = z.object({
  recipeId: z.string().min(1, "Recipe ID is required"),
  deviceId: z.string().optional(),
});

// Merge hearts schema
export const mergeHeartsSchema = z.object({
  deviceId: z.string().min(1, "Device ID is required"),
});

// Sync catalog schema
export const syncCatalogSchema = z.object({
  full: z.boolean().default(false),
});

// Nutrition API schema
export const nutritionSchema = z.object({
  recipeId: z.string().min(1, "Recipe ID is required"),
  servings: z.coerce.number().min(0.1).max(100).default(1),
});

// Collection schemas
export const createCollectionSchema = z.object({
  name: z.string().min(1, "Collection name is required").max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(false),
});

export const updateCollectionSchema = createCollectionSchema.partial();

export const addRecipeToCollectionSchema = z.object({
  collectionId: z.string().uuid("Invalid collection ID"),
  recipeUri: z.string().min(1, "Recipe URI is required"),
  notes: z.string().max(500).optional(),
});

// Cloudinary upload schema
export const cloudinaryUploadSchema = z.object({
  publicId: z.string().min(1, "Public ID is required"),
  folder: z.string().optional(),
  transformation: z.string().optional(),
});

// Health check schema
export const healthCheckSchema = z.object({
  timestamp: z.string().optional(),
  uptime: z.number().optional(),
});

// Type exports for use in API routes
export type PaginationParams = z.infer<typeof paginationSchema>;
export type SearchParams = z.infer<typeof searchParamsSchema>;
export type HeartPostData = z.infer<typeof heartPostSchema>;
export type HeartDeleteData = z.infer<typeof heartDeleteSchema>;
export type MergeHeartsData = z.infer<typeof mergeHeartsSchema>;
export type SyncCatalogData = z.infer<typeof syncCatalogSchema>;
export type NutritionData = z.infer<typeof nutritionSchema>;
export type CreateCollectionData = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionData = z.infer<typeof updateCollectionSchema>;
export type AddRecipeToCollectionData = z.infer<typeof addRecipeToCollectionSchema>;
export type CloudinaryUploadData = z.infer<typeof cloudinaryUploadSchema>;
export type HealthCheckData = z.infer<typeof healthCheckSchema>;