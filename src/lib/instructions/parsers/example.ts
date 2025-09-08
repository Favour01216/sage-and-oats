/**
 * Example domain parser for recipe instructions
 * 
 * This is a template for creating domain-specific parsers.
 * Only create parsers for domains you have explicit permission to scrape.
 */

import { RecipeStep } from "../ingest";

export interface ParsedInstructions {
  steps: RecipeStep[];
}

/**
 * Example parser - DO NOT USE IN PRODUCTION
 * This is just a template showing the expected interface
 */
export default {
  async parseInstructions(sourceUrl: string, externalId?: string): Promise<ParsedInstructions> {
    // This is just an example - actual parsers should:
    // 1. Only be created for domains with explicit permission
    // 2. Use proper HTML parsing (cheerio) to extract steps
    // 3. Handle errors gracefully
    // 4. Extract timer information if available
    
    throw new Error('Example parser - do not use in production');
    
    // Example structure that real parsers should return:
    /*
    return {
      steps: [
        {
          text: "Preheat oven to 350°F",
          timer_seconds: null,
          step_number: 1,
        },
        {
          text: "Bake for 25-30 minutes",
          timer_seconds: 1800, // 30 minutes
          step_number: 2,
        },
      ],
    };
    */
  },
};