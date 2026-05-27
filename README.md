# Official Tyse — 9 PM
### Phone OS Artist Website

A fully interactive phone OS experience built for Official Tyse.

---

## Stack
- **React 18** + **Vite** — blazing fast dev & build
- **Framer Motion** — physics spring animations, drag gestures
- **Zustand** — lightweight global state
- **Tailwind CSS** — utility-first styling
- **DM Sans / Bebas Neue / Cormorant Garamond** — custom typography

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (opens at localhost:3000)
npm run dev

# 3. Build for production
npm run build
```

---

## VS Code Extensions (install these)
Go to Extensions panel (Ctrl+Shift+X) and install:

| Extension | Why |
|-----------|-----|
| **Tailwind CSS IntelliSense** | Autocomplete for Tailwind classes |
| **ES7+ React Snippets** | `rafce` shortcut for components |
| **Prettier** | Auto-format on save |
| **Auto Rename Tag** | Rename JSX tags in pairs |
| **Path Intellisense** | Import path autocomplete |
| **Color Highlight** | See CSS colors inline |

---

## Project Structure

```
src/
├── components/
│   ├── Phone.jsx          — Root phone shell + screen router
│   ├── LockScreen.jsx     — Swipe-to-unlock with particles
│   ├── HomeScreen.jsx     — App grid + dock
│   ├── DynamicIsland.jsx  — Expanding now-playing pill
│   ├── StatusBar.jsx      — Time, signal, battery
│   ├── AppShell.jsx       — Slide-up app wrapper
│   ├── MusicApp.jsx       — Full music player
│   └── AllApps.jsx        — Messages, Connect, Store, Gallery, Videos
├── store/
│   └── phoneStore.js      — Zustand state + track/video/link data
├── styles/
│   └── globals.css        — CSS variables, phone shell, animations
├── App.jsx                — Desktop environment wrapper
└── main.jsx               — React entry point
```

---

## Customization Checklist

- [ ] Add real artist photos to `Gallery` (replace emoji placeholders)
- [ ] Add real Spotify/Apple Music links in `store/phoneStore.js → LINKS`
- [ ] Add real merch items + pricing in `StoreApp`
- [ ] Add real YouTube embed URLs in `VIDEOS`
- [ ] Update `TRACKS` with Spotify embed or audio file URLs for actual playback
- [ ] Replace wallpaper gradient with a real photo in `globals.css → .home-wallpaper`
- [ ] Add real notification text for new drops

---

## Deploy

```bash
npm run build
# Upload /dist folder to Vercel, Netlify, or any static host
```

Vercel recommended — connect GitHub repo and it auto-deploys on push.
