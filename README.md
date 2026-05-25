# Double Check by Sanket

A clean, production-grade React single-page application for the YouTube channel [@doublecheckbysanket](https://www.youtube.com/@doublecheckbysanket). Displays the channel's latest videos in a responsive grid. Clicking any video opens it on YouTube.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| HTTP client | Axios |
| Backend | Node.js + Express |
| Data | YouTube Data API v3 (free tier) |

## Project Structure

```
double-check/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/   # Navbar, SearchBar, VideoCard, VideoGrid, SkeletonCard
│       ├── hooks/        # useVideos (fetch + pagination state)
│       └── services/     # api.js (axios wrappers)
├── server/          # Express backend (YouTube API proxy)
│   ├── routes/      # GET /api/videos, GET /api/channel
│   └── services/    # youtubeService.js (channel resolve, playlist fetch, batch details)
├── .env.example     # Environment variable template
└── .gitignore
```

## Setup

### 1. Get a YouTube Data API v3 key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → Enable **YouTube Data API v3**
3. Create an API key under **Credentials**

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
YOUTUBE_API_KEY=your_youtube_data_api_v3_key_here
YOUTUBE_CHANNEL_HANDLE=@doublecheckbysanket
PORT=3001
```

### 3. Install dependencies

```bash
cd server && npm install && cd ..
cd client && npm install && cd ..
```

## Development

Run the backend and frontend in separate terminals:

```bash
# Terminal 1 — Express API server on :3001
cd server && node index.js

# Terminal 2 — Vite dev server on :5173
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

The Vite dev server proxies all `/api` requests to the Express server, so no CORS issues.

## Production Build

```bash
# Build the React app into client/dist
npm run build

# Serve everything from Express on :3001
npm start
```

In production mode Express serves `client/dist` statically and handles the catch-all `index.html` for SPA routing.

## Features

- **Responsive video grid** — 1 column on mobile, 2 on tablet, 3 on desktop
- **Skeleton loading** — shimmer placeholders while videos are fetching
- **Client-side search** — debounced title filter, clear button
- **Load More** — paginated via YouTube playlist API (nextPageToken)
- **Hover interactions** — thumbnail scale + red play overlay, card lift shadow
- **Channel hero** — banner image, avatar, name, subscriber/video counts
- **Error state** — friendly banner with "Try again" reload button
- **API key stays server-side** — never exposed in the browser bundle

## YouTube API Quota

The free tier allows 10,000 units/day. Each page load costs approximately:
- 1 unit — channel resolve (cached per process restart)
- 3 units — playlist fetch + video details batch
- Additional 3 units — each "Load More" click

The channel ID and uploads playlist ID are cached in module-level variables in `server/services/youtubeService.js` and only re-fetched on server restart.
