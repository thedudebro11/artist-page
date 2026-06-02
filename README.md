# Official Tyse — 9 PM
### Interactive Phone OS Artist Website

A fully interactive iPhone-style phone OS experience built for **Official Tyse**. Visitors land on a lock screen, swipe up to unlock, and navigate a home screen with six real apps — all inside a pixel-accurate phone mockup rendered in the browser.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Animations | Framer Motion 11 (spring physics, drag gestures, AnimatePresence) |
| State | Zustand 4 (single global store, no backend) |
| Styling | CSS custom properties + inline styles (glassmorphism), Tailwind for utilities |
| Fonts | DM Sans, Bebas Neue, Cormorant Garamond, DM Mono (Google Fonts) |
| Music playback | YouTube IFrame API (hidden player, real audio) |

---

## Quick Start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs to /dist
```

---

## Project Structure

```
src/
├── components/
│   ├── Phone.jsx           — Phone shell, hardware buttons, screen router
│   ├── LockScreen.jsx      — Swipe-up unlock, notification banner, particles
│   ├── HomeScreen.jsx      — 3×2 app grid + dock
│   ├── DynamicIsland.jsx   — Expanding now-playing pill (top center)
│   ├── StatusBar.jsx       — Time, signal bars, battery icon
│   ├── AppShell.jsx        — Shared slide-up wrapper for every app
│   ├── MusicApp.jsx        — Full music player (YouTube-backed)
│   └── AllApps.jsx         — 9 PM Notes, Socials, Store, Gallery, Videos
├── store/
│   └── phoneStore.js       — All global state + TRACKS / VIDEOS / LINKS data
├── styles/
│   └── globals.css         — CSS variables, phone shell, glassmorphism tokens
├── lib/
│   ├── sanity.js           — Sanity CMS client (future use)
│   ├── supabase.js         — Supabase client (future use)
│   └── youtube.js          — YouTube API helpers
├── App.jsx                 — Desktop environment wrapper (ambient glow, grain)
└── main.jsx                — React entry point
```

---

## Apps

| App ID | Label | What it does |
|---|---|---|
| `music` | Music | Full player — album art, progress bar, prev/next, track list. YouTube IFrame API streams real audio. |
| `messages` | 9 PM Notes | Artist broadcast feed + fan note submission form (name, fav song, mood tag, message). Three tabs: Artist / Fans / Pinned. |
| `connect` | Socials | Profile card, social links (Spotify, YouTube, Instagram, Threads), email signup. |
| `store` | Store | Merch preview grid — "Coming Soon" concept cards. |
| `gallery` | Gallery | 3-column photo grid (emoji placeholders, ready for real images). |
| `videos` | Videos | Scrollable YouTube video cards with glass play buttons — opens YouTube in new tab. |

---

## Design System

All glass surfaces share a three-layer recipe defined in `G.card` / `G.cardGold` inside `AllApps.jsx`:

```
1. backdrop-filter: blur(24px) saturate(2)   — blur layer
2. background: rgba(255,255,255,0.07)         — semi-transparent fill
3. inset 0 1px 0 rgba(255,255,255,0.18)       — top edge highlight
```

CSS tokens live in `globals.css`:

```css
--gold:           #c9a84c
--gold-light:     #e8c97a
--glass:          rgba(255,255,255,0.07)
--blur-md:        blur(28px) saturate(2)
--glass-shadow:   inset 0 1px 0 rgba(255,255,255,0.18), ...
```

Phone dimensions: `--phone-w: 393px` / `--phone-h: 852px`

---

## State (phoneStore.js)

```
screen          'lock' | 'home' | 'app'
activeApp       string | null
currentTrack    number (index into TRACKS)
isPlaying       boolean
progress        number (0–100)
islandActive    boolean
artistNotes[]   Tyse's broadcast messages  { id, text, time, date }
fanNotes[]      Fan submissions            { id, name, song, mood, message, ts }
pinnedNotes[]   Curated picks by Tyse      { id, name, song, mood, message, ts }
```

Key actions: `unlock`, `openApp`, `goHome`, `setTrack`, `togglePlay`, `addFanNote`, `showIsland`

---

## Customization Checklist

- [ ] Replace `/public/artist-bg.png` with actual artist photo (used on lock screen + home wallpaper)
- [ ] Update `LINKS` in `phoneStore.js` with real Spotify URL
- [ ] Add real merch items + prices to `StoreApp` in `AllApps.jsx`
- [ ] Replace Gallery emoji placeholders with actual photos
- [ ] Update `TRACKS` / `VIDEOS` if YouTube IDs change
- [ ] Seed `artistNotes` with real broadcast copy
- [ ] Wire `fanNotes` / email signup to a real backend (Supabase client is already in `src/lib/supabase.js`)

---

## Deploy

```bash
npm run build
# Upload /dist to Vercel, Netlify, or any static host
```

Vercel recommended — connect GitHub repo for auto-deploy on push to `main`.

---

## Docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — component map, data flow, rendering pipeline
- [`docs/BUGS_AND_FIXES.md`](docs/BUGS_AND_FIXES.md) — issues encountered and how they were resolved
