# Instruction Ingestion System

This document describes the compliant instruction ingestion system for recipe steps.

## Overview

The instruction ingestion system provides a legal and ethical way to incorporate recipe instructions from external sources while respecting copyright and terms of service.

## Key Principles

1. **Allowlist-Based**: Only domains explicitly added to the allowlist are processed
2. **Permission Required**: Only add domains where you have explicit permission or they allow re-use
3. **Attribution**: All external instructions include proper attribution
4. **Fallback**: If instructions can't be ingested, users are directed to the source

## Architecture

### Core Components

- `/src/lib/instructions/ingest.ts` - Main ingestion logic and allowlist management
- `/src/lib/instructions/server.ts` - Server-side functions for LIVE and MIRROR modes
- `/src/lib/instructions/parsers/` - Domain-specific parsers (create only with permission)
- `/src/components/AttributionBar.tsx` - Attribution display component

### Modes

#### LIVE Mode
- Instructions are fetched when a user opens a recipe page
- If allowed domain: steps are ingested and stored for future use
- If not allowed: attribution link to source is shown

#### MIRROR Mode
- Instructions are ingested during catalog sync operations
- Only processes recipes from allowed domains
- Stores steps in `recipe_steps` table with provenance tracking

## Configuration

### Adding Allowed Domains

**IMPORTANT**: Only add domains to `ALLOWED_INSTRUCTION_SOURCES` if you have:
- Explicit written permission from the domain owner
- Verified that their terms of service allow re-use
- Confirmed they provide a public API for this purpose

```typescript
// In /src/lib/instructions/ingest.ts
const ALLOWED_INSTRUCTION_SOURCES = [
  // Only add with explicit permission!
  // 'api.example-food-blog.com',
  // 'public-recipes.gov',
];
```

### Creating Domain Parsers

1. Only create parsers for domains in the allowlist
2. Use the template in `/src/lib/instructions/parsers/example.ts`
3. Name the file with the domain name (e.g., `example-site.com.ts`)
4. Implement proper HTML parsing with cheerio
5. Extract steps and timer information
6. Handle errors gracefully

## Database Schema

Instructions are stored in the `recipe_steps` table:

```sql
CREATE TABLE recipe_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  step_number int NOT NULL,
  text text NOT NULL,
  timer_seconds int,
  provenance jsonb -- Tracks source and ingestion method
);
```

## Usage

### In Recipe Pages

The `StepList` component automatically:
- Shows ingested instructions with attribution
- Displays "View full instructions" link for non-allowed sources
- Provides proper attribution for all external content

### Server-Side Integration

```typescript
import { ingestInstructionsLive } from '@/src/lib/instructions/server';

// In recipe page loader
const recipeWithInstructions = await ingestInstructionsLive(recipe);
```

## Compliance Notes

- **Copyright Respect**: Never scrape without permission
- **Terms of Service**: Always check and comply with site terms
- **Attribution**: Always provide clear attribution for external content
- **Fair Use**: Consider fair use implications in your jurisdiction
- **API Preference**: Prefer official APIs over scraping when available

## Legal Disclaimer

This system is designed to help you create a compliant instruction ingestion system. However:

- You are responsible for ensuring you have proper permissions
- You must comply with applicable copyright laws
- You should consult with legal counsel for your specific use case
- The system provides tools but does not grant permissions

## Examples

### Allowed Source (Hypothetical)
```
Recipe from "Public Recipe Database"
Instructions adapted from public-recipes.gov
[View Source] → Links to original recipe
```

### Non-Allowed Source
```
Recipe from "Example Food Blog"
View full instructions at source
[View Source] → Links to original recipe
```

## Future Enhancements

- Support for structured data extraction (JSON-LD)
- Integration with official recipe APIs
- Automated permission checking
- Enhanced attribution tracking