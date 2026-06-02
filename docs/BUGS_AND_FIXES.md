# Bugs & Fixes — Official Tyse 9 PM

A running log of issues hit during development and exactly how each was resolved.

---

## BUG-001 — All text collapsed / overlapping across every screen

**Symptom:** Labels, subtitles, timestamps, and card text were vertically smashed together or completely invisible. Affected LockScreen, HomeScreen, MusicApp, AllApps — every component.

**Root cause:** `Phone.jsx` line 68 had `lineHeight: 0` on the outermost wrapper div:
```jsx
// BEFORE (broken)
<div style={{ position: 'relative', display: 'inline-block', lineHeight: 0 }}>
```
CSS `line-height` is an inherited property. Setting it to `0` on the root wrapper poisoned every child element in the entire phone — all text collapsed to zero height.

**Fix:** Replaced `lineHeight: 0` with `verticalAlign: 'top'`:
```jsx
// AFTER (fixed)
<div style={{ position: 'relative', display: 'inline-block', verticalAlign: 'top' }}>
```
`verticalAlign: 'top'` achieves the same layout goal (suppress the inline-block descender gap) without touching inherited line-height.

**Belt-and-suspenders:** Also added a typography baseline to `globals.css`:
```css
html, body, #root { line-height: 1.35; }
```
And added explicit `lineHeight: 1.2` on all small text nodes throughout components as a defensive measure.

**Files changed:** `Phone.jsx:68`, `globals.css`, `LockScreen.jsx`, `MusicApp.jsx`, `AllApps.jsx`

---

## BUG-002 — Profile subtitle wrapping to two lines

**Symptom:** The subtitle under the artist name in `AllApps.jsx` (ConnectApp profile card) wrapped to a second line, making the card look broken at 393px phone width.

**Root cause:** The subtitle text was too long:
```
"Empire Recording Artist · Main Character @ 9 PM"
```
At `fontSize: 13` inside a ~353px container (393px minus padding), this wrapped.

**Fix:** Shortened to a tight, styled handle:
```
"Artist · @officialtyce"
```

**File changed:** `AllApps.jsx` — `ConnectApp` profile card subtitle

---

## BUG-003 — Gallery showing wrong item count

**Symptom:** The Gallery header strip showed "28 items" but the grid only contained 12 photos.

**Root cause:** Copy/paste error in initial scaffold — the number was not updated when the photos array was finalized at 12 items.

**Fix:** Changed count text from `'28 items · @officialtyce'` to `'12 items · @officialtyce'`.

**File changed:** `AllApps.jsx` — `GalleryApp` header strip

---

## BUG-004 — Glassmorphism not visible (surfaces looked opaque/dark)

**Symptom:** After applying glassmorphism styles, cards and panels looked like solid dark boxes instead of translucent glass.

**Root cause:** The original glass variables used dark opaque backgrounds:
```css
--glass: rgba(28, 28, 30, 0.82);   /* nearly opaque dark */
```
Dark fills block the background from bleeding through, which defeats the entire glassmorphism effect.

**Fix:** Switched to light semi-transparent fills so underlying gradients and images show through:
```css
--glass: rgba(255, 255, 255, 0.07);   /* near-invisible tint */
```
The 21st.dev three-layer recipe was applied: (1) blur layer via `backdrop-filter`, (2) light fill, (3) top-edge `inset` highlight:
```js
const G = {
  card: {
    background: 'rgba(255,255,255,0.07)',
    backdropFilter: 'blur(24px) saturate(2)',
    WebkitBackdropFilter: 'blur(24px) saturate(2)',
    border: '1px solid rgba(255,255,255,0.11)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), ...',
  }
}
```

**Files changed:** `globals.css` (all `--glass*` variables), `AllApps.jsx` (G token)

---

## BUG-005 — .gitignore missing — node_modules and .claude tracked by git

**Symptom:** `git status` showed thousands of `node_modules/` files and the `.claude/` directory (which contains session data, memory files, and plugin caches) as untracked.

**Root cause:** `.gitignore` was empty — no exclusion rules existed.

**Fix:** Wrote a complete `.gitignore`:
```
node_modules/
dist/
dist-ssr/
build/
.env
.env.local
.env.*.local
.claude/
*.log
npm-debug.log*
.vscode/
.idea/
.DS_Store
Thumbs.db
.vite/
```

**File changed:** `.gitignore`

---

## BUG-006 — Stale Messages state after redesign to 9 PM Notes

**Symptom:** After renaming Messages to 9 PM Notes, the store still had `chatOpen`, `messages[]`, and `addMessage()` — state that no longer matched the new three-tab fan-notes UI.

**Root cause:** The store was not updated when the UI was redesigned.

**Fix:** Full store replacement — removed old chat state, added:
```js
artistNotes[]   // { id, text, time, date }   — Tyse broadcast messages
fanNotes[]      // { id, name, song, mood, message, ts }
pinnedNotes[]   // same shape — curated picks
addFanNote(n)   // prepends note with live nowTs() timestamp
```
Removed `chatOpen`, `messages`, `addMessage` entirely.

**Files changed:** `phoneStore.js`, `AllApps.jsx`

---

## Meta — GateguardFact hook requires facts before every Write/Edit

**What it is:** A pre-tool hook (`pre:edit-write:gateguard-fact-force`) that fires before every Write or Edit and requires stating four facts:
1. Files and lines that import/call the file being changed
2. Confirmation no existing file serves the same purpose
3. Data field names and structure if the file reads/writes data
4. Verbatim user instruction

**How to handle:** State all four facts in the response text, then immediately retry the exact same Write or Edit call. The gate clears on the retry.

**To disable:** Set `ECC_GATEGUARD=off` or add `pre:edit-write:gateguard-fact-force` to `ECC_DISABLED_HOOKS` in Claude Code settings.
