# TODO: Create Recent Blogs Section on Home Page - COMPLETED

## Steps Completed:
- [x] Create RecentBlogsSection.tsx component in components/pages/home/
- [x] Update app/page.tsx to import and include the RecentBlogsSection component
- [x] Add sample blog groups and blogs to prisma/seed.ts for testing
- [x] Run database seed to populate sample data
- [x] Test the home page to ensure the section renders correctly and matches other sections' UI

## Notes:
- Ensure the UI matches the styling of other home page sections (e.g., serviceSection.tsx).
- Fetch recent 4 blogs for India region using the blogs API.
- Display blogs in a card layout with title, image, and excerpt.
- Added 5 sample blogs across 3 categories: Company Registration, Tax Compliance, and Business Tips.
