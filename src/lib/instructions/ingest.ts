/**
 * Instruction Ingestion System
 * 
 * This system provides a compliant, pluggable approach to ingesting recipe instructions
 * from external sources. It respects copyright and terms of service by only processing
 * content from explicitly allowed domains.
 */

import { RecipeNormalized } from "../catalog";

// Allowlist of domains we have permission to process instructions from
// Only add domains here if you have explicit permission or they allow re-use
const ALLOWED_INSTRUCTION_SOURCES = [
  // Add domains here only with explicit permission
  // Example: 'api.example-food-blog.com',
  // Example: 'public-recipes.gov',
];

export interface RecipeStep {
  text: string;
  timer_seconds?: number | null;
  step_number: number;
}

export interface IngestedInstructions {
  steps: RecipeStep[];
  provenance: {
    source_domain: string;
    ingested_at: string;
    method: 'api' | 'parser';
  };
}

/**
 * Check if a source URL is in our allowlist
 */
export function isSourceAllowed(sourceUrl: string): boolean {
  if (!sourceUrl) return false;
  
  try {
    const url = new URL(sourceUrl);
    const hostname = url.hostname.toLowerCase();
    
    return ALLOWED_INSTRUCTION_SOURCES.some(allowed => 
      hostname === allowed.toLowerCase() || 
      hostname.endsWith(`.${allowed.toLowerCase()}`)
    );
  } catch {
    return false;
  }
}

/**
 * Extract domain from URL for provenance tracking
 */
export function extractDomain(sourceUrl: string): string | null {
  try {
    const url = new URL(sourceUrl);
    return url.hostname;
  } catch {
    return null;
  }
}

/**
 * Main function to fetch instructions for a recipe
 */
export async function fetchInstructionsForRecipe({
  recipe,
  sourceUrl,
  externalId,
}: {
  recipe?: RecipeNormalized;
  sourceUrl?: string;
  externalId?: string;
}): Promise<IngestedInstructions | null> {
  
  // 1. If normalized recipe already includes steps, return them
  if (recipe?.steps && recipe.steps.length > 0) {
    return {
      steps: recipe.steps.map((step, index) => ({
        text: step.text,
        timer_seconds: step.timer_seconds,
        step_number: index + 1,
      })),
      provenance: {
        source_domain: 'normalized',
        ingested_at: new Date().toISOString(),
        method: 'api',
      },
    };
  }

  // 2. Check if source URL is in allowlist
  if (!sourceUrl || !isSourceAllowed(sourceUrl)) {
    console.log(`Source ${sourceUrl} not in allowlist, skipping instruction ingestion`);
    return null;
  }

  // 3. Use domain-specific parser if available
  const domain = extractDomain(sourceUrl);
  if (!domain) {
    return null;
  }

  try {
    // Dynamic import of domain-specific parser
    const parserModule = await import(`./parsers/${domain}.ts`);
    const parser = parserModule.default;
    
    const instructions = await parser.parseInstructions(sourceUrl, externalId);
    
    return {
      steps: instructions.steps,
      provenance: {
        source_domain: domain,
        ingested_at: new Date().toISOString(),
        method: 'parser',
      },
    };
  } catch (error) {
    console.log(`No parser found for domain ${domain} or parsing failed:`, error);
    return null;
  }
}

/**
 * Store instructions in Supabase (for mirror mode)
 */
export async function storeInstructionsInDB(
  recipeId: string,
  instructions: IngestedInstructions,
  supabase: any
): Promise<void> {
  try {
    // Delete existing steps for this recipe
    await supabase
      .from('recipe_steps')
      .delete()
      .eq('recipe_id', recipeId);

    // Insert new steps
    const stepsToInsert = instructions.steps.map(step => ({
      recipe_id: recipeId,
      step_number: step.step_number,
      text: step.text,
      timer_seconds: step.timer_seconds,
    }));

    const { error } = await supabase
      .from('recipe_steps')
      .insert(stepsToInsert);

    if (error) {
      throw error;
    }

    console.log(`Stored ${instructions.steps.length} steps for recipe ${recipeId}`);
  } catch (error) {
    console.error('Failed to store instructions in DB:', error);
    throw error;
  }
}

/**
 * Get attribution info for a recipe
 */
export function getAttributionInfo(sourceUrl: string | null): {
  needsAttribution: boolean;
  attributionText?: string;
  sourceLink?: string;
} {
  if (!sourceUrl) {
    return { needsAttribution: false };
  }

  const domain = extractDomain(sourceUrl);
  const isAllowed = isSourceAllowed(sourceUrl);

  if (isAllowed && domain) {
    return {
      needsAttribution: true,
      attributionText: `Instructions adapted from ${domain}`,
      sourceLink: sourceUrl,
    };
  }

  return {
    needsAttribution: true,
    attributionText: `View full instructions at source`,
    sourceLink: sourceUrl,
  };
}