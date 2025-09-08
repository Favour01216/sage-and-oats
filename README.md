# Sage & Oat 🥗

A modern, accessible recipe platform built with Next.js 15, Supabase, and Algolia. Features include instant search, cook mode with timers, and comprehensive nutrition data.

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

## 🧪 Testing

### Playwright Tests

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run headed (visible browser)
npm run test:headed
```

### Test Coverage

- Anonymous hearts persistence and merging
- Search filters and URL state
- JSON-LD rendering and validation
- Cook mode timer functionality
- Recipe creation and editing

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
