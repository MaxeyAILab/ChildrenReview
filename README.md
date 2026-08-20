# Brainy Quest

A game-style quiz reviewer for a Grade 4 student (DepEd-aligned), built to turn review sessions into an exciting adventure. Correct answers earn points, coins, streaks, confetti, and badges; wrong answers get a gentle explanation and a chance to try again — never punishment. Coins can be spent in the Avatar Shop on hats, accessories, and backgrounds for the companion.

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- Framer Motion (animations) + canvas-confetti
- No backend — question banks are local JSON files, progress is saved in `localStorage`

## Running locally

```bash
npm install
npm run dev
```

## Adding questions

Question banks live in `src/data/*.json`, one file per subject (currently only `science.json` is populated; `math`, `english`, and `filipino` are wired up as empty arrays with "Coming Soon" topics in the UI). Each question follows the shape in `src/types.ts` — drop a new object into the right subject's array to add content, no code changes needed. To add a new topic, also add it to the subject's `topics` list in `src/data/subjects.ts`.

## Deploying

This is a static site — deploys to Vercel with zero configuration (`npm run build` outputs to `dist/`).
