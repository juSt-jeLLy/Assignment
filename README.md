# Hospital Feedback Analytics Dashboard

Production-style frontend dashboard for hospital management to monitor patient satisfaction, doctor performance, complaints, and sentiment trends.

## Live Demo

- Deployment URL: [assignment-omega-tan.vercel.app](https://assignment-omega-tan.vercel.app/)

## Repository

- GitHub URL: [juSt-jeLLy/Assignment](https://github.com/juSt-jeLLy/Assignment)

## Project Overview

This project was built for the Frontend Developer Assessment and implements a multi-page analytics dashboard using React, TypeScript, TanStack Router, TanStack Query, Recharts, and Zustand.

It supports:

- Feedback analytics and KPI tracking
- Doctor performance ranking and filtering
- Complaint category and resolution analysis
- Realtime updates from Supabase
- In-app notification center with filtering preferences

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- TanStack Router
- TanStack Query
- Zustand
- Recharts
- Supabase (database + realtime)
- Framer Motion
- shadcn/ui components

## Implemented Features (Assessment Mapping)

### Section 5: Application Pages

- Dashboard
- Feedback Analytics
- Sentiment Analysis
- Doctor Performance
- Complaints Management
- Feedback Table
- Settings (optional page, implemented)

### Section 7.1: Overview Statistic Cards

- Total Feedbacks
- Average Rating
- Positive Feedback %
- Negative Feedback %
- Total Complaints
- Active Departments
- Trend indicators vs previous month when previous-month data exists

### Section 7.2: Patient Feedback Analytics

- Daily trend
- Monthly volume
- Rating distribution
- Sentiment split

### Section 7.3: Department Performance

- Average rating
- Total reviews
- Complaint count
- Comparative chart view

### Section 7.4: Doctor Performance Dashboard

- Doctor/department/rating/patients/complaints/score
- Search by doctor
- Sort by columns
- Filter by department

### Section 7.5: Feedback Table

- Required columns including truncated feedback
- Pagination
- Global search
- Sorting
- Filters by department/sentiment/rating

### Section 7.6: Complaint Analytics

- Complaint categories
- Status summary
- Month-over-month status trend
- Average resolution time

### Section 7.7: Sentiment Analysis

- Positive / Neutral / Negative distribution
- Trend chart including all three sentiment series

### Bonus Features Implemented

- Dark mode toggle
- CSV export actions across sections
- Realtime updates (Supabase realtime channels)
- Notification center for complaint/feedback events

## Data Layer

Primary data source is Supabase.

Expected tables:

- `feedback_records`
- `notifications`

The app subscribes to realtime events (`postgres_changes`) for both tables and refreshes views automatically.

## State Management

Shared app state is managed with Zustand:

- UI state (drawers/panels)
- Filters
- Notification preferences
- User preferences

Component-local state is only used for local interaction concerns (for example, table sorting internals and isolated UI primitives).

## Environment Variables

Create a `.env` file in project root:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Local Setup Instructions

### 1. Clone and install

```bash
git clone <your-repo-url>
cd radiant-ui
npm install
```

### 2. Configure environment

Add `.env` variables shown above.

### 3. Run development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

### 6. Lint

```bash
npm run lint
```

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - run eslint
- `npm run format` - run prettier

## Folder Structure

```text
src/
  components/
  features/
  hooks/
  lib/
  routes/
  store/
```

## Known Limitations

- Percentage trend badges on dashboard cards are hidden when no previous-period data exists (intentional to avoid misleading values).
- Lint currently includes non-blocking `react-refresh/only-export-components` warnings from generated/shared UI files.
- Authentication and role-based access control are not implemented.

## Notes for Review

- Code is organized by feature modules and shared UI components.
- Data rendering is driven from services/hooks and Supabase data, not hardcoded in page JSX.
- Realtime behavior can be validated by inserting a new `feedback_records` row and observing live updates + notification creation trigger.
