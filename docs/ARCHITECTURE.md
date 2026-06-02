# Architecture — Official Tyse 9 PM

## Overview

The app renders a single phone mockup centered on a dark desktop. Everything inside the phone is a React component tree. There is no routing library — screen transitions are driven by a `screen` field in Zustand state and animated with Framer Motion's `AnimatePresence`.

---

## Rendering Pipeline

```
App.jsx  (desktop env — grain overlay, ambient glow)
└── Phone.jsx  (phone shell, hardware buttons, screen router)
    ├── LockScreen.jsx          screen === 'lock'
    ├── HomeScreen.jsx          screen !== 'lock'
    └── ActiveApp (from APP_MAP) screen === 'app' && activeApp !== null
        └── AppShell.jsx        shared slide-up wrapper for every app
            ├── DynamicIsland.jsx
            ├── StatusBar.jsx
            └── {children}      app-specific content
```

`Phone.jsx` holds three separate `<AnimatePresence>` blocks so lock/home/app can each animate independently without interfering.

---

## Screen State Machine

Managed by `phoneStore.js`:

```
lock  ──(swipe up / tap)──▶  home  ──(tap app icon)──▶  app
                              ▲                           │
                              └──────(‹ Home button)──────┘
```

State fields: `screen: 'lock' | 'home' | 'app'`, `activeApp: string | null`

---

## Component Reference

### `Phone.jsx`
- Renders the titanium-style hardware buttons (`PhoneButton`) using absolute positioning outside the screen div.
- `APP_MAP` maps app IDs to their component: `{ music, messages, connect, store, gallery, videos }`.
- The `messages` key stays `messages` in APP_MAP even though the visible label is "9 PM Notes" — the key is what `openApp()` receives from `HomeScreen`.

### `LockScreen.jsx`
- Background: `artist-bg.png` with brightness/contrast filter + gradient overlay.
- Drag: Framer Motion `drag="y"` with `dragConstraints` and `dragElastic`. `handleDragEnd` checks `offset.y < -60` or `velocity.y < -300` to trigger unlock.
- Tap: also triggers unlock via `handleTap` (guarded by `isDragging.current` flag to prevent accidental fires on drag release).
- Animations: notification banner drops in at 1.4s, swipe hint fades in at 2.2s, particles float upward continuously.

### `HomeScreen.jsx`
- `APPS` array defines the 6 app icons. `DOCK_APPS` array defines which 4 appear in the bottom dock.
- App icons use a two-layer glass sheen (diagonal gradient + inset edge shadow) on top of the app's `gradient` background.
- The home wallpaper is the same `artist-bg.png` but at lower brightness (0.42 vs lock screen's 0.58).

### `AppShell.jsx`
- Accepts `title`, `children`, `bg` props.
- Slide-up animation: `initial={{ y: '100%', borderRadius: '54px' }}` → `animate={{ y: 0, borderRadius: '0px' }}` — matches iOS app-open behavior.
- Content area has `marginTop: 92` to clear the topbar (DynamicIsland + StatusBar + title row).
- Always renders `DynamicIsland` and `StatusBar` so they appear inside every app.

### `MusicApp.jsx`
- Creates a hidden YouTube IFrame player on mount (`1px × 1px`, `opacity: 0.01`, off-screen).
- `loadYouTubeApi()` handles the global `onYouTubeIframeAPIReady` callback safely — multiple calls won't double-inject the script.
- Three `useEffect` hooks handle: (1) player creation on mount, (2) track switching, (3) play/pause + progress polling every 500ms.
- Auto-advances to next track on `onStateChange` event `data === 0` (ended).

### `AllApps.jsx`
Exports five named components. Shared glass token `G` is defined once at the top.

| Export | App label | Key feature |
|---|---|---|
| `MessagesApp` | 9 PM Notes | 3-tab layout: Artist broadcast / Fan notes form / Pinned |
| `ConnectApp` | Socials | Social links + email signup |
| `StoreApp` | Store | Coming-soon merch grid |
| `GalleryApp` | Gallery | 3-col photo grid |
| `VideosApp` | Videos | YouTube card list |

**9 PM Notes tabs** use `AnimatePresence mode="wait"` with `x: ±16` slide transitions between tabs. The fan note form validates that `name`, `mood`, and `message` are non-empty before enabling the Send button (button color shifts from muted to gold).

### `DynamicIsland.jsx`
- Sits absolutely at the top-center of any screen that renders it.
- Expands when `islandActive` is true in the store, showing the current track title.
- `showIsland(title)` in the store sets `islandActive: true` then auto-resets after 3.5s.

### `StatusBar.jsx`
- Shows static time, signal strength (4 bars), WiFi icon, battery.
- Positioned at top of phone, z-index above content.

---

## State Store (`phoneStore.js`)

```js
// Screen
screen: 'lock' | 'home' | 'app'
activeApp: string | null

// Music player
currentTrack: number          // index into TRACKS[]
isPlaying: boolean
progress: number              // 0–100
islandActive: boolean
islandTrack: string           // track title for Dynamic Island

// 9 PM Notes
artistNotes: ArtistNote[]     // { id, text, time, date }
fanNotes: FanNote[]           // { id, name, song, mood, message, ts }
pinnedNotes: FanNote[]        // same shape as fanNotes

// Actions
unlock()        screen → 'home'
goHome()        screen → 'home', activeApp → null
openApp(id)     screen → 'app', activeApp → id
closeApp()      screen → 'home', activeApp → null
setTrack(i)     currentTrack → i, isPlaying → true, progress → 0
togglePlay()    isPlaying → !isPlaying
setProgress(p)  progress → p
showIsland(t)   islandActive → true, then false after 3.5s
addFanNote(n)   prepends to fanNotes[] with live timestamp from nowTs()
```

**Exported data constants** (used by `MusicApp` and `AllApps`):
- `TRACKS[]` — 11 tracks with `ytId`, `dur`, `secs`
- `VIDEOS[]` — same 11 videos with `url` for external link
- `LINKS[]` — 4 social platform entries

---

## CSS / Design Tokens (`globals.css`)

```css
--phone-w: 393px
--phone-h: 852px
--gold: #c9a84c
--gold-light: #e8c97a
--glass: rgba(255,255,255,0.07)
--glass-light: rgba(255,255,255,0.11)
--glass-deep: rgba(0,0,0,0.44)
--blur-sm: blur(16px) saturate(1.8)
--blur-md: blur(28px) saturate(2)
--blur-lg: blur(40px) saturate(2.2)
--glass-shadow: inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.06),
                0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.18)
```

Typography baseline: `html, body, #root { line-height: 1.35 }` — prevents inherited `line-height: 0` from collapsing text (see `BUGS_AND_FIXES.md`).

Key CSS classes: `.phone-shell`, `.liquid-glass`, `.dock-blur`, `.app-topbar-blur`, `.notif-banner`, `.link-item`, `.store-card`, `.chat-bubble-in`, `.chat-bubble-out`, `.home-indicator`, `.lock-grid-lines`, `.grain-overlay`.

---

## Data Flow — Fan Note Submission

```
User fills form (name, song, mood, message)
    │
    ▼
handleSubmit() in MessagesApp (AllApps.jsx)
    │
    ▼
addFanNote({ name, song, mood, message })  ← phoneStore action
    │
    ▼
nowTs() generates HH:MM AM/PM timestamp
    │
    ▼
fanNotes[] prepended → Zustand notifies → Fans tab re-renders
```

---

## Data Flow — Music Playback

```
User taps track row
    │
    ▼
handleTrackSelect(i) → setTrack(i) + showIsland(title)
    │
    ├──▶ currentTrack + isPlaying update → DynamicIsland expands for 3.5s
    │
    └──▶ useEffect [currentTrack] in MusicApp.jsx
             │
             ▼
         player.loadVideoById(ytId)
             │
             ▼
         useEffect [isPlaying] → playVideo() + 500ms progress poll
             │
             ▼
         setProgress() → progress bar animates via Framer Motion
```
