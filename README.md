# Calendar Pilot

An AI-powered calendar and scheduling application built with React, TypeScript, and Supabase. Calendar Pilot uses natural language processing to create events and supports deployment to web, iOS, and Android through Capacitor.

## Features

- **AI-Powered Event Creation**: Use natural language to create calendar events with OpenAI integration
- **Dark/Light Theme**: Toggle between dark and light modes with persistent preferences
- **Authentication**: Email/password login and OAuth support (Google, GitHub, Apple)
- **Subscription Management**: Three tiers (Free, Student Pack, Pro) with token and upload quotas
- **Calendar Views**: Month view with event display
- **Week at a Glance**: Horizontal scrollable week view
- **Mobile Native Support**: Configured with Capacitor for iOS and Android deployment
- **Database**: Supabase backend with Row Level Security

## Test User Credentials

For testing purposes, a test user has been pre-populated:

- **Email**: test@calendarpilot.com
- **Password**: TestPassword123!

## Setup

### 1. Add Your OpenAI API Key

Edit the `.env` file and add your OpenAI API key:

```
VITE_OPENAI_API_KEY=your-actual-openai-api-key-here
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## Mobile Deployment

### iOS

```bash
npx cap add ios
npx cap sync
npx cap open ios
```

Then build and run from Xcode.

### Android

```bash
npx cap add android
npx cap sync
npx cap open android
```

Then build and run from Android Studio.

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Main application pages
- `src/contexts/` - React contexts (Auth)
- `src/services/` - Service layer (Database, OpenAI)
- `src/types/` - TypeScript type definitions
- `src/styles/` - Global styles and theme
- `src/lib/` - Library configurations (Supabase)

## Tech Stack

- React 18
- TypeScript
- Vite
- Supabase (Database & Auth)
- OpenAI (gpt-4o-mini for text, gpt-4o for images)
- Capacitor (Mobile deployment)
- date-fns (Date utilities)

## Database Schema

The application uses the following tables:

- `profiles` - User profile information
- `events` - Calendar events
- `subscriptions` - Subscription tier information
- `token_usage` - AI token usage tracking
- `upload_quotas` - File upload quota tracking

All tables have Row Level Security enabled to ensure users can only access their own data.

## OAuth Configuration

To enable OAuth providers:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Enable and configure Google, GitHub, and Apple providers
4. Add authorized redirect URLs for your domain

## Subscription Tiers

- **Free**: 5,000 tokens, 1 file upload
- **Student Pack**: Free tier + 4 additional uploads (5 total)
- **Pro**: 50,000 tokens, 4 uploads per month (recurring)

## Notes

- The app defaults to dark mode
- Events older than the previous month are automatically flagged for deletion
- A 2000-token safeguard prevents bulk schedule uploads
- All AI operations track token usage and enforce quotas
