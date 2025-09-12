# Sage & Oat 🥗

A modern, accessible recipe platform built with Next.js 15, Supabase, and Algolia. Features include instant search, cook mode with timers, and comprehensive nutrition data.

## 🏭 Production-Ready Features

This application has been enhanced with industry-standard production practices:

- **🔒 Security**: Comprehensive security headers, input validation with Zod, rate limiting, and secure API patterns
- **📊 Monitoring**: Structured logging with request IDs, health checks, and error tracking
- **⚡ Performance**: ISR caching, image optimization, and Lighthouse CI with 90+ performance scores
- **♿ Accessibility**: WCAG AA compliance, focus management, and automated a11y testing
- **🧪 Testing**: 80%+ test coverage with unit tests, E2E tests, and accessibility checks
- **🔧 Code Quality**: Strict TypeScript, ESLint with security rules, Prettier formatting, and automated dependency updates
- **📚 Documentation**: Comprehensive docs, security policy, contributing guidelines, and PR templates

## ✨ Features

- **Instant Search**: Powered by Algolia with filters for tags, cuisine, cook time, calories, and ratings
- **Cook Mode**: Step-by-step cooking with timers, progress tracking, and localStorage persistence
- **Hearts System**: Save recipes anonymously or with user accounts, automatic merging on login
- **Nutrition Data**: Per-serving macros via Edamam API with proper disclaimers
- **SEO Optimized**: JSON-LD structured data, sitemap, and meta tags
- **Accessibility**: WCAG AA compliant with keyboard navigation and screen reader support
- **Performance**: Optimized images, lazy loading, and Lighthouse targets (Perf ≥ 90, A11y ≥ 95)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account
- Algolia account
- Edamam account (for nutrition data)
- Cloudinary account (for image uploads)

### 1. Clone & Install

```bash
git clone <repository-url>
cd sage-and-oat
npm install
```

### 2. Environment Setup

Copy `.env.local.example` to `.env.local` and fill in your API keys:

```bash
# Site URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Edamam Nutrition API
EDAMAM_APP_ID=your_app_id
EDAMAM_APP_KEY=your_app_key

# Algolia Search
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_search_key
ALGOLIA_ADMIN_KEY=your_admin_key
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL migration from `supabase/migrations/001_initial_schema.sql`
3. The schema includes:
   - Recipes with tags, cuisine, and metadata
   - Ingredients with quantities and units
   - Cooking steps with optional timers
   - Nutrition data per serving
   - Hearts system for user engagement

### 4. Development

```bash
npm run dev
```

Visit `http://localhost:3000` and `/dev/tw` to verify Tailwind is working.

## 🛠️ Development Workflow

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues automatically
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run typecheck        # Run TypeScript type checking

# Testing
npm run test:unit        # Run unit tests with coverage
npm run test             # Run Playwright E2E tests
npm run test:ui          # Run Playwright with UI

# Database
npm run db:reset         # Reset database (development only)
npm run db:seed          # Seed database with sample data
```

### Pre-commit Hooks

This project uses Husky to enforce code quality:

- **Pre-commit**: Runs ESLint, Prettier, and TypeScript checks on staged files
- **Commit-msg**: Enforces Conventional Commits format

### Code Standards

- **TypeScript**: Strict mode enabled with `noUncheckedIndexedAccess` and `noImplicitOverride`
- **ESLint**: Comprehensive rules including security, accessibility, and code quality
- **Prettier**: Consistent formatting with Tailwind CSS plugin
- **Commits**: Must follow Conventional Commits format (e.g., `feat: add new feature`)

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Search**: Algolia with React InstantSearch
- **Images**: Cloudinary with Next.js Image optimization
- **Nutrition**: Edamam API for recipe analysis
- **Testing**: Playwright for E2E tests

### Key Components

- **Search**: `/search` - Instant search with filters and URL state persistence
- **Recipes**: `/recipe/[slug]` - Full recipe view with JSON-LD SEO
- **Cook Mode**: `/cook/[slug]` - Interactive cooking experience
- **Admin**: `/admin/recipes` - Recipe management with image uploads

## 🔍 Search & Indexing

### Algolia Setup

1. Create a `recipes` index
2. Configure searchable attributes: `title`, `tags`, `cuisine`, `ingredients_text`
3. Set up faceting for: `tags`, `cuisine`, `total_minutes`, `calories_per_serving`, `avg_rating`

### Reindexing

Recipes are automatically indexed when published. Manual reindex:

```bash
curl -X POST /api/search/reindex
```

### Search Features

- **Debounced Search**: 300ms debounce on search input to reduce API calls
- **URL State Persistence**: Search state saved in URL for sharing and back/forward navigation
- **Empty States**: Helpful UI when no results found with search suggestions
- **Skeleton Loading**: Smooth loading states during search
- **LIVE/MIRROR Modes**: Support for both external API search and local Algolia search

## ❤️ Hearts System

### Anonymous Hearts

- Stored with device ID in localStorage
- Persist across browser sessions
- No user account required

### User Hearts

- Stored with user ID in database
- Sync across devices
- Automatic merging of anonymous hearts on login

### Privacy

- Device IDs are randomly generated
- No personal data collected without consent
- Hearts merge seamlessly when users create accounts

## 🍳 Cook Mode

### Features

- Step-by-step navigation with keyboard shortcuts
- Timer support with audio notifications
- Progress tracking with localStorage persistence
- Wake lock to prevent screen sleep on mobile
- Large touch targets for mobile use

### Keyboard Shortcuts

- `←` / `↑`: Previous step
- `→` / `↓`: Next step
- `Space`: Mark step complete
- `Escape`: Exit cook mode

## 📋 Instruction Ingestion

### Allowlist + Attribution

- **Domain Allowlist**: Instructions are only automatically extracted from trusted recipe sites
- **Rate Limiting**: 1 request per second per domain to respect source sites
- **Caching**: 24-hour TTL cache for parsed instructions
- **Sanitization**: HTML stripped and normalized to plain text steps
- **Attribution**: Always shows source attribution, with "View full instructions" link for non-allowed domains

### Allowed Domains

Major recipe sites including AllRecipes, Food Network, Bon Appétit, Serious Eats, and more. See `src/lib/instructions/ingest.ts` for full list.

## 🔢 Servings & Unit Conversion

### Servings Scaler

- **Accurate Scaling**: `scaleFactor = currentServings / baseServings`
- **Persistence**: Per-recipe servings saved in localStorage
- **Edge Cases**: Handles fractional servings with proper rounding
- **Mixed Fractions**: US measurements display as fractions (1 ½ cups)
- **Minimum**: Enforces minimum of 1 serving

### Unit Conversions

- **US ↔ Metric**: Toggle between measurement systems
- **Density Tables**: Accurate conversions for common ingredients:
  - Flour: 120g/cup
  - Sugar: 200g/cup
  - Brown Sugar: 220g/cup
  - Butter: 227g/cup
- **Smart Formatting**: Fractions for US, decimals for metric
- **Pipeline**: Scale in metric → convert to display units → format

## 🥗 Nutrition Math

### Per-Serving Calculations

- **Single Source of Truth**: Total nutrition stored in `recipe_nutrition` table
- **Dynamic Calculation**: `perServing = totalNutrition / currentServings`
- **Unit Toggle Independent**: Changing units doesn't affect macro values
- **Rounding**: Sensible rounding for display (calories to nearest whole, macros to 0.1g)

### Daily Values

- Based on FDA 2000 calorie reference diet
- Calculated percentages for all major nutrients
- Clear disclaimers about estimation accuracy

## 🧪 Testing

### Test Commands

```bash
# Run all tests (unit + integration + e2e)
npm run test:ci

# Unit tests only
npm run test:unit

# Playwright E2E tests
npm test

# Run with UI
npm run test:ui

# Run headed (visible browser)
npm run test:headed

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix
```

### Test Coverage

- **Unit Tests**: Fraction utils, unit conversions, nutrition calculations, servings scaler
- **Integration Tests**: Hearts persistence and merging, search with debounce
- **E2E Tests**: Search filters and URL state, JSON-LD rendering, cook mode timers
- **Property Tests**: Edge cases for scaling (1.5 × 2 = 3, 0.33 × 3 ≈ 1)

### CI Pipeline

- GitHub Actions workflow for all PRs
- Parallel jobs for lint, typecheck, test, build
- Lighthouse CI with thresholds (Performance ≥ 90, A11y ≥ 95)
- Test artifacts uploaded for debugging

## 📊 Performance

### Lighthouse Targets

- **Performance**: ≥ 90 (Desktop)
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

### Commands

```bash
# Test production
npm run lighthouse:prod

# Test local development
npm run lighthouse:home
```

### Optimization

- Next.js Image with Cloudinary optimization
- Lazy loading for below-the-fold content
- Efficient Supabase queries with proper indexing
- Algolia instant search with debounced input

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy with `next build` command
4. Set `NEXT_PUBLIC_SITE_URL` to your Vercel domain

### Environment Variables

Ensure all production environment variables are set in your deployment platform.

### Database Migration

Run the SQL migration on your production Supabase instance before first deploy.

## 📝 API Endpoints

### Search

- `POST /api/search/reindex` - Reindex recipes to Algolia
- `GET /sitemap.xml` - Dynamic sitemap generation

### Hearts

- `POST /api/heart` - Add/remove heart (upsert)
- `DELETE /api/heart` - Remove heart
- `POST /api/merge-hearts` - Merge device hearts to user account

### Nutrition

- `POST /api/nutrition` - Calculate nutrition via Edamam API

### Cloudinary

- `POST /api/cloudinary/sign` - Generate upload signatures

## 🔑 SOURCE_MODE Usage

### Configuration

Set via environment variable:

```bash
SOURCE_MODE=live  # External API (Edamam/Spoonacular)
SOURCE_MODE=mirror # Local database only
```

### LIVE Mode

- Fetches recipes from external APIs
- Real-time nutrition data
- Requires API keys for Edamam/Spoonacular
- Higher latency but always fresh data

### MIRROR Mode

- Uses cached recipes in Supabase
- Instant response times
- Works offline
- Requires initial data sync

### Key Consistency

- `getRecipeKey()` ensures hearts/ratings work across both modes
- Prefers external ID, falls back to slug
- Consistent keying prevents duplicate data

## 🔒 Security

### Row Level Security (RLS)

- Public read access for published recipes
- User-specific access for hearts and ratings
- Admin-only access for recipe management

### API Security

- Service role keys for admin operations
- User authentication for personal data
- Rate limiting on public endpoints

## 🎨 Design System

### Colors

- **Primary**: Sage green (#6B7280)
- **Accent**: Warm oat (#F5F5DC)
- **Surface**: Clean whites and grays
- **Dark mode**: Accessible contrast ratios

### Typography

- **Headings**: Serif fonts for elegance
- **Body**: Sans-serif for readability
- **Prose**: Tailwind Typography plugin

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Review the documentation above
3. Create a new issue with detailed information

---

**Built with ❤️ using Next.js, Supabase, and modern web technologies**
