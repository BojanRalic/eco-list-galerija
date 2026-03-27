# Eco List Galerija — Design Spec

**Date:** 2026-03-27

## Overview

Galerija za prezentaciju fotografija klijentu brenda "Eco List" (ekološka tema). Klijent može pregledati sve fotografije, označiti odabrane, i pregledati samo odabrane u posebnom tabu. Selekcija je deljiva — isti link koriste i klijent i vlasnik projekta.

## Stack

- Next.js (App Router)
- Tailwind CSS
- Framer Motion
- Vercel KV (Redis) — perzistentno čuvanje selekcije

## Vizuelni stil

- Boje: tamno zelena + krem/bela (premium, forest feel)
- Layout: masonry grid (1 kolona mobilni / 2 tablet / 3 desktop)
- Animacije: iste kao vijetnam-ture (fade + subtle scale)

## Struktura projekta

```
eco-list-galerija/
├── app/
│   ├── page.js
│   ├── layout.js
│   └── api/
│       └── selection/
│           └── route.js
├── components/
│   ├── Gallery.js
│   ├── Lightbox.js
│   └── Tabs.js
├── lib/
│   └── images.js
└── public/images/
```

## Komponente

### `page.js`
Jedina stranica. Drži state:
- `activeTab` — "sve" | "odabrane"
- `selectedIds` — Set ID-eva odabranih slika (učitava se sa API pri mount-u)
- `lightboxIndex` — index otvorene slike ili `null`

Pri mount-u: `GET /api/selection` → popunjava `selectedIds`.

### `Tabs.js`
Dva taba: "Sve fotografije" i "Odabrane (N)". Broj odabranih se prikazuje u zagradi. Aktivni tab ima zeleni underline.

### `Gallery.js`
- Masonry columns layout (CSS columns, `break-inside-avoid`)
- Prima `images[]` i `selectedIds` Set kao props
- Po svakoj slici: hover overlay sa srce/checkmark ikonom za selekciju
- Klik na sliku → otvara Lightbox
- Kada je `activeTab === "odabrane"`, filtrira samo odabrane slike

### `Lightbox.js`
- Fullscreen overlay (black/90)
- Prev/Next dugmad (wrapping: posle poslednje ide na prvu i obrnuto)
- Keyboard: ArrowLeft/ArrowRight/Escape
- Touch swipe: swipeLeft → next, swipeRight → prev
- Counter: "3 / 12"
- Navigacija radi kroz trenutno aktivne slike (sve ili samo odabrane)

### `api/selection/route.js`
- `GET` → vraća `string[]` ID-eva iz Vercel KV key `eco-list-selection`
- `POST { id, action: "add" | "remove" }` → update KV, vraća novi niz ID-eva

## Zaštita slika

- `onContextMenu={e => e.preventDefault()}` — blokira desni klik
- `draggable="false"` na svim `<img>` tagovima
- CSS: `user-select: none`, `-webkit-touch-callout: none`, `pointer-events: none` na img (pointer events na button wraperu)
- Transparentni `<div>` overlay na svakoj slici — blokira native drag & long-press save na mobilnom

Napomena: OS-level screenshot alati (Snipping Tool, macOS shortcuts, mobilni screenshot) ne mogu biti blokirani web tehnologijama.

## Selekcija — flow

1. Korisnik hover-uje sliku → pojavljuje se srce/checkmark ikona
2. Klik na ikonu → `POST /api/selection { id, action }` → update `selectedIds` state
3. State se odmah reflektuje u UI (optimistic update)
4. Ako je korisnik u "Odabrane" tabu i de-selektuje sliku, slika se animira van liste odmah (ne čeka refresh)
5. Selekcija perzistuje u Vercel KV — dostupna svima sa linkom

## Test slike

Za početak: 8-10 placeholder slika iz `public/images/` (priroda, ekološke teme). Klijent će dodati prave slike kasnije.

## Deployment

- GitHub repo: `eco-list-galerija`
- Vercel projekat sa istim imenom
- Vercel KV: kreirati KV store u Vercel dashboard i dodati env varijable
