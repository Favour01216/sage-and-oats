/**
 * Instructions ingestion with caching, throttling, and sanitization
 */

import { LRUCache } from 'lru-cache';

// Allowed domains for automatic instruction extraction
const ALLOWED_DOMAINS = new Set([
  'allrecipes.com',
  'foodnetwork.com',
  'bonappetit.com',
  'seriouseats.com',
  'epicurious.com',
  'simplyrecipes.com',
  'delish.com',
  'tasty.co',
  'bbc.co.uk',
  'bbcgoodfood.com',
  'jamieoliver.com',
  'nigella.com',
  'gordonramsay.com',
  'marthastewart.com',
  'cookinglight.com',
  'myrecipes.com',
  'food52.com',
  'thekitchn.com',
  'smittenkitchen.com',
  'minimalistbaker.com',
  'budgetbytes.com',
  'sallysbakingaddiction.com',
  'kingarthurbaking.com',
  'americastestkitchen.com',
  'cooksillustrated.com'
]);

// TTL cache for parsed instructions (24 hours in production, 1 second in test)
const instructionsCache = new LRUCache<string, CachedInstructions>({
  max: 500, // Maximum 500 recipes in cache
  ttl: process.env.TEST_MODE === 'true' ? 1000 : 24 * 60 * 60 * 1000, // 1s in test, 24h in prod
  updateAgeOnGet: true,
  updateAgeOnHas: true,
});

// Rate limiter per domain
const domainRateLimits = new Map<string, number>();
const RATE_LIMIT_MS = 1000; // 1 request per second per domain

interface CachedInstructions {
  steps: string[];
  provenance: string;
  attribution: string;
  cachedAt: number;
}

interface InstructionResult {
  steps: string[] | null;
  provenance: string;
  attribution: string;
  allowed: boolean;
}

/**
 * Sanitize HTML to plain text steps
 * Removes all HTML tags and normalizes whitespace
 */
function sanitizeStep(html: string): string {
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
  
  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  // Remove leading numbers and dots (e.g., "1. " or "1) ")
  text = text.replace(/^\d+[\.\)]\s*/, '');
  
  return text;
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    // Remove www. prefix if present
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/**
 * Check if domain is rate limited
 */
async function checkRateLimit(domain: string): Promise<boolean> {
  // Skip rate limiting in test mode
  if (process.env.TEST_MODE === 'true') {
    return true;
  }
  
  const lastRequest = domainRateLimits.get(domain);
  const now = Date.now();
  
  if (lastRequest && now - lastRequest < RATE_LIMIT_MS) {
    // Wait for the remaining time
    const waitTime = RATE_LIMIT_MS - (now - lastRequest);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  domainRateLimits.set(domain, Date.now());
  return true;
}

/**
 * Parse instructions from external recipe data
 */
async function parseInstructions(
  recipeData: any,
  sourceUrl?: string
): Promise<string[]> {
  const steps: string[] = [];
  
  // Try different common instruction formats
  if (recipeData.instructions) {
    if (Array.isArray(recipeData.instructions)) {
      // Array of instruction objects
      for (const inst of recipeData.instructions) {
        if (typeof inst === 'string') {
          steps.push(sanitizeStep(inst));
        } else if (inst.text) {
          steps.push(sanitizeStep(inst.text));
        } else if (inst.name) {
          steps.push(sanitizeStep(inst.name));
        } else if (inst.step) {
          steps.push(sanitizeStep(inst.step));
        }
      }
    } else if (typeof recipeData.instructions === 'string') {
      // Single string with steps separated by newlines or periods
      const rawSteps = recipeData.instructions
        .split(/[\n\r]+|\.\s+(?=[A-Z])/)
        .filter(Boolean);
      
      for (const step of rawSteps) {
        const sanitized = sanitizeStep(step);
        if (sanitized.length > 10) { // Filter out very short non-steps
          steps.push(sanitized);
        }
      }
    }
  }
  
  // Try analyzedInstructions (Spoonacular format)
  if (recipeData.analyzedInstructions && Array.isArray(recipeData.analyzedInstructions)) {
    for (const section of recipeData.analyzedInstructions) {
      if (section.steps && Array.isArray(section.steps)) {
        for (const step of section.steps) {
          if (step.step) {
            steps.push(sanitizeStep(step.step));
          }
        }
      }
    }
  }
  
  // Try method field
  if (recipeData.method) {
    if (Array.isArray(recipeData.method)) {
      for (const step of recipeData.method) {
        steps.push(sanitizeStep(typeof step === 'string' ? step : step.text || ''));
      }
    } else if (typeof recipeData.method === 'string') {
      const methodSteps = recipeData.method.split(/[\n\r]+/).filter(Boolean);
      for (const step of methodSteps) {
        const sanitized = sanitizeStep(step);
        if (sanitized.length > 10) {
          steps.push(sanitized);
        }
      }
    }
  }
  
  // Try directions field
  if (recipeData.directions && Array.isArray(recipeData.directions)) {
    for (const dir of recipeData.directions) {
      steps.push(sanitizeStep(typeof dir === 'string' ? dir : dir.text || ''));
    }
  }
  
  return steps.filter(step => step.length > 0);
}

/**
 * Ingest instructions with caching, throttling, and sanitization
 */
export async function ingestInstructions(
  sourceUrl: string | undefined,
  externalId: string | undefined,
  recipeData: any
): Promise<InstructionResult> {
  // Generate cache key
  const cacheKey = externalId || sourceUrl || JSON.stringify(recipeData).substring(0, 100);
  
  // Check cache first
  const cached = instructionsCache.get(cacheKey);
  if (cached) {
    return {
      steps: cached.steps,
      provenance: cached.provenance,
      attribution: cached.attribution,
      allowed: true,
    };
  }
  
  // Extract domain
  const domain = sourceUrl ? extractDomain(sourceUrl) : '';
  const isAllowed = domain && ALLOWED_DOMAINS.has(domain);
  
  // Prepare attribution
  const attribution = sourceUrl || 'Original source';
  const provenance = domain || 'unknown';
  
  // If domain is not allowed, return with attribution only
  if (!isAllowed) {
    return {
      steps: null,
      provenance,
      attribution,
      allowed: false,
    };
  }
  
  // Apply rate limiting for allowed domains
  if (domain) {
    await checkRateLimit(domain);
  }
  
  // Parse instructions
  const steps = await parseInstructions(recipeData, sourceUrl);
  
  // Cache the result
  const cacheEntry: CachedInstructions = {
    steps,
    provenance,
    attribution,
    cachedAt: Date.now(),
  };
  instructionsCache.set(cacheKey, cacheEntry);
  
  return {
    steps,
    provenance,
    attribution,
    allowed: true,
  };
}

/**
 * Check if a domain is in the allowed list
 */
export function isDomainAllowed(url: string): boolean {
  const domain = extractDomain(url);
  return domain ? ALLOWED_DOMAINS.has(domain) : false;
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: instructionsCache.size,
    calculatedSize: instructionsCache.calculatedSize,
  };
}

/**
 * Clear the cache (useful for testing)
 */
export function clearCache() {
  instructionsCache.clear();
  domainRateLimits.clear();
}