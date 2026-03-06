# Annual Report Platform

Bilingual annual report website for a research institute, built with TanStack Start + TypeScript.

## Features

- DE/EN locale-aware routes (`/:locale/...`)
- Required report sections enforced by contract:
  - foreword
  - articles
  - stats
  - projects
  - highlights
  - cooperation partners
- MDX narrative content per year and locale
- JSON-driven structured content (KPIs, charts, projects, highlights, partners)
- Motion-powered section and chart animations via `motion`
- Year-specific custom layouts with automatic default fallback

## Quick Start

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000/de`
- `http://localhost:3000/en`

## Commands

```bash
npm run dev
npm run test
npm run build
npm run preview
```

## Project Structure

```
src/
  components/
    charts/
    layout/
    motion/
    navigation/
  content/
    years/<year>/
      meta.json
      data.json
      de/*.mdx
      en/*.mdx
  lib/
    content/
    i18n/
    layout/
  routes/
    index.tsx
    $locale/
      route.tsx
      index.tsx
      report/$year.tsx
```

## Routing Model

- `/` redirects to default locale (`/de`)
- `/$locale` yearly overview page
- `/$locale/report/$year` report detail page

## Layout Resolution

- Custom layouts are registered in `src/lib/layout/layoutRegistry.ts`
- Registered year -> custom layout
- Unregistered year -> default fallback layout

## Authoring New Year Content

Follow `docs/spec/annual-report-authoring.md`.

In short:

1. Add `src/content/years/<year>/` package
2. Add localized `meta.json` and `data.json`
3. Add all required DE and EN MDX section files
4. Optionally register a custom layout for that year
5. Run `npm run test && npm run build`

## Design and Contracts

- Technical design: `docs/tdd/annual-report-platform.md`
- UX spec: `docs/ux/annual-report-design-system.md`
- Section contract: `docs/spec/annual-report-sections-contract.md`
- Localization contract: `docs/spec/annual-report-localization-contract.md`
- QA checklist: `docs/spec/qa-checklist.md`
