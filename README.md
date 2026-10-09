# Browser Telemetry

A tiny single-page website that shows what your browser reveals about the machine
it's running on — GPU, CPU, memory, battery, screen, network, and more.

Everything runs locally in the browser. Nothing is collected or sent anywhere.

## How to use

1. Go to the website.
2. Click the red **CLICK HERE** button.
3. See your GPU, CPU, battery, and other telemetry data.

Some fields may show `unavailable` — browsers hide or round certain values for
privacy. Chromium-based browsers (Chrome, Edge) expose the most; Firefox and
Safari reveal less.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

This produces a static site in the `out/` folder that can be hosted anywhere
(GitHub Pages, Netlify, Cloudflare Pages, Vercel, or any static host).

## Tech

Next.js (App Router) with static export.
