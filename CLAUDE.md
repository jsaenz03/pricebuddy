# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Next.js Commands
- `npm run dev` - Start development server (localhost:3000)
- `npm run build` - Build production version
- `npm start` - Start production server
- `npm run lint` - Run ESLint checks
- `npm run type-check` - TypeScript type checking without build

### Environment Setup
Create `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Architecture Overview

### Core Application Structure
This is a clinical supply price comparison application with authentication built on Next.js 14, Supabase, and shadcn/ui v4.

**Key Architectural Patterns:**
- **Authentication**: Supabase Auth with custom user profiles and subscription tiers
- **Database**: Supabase with typed schema generation (see `types/database.ts`)
- **State Management**: React Context for auth state, local state for UI components
- **UI Framework**: shadcn/ui v4 with Radix UI primitives and Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation

### Database Schema
The application uses 4 main tables:
- `user_profiles` - User data with subscription tiers (free/pro/enterprise)
- `products` - Clinical supplies with SKU, category, keywords
- `suppliers` - Supplier websites with scraping configurations
- `price_entries` - Price data linking products to suppliers with availability status

### Authentication System
- **Context**: `contexts/AuthContext.tsx` - Global auth state management
- **Guards**: `components/auth/AuthGuard.tsx` - Route protection and feature gating
- **Forms**: Login, signup, password reset, user profile management
- **Subscription Tiers**: Feature gating based on user subscription level

### Component Architecture
- **Main App**: `components/price-comparison-app.tsx` - Core price comparison interface
- **Auth Components**: `components/auth/` - Authentication forms and guards
- **UI Components**: `components/ui/` - shadcn/ui v4 components
- **Layout**: `app/layout.tsx` - Next.js App Router root layout

## Key Technical Details

### Supabase Integration
- Client configuration in `lib/supabase.ts` with auth helpers
- Real-time auth state changes handled via `onAuthStateChange`
- Typed database queries using generated types from `types/database.ts`
- Row Level Security (RLS) implemented - all data is user-scoped

### TypeScript Implementation
- Strict TypeScript configuration with Next.js
- Generated database types from Supabase
- Form validation with Zod schemas
- Custom hook types for auth context

### Styling Approach
- Tailwind CSS with shadcn/ui v4 design system
- Custom components extend shadcn/ui primitives
- Responsive design with mobile-first approach
- CSS custom properties for theme consistency

### State Management Patterns
- AuthContext for global authentication state
- Local React state for component-specific data
- Supabase real-time subscriptions for live data updates
- Form state managed by React Hook Form

## Development Guidelines

### Adding New Features
1. Check subscription tier requirements in `types/index.ts`
2. Implement feature gating using `<FeatureGate>` component
3. Add database operations to `lib/supabase.ts` if needed
4. Update TypeScript types in `types/` directory

### Authentication Flow
- All routes are public by default
- Protected routes use `<AuthGuard>` wrapper
- Feature access controlled by subscription tier
- User profile automatically created on first sign-in

### Database Operations
- All queries should include `user_id` filter for security
- Use typed Supabase client from `lib/supabase.ts`
- Handle errors gracefully with user-friendly messages
- Implement optimistic UI updates where appropriate

### Component Development
- Use existing shadcn/ui components when possible
- Follow established patterns from `components/auth/` directory
- Implement proper loading states and error handling
- Ensure mobile responsiveness

## Security Considerations

### Environment Variables
- Never commit `.env.local` to repository
- Use `NEXT_PUBLIC_` prefix only for client-side variables
- Supabase keys are safe for client-side use (RLS enforced)

### Data Access
- All database operations are user-scoped via RLS policies
- Supabase handles authentication token management
- API keys for suppliers stored encrypted in database
- No sensitive data exposed in client-side code

### Content Security
- CORS headers configured in `next.config.js`
- Rate limiting recommended for production scraping operations
- Input validation implemented with Zod schemas