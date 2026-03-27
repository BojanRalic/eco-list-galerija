# Eco List Galerija — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modern photo gallery for brand "Eco List" with photo selection, shared Vercel KV persistence, lightbox viewer, and image protection.

**Architecture:** Single-page Next.js (App Router) app. One route with tab switcher ("Sve" / "Odabrane"). Selection state syncs with Vercel KV via GET/POST API routes. Follows the same patterns as the vijetnam-ture project.

**Tech Stack:** Next.js (App Router), Tailwind CSS v4, Framer Motion, @vercel/kv, Jest

---

## File Map

| File | Responsibility |
|------|---------------|
| `app/layout.js` | HTML shell, fonts, metadata |
| `app/globals.css` | Tailwind v4 `@theme`, global image protection CSS, print block |
| `app/page.js` | State, API calls, tab logic, composition |
| `app/api/selection/route.js` | GET/POST Vercel KV |
| `components/Tabs.js` | Tab switcher UI |
| `components/Gallery.js` | Masonry grid, select button, image protection |
| `components/Lightbox.js` | Fullscreen viewer, keyboard, swipe, wrapping nav |
| `lib/images.js` | Static image data array |
| `lib/selection.js` | Pure `applySelectionUpdate` function |
| `__tests__/selection.test.js` | Unit tests for selection logic |
| `public/images/` | 8 placeholder nature images |

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json` (via create-next-app)
- Create: `jest.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`

- [ ] **Step 1: Scaffold Next.js project**

Run from `/Users/mrralic/Claude-AI/ai-websites/`:
```bash
cd /Users/mrralic/Claude-AI/ai-websites
npx create-next-app@latest eco-list-galerija --app --no-typescript --no-eslint --tailwind --no-src-dir --import-alias "@/*" --yes
cd eco-list-galerija
```

- [ ] **Step 2: Install dependencies**

```bash
npm install framer-motion @vercel/kv
npm install --save-dev jest jest-environment-node
```

- [ ] **Step 3: Add test script to package.json**

Open `package.json`. In `"scripts"`, add:
```json
"test": "jest"
```

- [ ] **Step 4: Create jest.config.js**

```js
const nextJest = require('next/jest')
const createJestConfig = nextJest({ dir: './' })
module.exports = createJestConfig({
  testEnvironment: 'node',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
})
```

- [ ] **Step 5: Init git and first commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js project"
```

---

### Task 2: Placeholder Images + Data

**Files:**
- Create: `public/images/eco-01.jpg` … `eco-08.jpg`
- Create: `lib/images.js`

- [ ] **Step 1: Download placeholder nature images**

```bash
mkdir -p public/images
curl -L "https://picsum.photos/seed/forest1/800/1000" -o public/images/eco-01.jpg
curl -L "https://picsum.photos/seed/forest2/800/600"  -o public/images/eco-02.jpg
curl -L "https://picsum.photos/seed/nature3/800/1100" -o public/images/eco-03.jpg
curl -L "https://picsum.photos/seed/green4/800/700"   -o public/images/eco-04.jpg
curl -L "https://picsum.photos/seed/leaf5/800/900"    -o public/images/eco-05.jpg
curl -L "https://picsum.photos/seed/tree6/800/600"    -o public/images/eco-06.jpg
curl -L "https://picsum.photos/seed/river7/800/1050"  -o public/images/eco-07.jpg
curl -L "https://picsum.photos/seed/moss8/800/720"    -o public/images/eco-08.jpg
```

- [ ] **Step 2: Create lib/images.js**

```js
export const images = [
  { id: 'eco-01', src: '/images/eco-01.jpg', alt: 'Šuma' },
  { id: 'eco-02', src: '/images/eco-02.jpg', alt: 'Priroda' },
  { id: 'eco-03', src: '/images/eco-03.jpg', alt: 'Zelenilo' },
  { id: 'eco-04', src: '/images/eco-04.jpg', alt: 'Livada' },
  { id: 'eco-05', src: '/images/eco-05.jpg', alt: 'Lišće' },
  { id: 'eco-06', src: '/images/eco-06.jpg', alt: 'Drvo' },
  { id: 'eco-07', src: '/images/eco-07.jpg', alt: 'Reka' },
  { id: 'eco-08', src: '/images/eco-08.jpg', alt: 'Mahovina' },
]
```

- [ ] **Step 3: Commit**

```bash
git add public/images lib/images.js
git commit -m "feat: add placeholder images and data"
```

---

### Task 3: Theme + Layout

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.js`
- Modify: `tailwind.config.js`

- [ ] **Step 1: Update tailwind.config.js to add content paths**

Replace the full file:
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
}
```

- [ ] **Step 2: Replace app/globals.css**

```css
@import "tailwindcss";

@theme {
  --color-forest-950: #0a1f12;
  --color-forest-900: #0f2419;
  --color-forest-800: #1a3d2b;
  --color-forest-700: #2d5a3d;
  --color-forest-600: #3d7a52;
  --color-cream-50: #faf8f3;
  --color-cream-100: #f5f0e8;
  --color-cream-200: #ede5d3;
  --color-gold: #c9a96e;

  --font-family-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-family-serif: 'Playfair Display', Georgia, serif;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-family-sans);
    -webkit-font-smoothing: antialiased;
  }

  img {
    -webkit-touch-callout: none;
    user-select: none;
    -webkit-user-drag: none;
  }
}

@media print {
  body {
    visibility: hidden;
  }
}
```

- [ ] **Step 3: Replace app/layout.js**

```js
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata = {
  title: 'Eco List — Galerija',
  description: 'Odaberite vaše omiljene fotografije',
}

export default function RootLayout({ children }) {
  return (
    <html lang="sr">
      <body className={`${inter.variable} ${playfair.variable} bg-cream-100`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.js tailwind.config.js
git commit -m "feat: dark green theme and layout"
```

---

### Task 4: Selection Logic + Tests

**Files:**
- Create: `lib/selection.js`
- Create: `__tests__/selection.test.js`

- [ ] **Step 1: Write failing tests**

```js
// __tests__/selection.test.js
import { applySelectionUpdate } from '@/lib/selection'

test('add id to empty list', () => {
  expect(applySelectionUpdate([], 'img-1', 'add')).toEqual(['img-1'])
})

test('remove existing id', () => {
  expect(applySelectionUpdate(['img-1', 'img-2'], 'img-1', 'remove')).toEqual(['img-2'])
})

test('add duplicate id does not duplicate', () => {
  expect(applySelectionUpdate(['img-1'], 'img-1', 'add')).toEqual(['img-1'])
})

test('remove non-existing id is no-op', () => {
  expect(applySelectionUpdate(['img-1'], 'img-2', 'remove')).toEqual(['img-1'])
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test
```
Expected: 4 failures — `Cannot find module '@/lib/selection'`

- [ ] **Step 3: Create lib/selection.js**

```js
export function applySelectionUpdate(ids, id, action) {
  const set = new Set(ids)
  if (action === 'add') set.add(id)
  else set.delete(id)
  return [...set]
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test
```
Expected: 4 tests pass, 0 failed.

- [ ] **Step 5: Commit**

```bash
git add lib/selection.js __tests__/selection.test.js
git commit -m "feat: add selection logic with tests"
```

---

### Task 5: API Route

**Files:**
- Create: `app/api/selection/route.js`

- [ ] **Step 1: Create API route**

```js
// app/api/selection/route.js
import { kv } from '@vercel/kv'
import { applySelectionUpdate } from '@/lib/selection'

const KEY = 'eco-list-selection'

export async function GET() {
  const ids = await kv.get(KEY) ?? []
  return Response.json(ids)
}

export async function POST(request) {
  const { id, action } = await request.json()
  const ids = await kv.get(KEY) ?? []
  const updated = applySelectionUpdate(ids, id, action)
  await kv.set(KEY, updated)
  return Response.json(updated)
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/selection/route.js
git commit -m "feat: add selection API route"
```

---

### Task 6: Tabs Component

**Files:**
- Create: `components/Tabs.js`

- [ ] **Step 1: Create components/Tabs.js**

```js
'use client'

export default function Tabs({ activeTab, onTabChange, selectedCount }) {
  const tabs = [
    { id: 'sve', label: 'Sve fotografije' },
    { id: 'odabrane', label: selectedCount > 0 ? `Odabrane (${selectedCount})` : 'Odabrane' },
  ]

  return (
    <div className="flex gap-1 p-1 bg-forest-900/10 rounded-full w-fit mx-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-forest-800 text-cream-50 shadow-sm'
              : 'text-forest-700 hover:text-forest-800'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Tabs.js
git commit -m "feat: add Tabs component"
```

---

### Task 7: Gallery Component

**Files:**
- Create: `components/Gallery.js`

- [ ] **Step 1: Create components/Gallery.js**

```js
'use client'

import { motion, AnimatePresence } from 'framer-motion'

function HeartIcon({ filled }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
}

export default function Gallery({ images, selectedIds, onToggleSelect, onOpenLightbox }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      <AnimatePresence>
        {images.map((image, index) => {
          const isSelected = selectedIds.has(image.id)
          return (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="break-inside-avoid relative group"
              onContextMenu={e => e.preventDefault()}
            >
              <button
                className="w-full overflow-hidden rounded-2xl cursor-zoom-in block"
                onClick={() => onOpenLightbox(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  draggable="false"
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ pointerEvents: 'none' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </button>

              <button
                onClick={() => onToggleSelect(image.id)}
                className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                  isSelected
                    ? 'bg-forest-800 text-cream-50'
                    : 'bg-white/80 text-forest-700 opacity-0 group-hover:opacity-100'
                }`}
                aria-label={isSelected ? 'Ukloni iz odabranih' : 'Dodaj u odabrane'}
              >
                <HeartIcon filled={isSelected} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Gallery.js
git commit -m "feat: add Gallery component with selection and image protection"
```

---

### Task 8: Lightbox Component

**Files:**
- Create: `components/Lightbox.js`

- [ ] **Step 1: Create components/Lightbox.js**

```js
'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Lightbox({ index, images, onClose, onPrev, onNext }) {
  const image = images[index]
  const touchStart = useRef(null)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onNext, onPrev, onClose])

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStart.current === null) return
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? onNext() : onPrev()
    touchStart.current = null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      onContextMenu={e => e.preventDefault()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"
        aria-label="Zatvori"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white/10 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200"
        aria-label="Prethodna"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext() }}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white/10 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200"
        aria-label="Sledeća"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="relative"
          onClick={e => e.stopPropagation()}
        >
          <img
            src={image.src}
            alt={image.alt}
            draggable="false"
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            style={{ pointerEvents: 'none' }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <p className="text-white/80 text-sm font-medium">{image.alt}</p>
        <p className="text-white/40 text-xs mt-1">{index + 1} / {images.length}</p>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Lightbox.js
git commit -m "feat: add Lightbox with keyboard and swipe navigation"
```

---

### Task 9: page.js — Wire Everything Together

**Files:**
- Modify: `app/page.js`

- [ ] **Step 1: Replace app/page.js**

```js
'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { images } from '@/lib/images'
import Tabs from '@/components/Tabs'
import Gallery from '@/components/Gallery'
import Lightbox from '@/components/Lightbox'

export default function Page() {
  const [activeTab, setActiveTab] = useState('sve')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    fetch('/api/selection')
      .then(r => r.json())
      .then(ids => setSelectedIds(new Set(ids)))
  }, [])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setLightboxIndex(null)
  }

  const toggleSelect = useCallback(async (id) => {
    const action = selectedIds.has(id) ? 'remove' : 'add'
    setSelectedIds(prev => {
      const next = new Set(prev)
      action === 'add' ? next.add(id) : next.delete(id)
      return next
    })
    await fetch('/api/selection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    })
  }, [selectedIds])

  const visibleImages = activeTab === 'odabrane'
    ? images.filter(img => selectedIds.has(img.id))
    : images

  const total = visibleImages.length

  const handlePrev = useCallback(() => {
    setLightboxIndex(i => (i - 1 + total) % total)
  }, [total])

  const handleNext = useCallback(() => {
    setLightboxIndex(i => (i + 1) % total)
  }, [total])

  return (
    <main className="min-h-screen bg-cream-100">
      <section className="bg-forest-900 py-20 px-4 text-center">
        <p className="text-cream-100/50 text-xs tracking-[0.3em] uppercase mb-3">Eco List</p>
        <h1
          className="text-cream-50 text-5xl sm:text-6xl font-bold mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Galerija
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-cream-100/25" />
          <p className="text-cream-100/50 text-sm tracking-wider">Odaberite vaše fotografije</p>
          <div className="h-px w-12 bg-cream-100/25" />
        </div>
      </section>

      <section className="py-10 px-4">
        <Tabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          selectedCount={selectedIds.size}
        />
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {activeTab === 'odabrane' && visibleImages.length === 0 ? (
          <p className="text-center text-forest-700/50 py-20 text-sm">
            Još niste odabrali nijednu fotografiju.
          </p>
        ) : (
          <Gallery
            images={visibleImages}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onOpenLightbox={setLightboxIndex}
          />
        )}
      </section>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            index={lightboxIndex}
            images={visibleImages}
            onClose={() => setLightboxIndex(null)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
```

- [ ] **Step 2: Run dev server and verify locally**

```bash
npm run dev
```

Open http://localhost:3000 and verify:
- 8 images load in masonry grid
- Hover on image shows heart button
- Clicking heart selects/deselects image
- "Odabrane" tab shows only selected images
- Deselecting in "Odabrane" tab removes image immediately
- Click on image opens lightbox
- Lightbox prev/next buttons work and wrap around
- Keyboard arrows and Escape work
- Right-click on image is blocked (context menu disabled)
- Image drag is blocked

- [ ] **Step 3: Commit**

```bash
git add app/page.js
git commit -m "feat: wire up page with gallery, tabs, and lightbox"
```

---

### Task 10: GitHub + Vercel Deploy

**Files:**
- Create: `.env.local` (not committed)
- Create: `.env.example`

- [ ] **Step 1: Create GitHub repo and push**

```bash
gh repo create eco-list-galerija --public --source=. --remote=origin --push
```

- [ ] **Step 2: Link to Vercel**

```bash
npx vercel link
```

When prompted: create new project, name it `eco-list-galerija`.

- [ ] **Step 3: Create Vercel KV store**

In Vercel dashboard (vercel.com):
1. Go to project `eco-list-galerija` → **Storage** tab
2. Click **Create Database** → **KV**
3. Name it `eco-list-kv`, create and connect to project
4. Go to **Settings** of the KV store → copy env vars

- [ ] **Step 4: Add env vars to .env.local**

Create `.env.local` (not committed):
```
KV_REST_API_URL=<paste from Vercel>
KV_REST_API_TOKEN=<paste from Vercel>
KV_REST_API_READ_ONLY_TOKEN=<paste from Vercel>
```

- [ ] **Step 5: Create .env.example**

```
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
```

- [ ] **Step 6: Verify .gitignore contains .env.local**

Check `.gitignore` for:
```
.env.local
.env*.local
```
If missing, add those lines.

- [ ] **Step 7: Test locally with KV**

```bash
npx vercel dev
```

Open http://localhost:3000. Select a few images, refresh — selections should persist.

- [ ] **Step 8: Deploy to production**

```bash
npx vercel --prod
```

Expected output: deployment URL `https://eco-list-galerija.vercel.app`

- [ ] **Step 9: Verify live deployment**

Open `https://eco-list-galerija.vercel.app`. Verify:
- Gallery loads
- Selection persists after refresh
- Selection is same when opened in different browser/device

- [ ] **Step 10: Final commit and push**

```bash
git add .env.example .gitignore
git commit -m "feat: add env example and finalize deployment"
git push
```
