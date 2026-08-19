spec.md — "Brainy Quest" Gamified Review App for Grade 4

A game-style quiz reviewer for a 9-year-old (Grade 4, Philippines / DepEd-aligned) that turns review sessions into an exciting adventure. Built to fix low retention caused by boring rote memorization — by tying correct answers to positive emotion, celebration, and story.

## 1. Goal & Problem

Who: One primary player — a 9-year-old in Grade 4 (DepEd curriculum: Science, Math, English, Filipino).

Problem to solve:
- She gets bored quickly during review.
- Lessons feel like "too much to memorize."
- Retention is low because memorizing carries no excitement — no emotion, no reward.

Design thesis: Memory sticks when it's attached to emotion. Every correct answer should feel like a small win (sound, animation, points, praise). Every wrong answer should feel safe and instructive (no punishment, a friendly explanation, and the question comes back later). Wrap the whole thing in a light story/theme so a "review session" feels like "playing a game."

Success looks like: She asks to do a round. She finishes 10–20 questions without complaining. She remembers more the next day.

## 2. Core Features (v1)

1. Quiz rounds of 10–20 questions. Configurable round length (default 20). Questions pulled from a chosen subject + topic.
2. Multiple question formats to keep it fresh within a round:
   - Multiple choice (4 options)
   - True / False
   - Fill in the blank (tap-to-choose from a word bank — avoid heavy typing for a 9-year-old)
   - Simple matching (match term ↔ meaning)
3. The Excitement Engine (gamification):
   - Points per correct answer.
   - Streak multiplier — consecutive correct answers boost points (3-streak, 5-streak = "On Fire!").
   - Instant celebration — confetti/animation + a happy sound on correct; a gentle, encouraging animation on wrong (never scary or negative).
   - Progress bar for the round ("Question 12 of 20").
   - Companion character that reacts (cheers, does a little dance on a streak, gives a thumbs-up on a comeback).
   - Badges / achievements — e.g. "First 100 points," "5 in a row," "Digestive System Master," "Perfect Round."
   - Level up — total points across sessions raise her level and unlock rewards (new avatar accessory, new theme color, new companion).
   - End-of-round summary — score, best streak, stars earned (1–3 stars based on % correct), and a "Play Again" / "Try a Harder Round" button.
4. Learning-first feedback (this is the retention fix):
   - After each answer, show whether it was right/wrong plus a one-line kid-friendly explanation of why.
   - Miss-it-again logic: any question she gets wrong is re-queued to appear again later in the same round (and prioritized next session). Simple spaced repetition.
5. Subject & topic picker — friendly icon buttons (🔬 Science, ➗ Math, 📘 English, 📗 Filipino). Each subject → list of topics.
6. Progress saving — points, level, badges, and per-topic accuracy persist on the device (localStorage in v1).
7. Parent-friendly content editing — question bank lives in plain JSON files so a parent can add/edit questions without touching app logic.

## 3. Kid-Friendly UX Principles (important — this is a 9-year-old, not an adult)

- Big, tappable buttons. Minimum ~64px touch targets. Answers are big cards, not tiny radio buttons.
- Big, rounded, friendly typography. High contrast. Short sentences.
- Minimal reading load. Prefer tap-to-answer over typing. Word banks instead of free text.
- Bright, warm color palette (the "Explorer Adventure" theme). Avoid harsh red for "wrong" — use a soft orange + a kind message instead.
- Sound on by default, with a mute toggle (parent may want quiet mode). Correct = cheerful chime; streak = level-up jingle; wrong = a soft, non-scary "aww, try again."
- No dark patterns, no ads, no external links. Fully self-contained and safe.
- Fast. No loading spinners between questions. Instant transitions.
- Optional timer — OFF by default (timers stress some kids). Can be turned on as a "Challenge Mode" for extra points.
- Works on tablet, phone, and laptop — responsive layout, portrait-friendly (she'll likely use a tablet/phone).

## 4. App Flow

```
Home / Map Screen
  → shows companion character, current level, total points, badges earned
  → "Start Adventure" button
      → Pick Subject (Science / Math / English / Filipino)
          → Pick Topic (e.g. Science → Digestive System)
              → Pick Round Length (10 / 20) — default 20
              → Pick Mode (Normal / Challenge with timer)
                  → QUIZ ROUND
                      - question card + answer options
                      - answer → instant feedback + explanation + points/streak animation
                      - repeat for N questions (wrong ones re-queued)
                  → ROUND SUMMARY
                      - score, best streak, stars (1–3), new badges, points added
                      - "Play Again" | "Pick New Topic" | "Home"
```

## 5. Data Model (Question Bank)

Questions live in JSON so content is easy to add and separate from code. Suggested structure: one file per subject (e.g. `data/science.json`), each an array of question objects.

```json
{
  "id": "sci-digest-001",
  "subject": "science",
  "topic": "digestive_system",
  "grade": 4,
  "difficulty": "easy",
  "type": "multiple_choice",
  "question": "Which organ breaks down food using strong acids?",
  "options": ["Heart", "Stomach", "Lungs", "Brain"],
  "answer": "Stomach",
  "explanation": "The stomach uses acids to mash food into a soupy mix so the body can use it.",
  "hint": "It growls when you're hungry."
}
```

Type variants:
- `"type": "true_false"` → `"options": ["True", "False"]`, `"answer": "True"`
- `"type": "fill_blank"` → `"question"` contains a `___`, `"options"` is the word bank, `"answer"` is the correct word.
- `"type": "matching"` → `"pairs": [{"term": "...", "match": "..."}, ...]` (render as a matching mini-game).

Fields: `id` (unique), `subject`, `topic`, `grade`, `difficulty` (`easy`/`medium`/`hard`), `type`, `question`, `options`/`pairs`, `answer`, `explanation` (required — powers the learning), `hint` (optional, tap to reveal, costs no points).

## 6. Subjects & Scope

v1 ships with Science fully populated, and the app is architected so Math, English, and Filipino are added by dropping in more JSON — no code changes.

Science topics for v1:
- Digestive System
- Circulatory System
- Muscular System
- Skeletal System

(Math / English / Filipino topic lists can be filled next — placeholders in the UI are fine for v1.)

## 7. Sample Question Bank — Science (v1 content)

See `src/data/science.json` for the full, structured question bank (~26 questions across the four body systems, mixing all four question formats, every question with an explanation).

## 8. Tech Stack

v1 (implemented):
- React + Vite (single-page app), Tailwind CSS for styling.
- No backend / no database. Question bank = local JSON files.
- Progress persistence: `localStorage` (points, level, badges, per-topic accuracy).
- Animations: Framer Motion for confetti, streak pops, transitions.
- Sound: synthesized tones via the Web Audio API (no external audio files needed).
- Deploy: Vercel (one-click, matches existing workflow).

Phase 2 (optional, only if a parent dashboard / cross-device progress is wanted later):
- Add Supabase (Postgres) to store progress per child and let a parent view accuracy trends over time.
- This aligns with the existing Next.js + Supabase + Prisma + Vercel stack — the JSON question bank can migrate into a `questions` table with the same shape as Section 5.

## 9. Build Phases

Phase 1 — Playable core: Home screen, subject/topic picker, quiz round engine (MC + T/F), instant feedback + explanation, points + streaks, round summary with stars, localStorage progress. Ship with the Science question bank above.

Phase 2 — Excitement polish: Companion character + reactions, confetti/animations, sound effects, badges, level-up + unlockable rewards, fill-in-the-blank and matching question types, optional Challenge (timer) mode, miss-it-again re-queue.

Phase 3 — Content expansion: Populate Math, English, Filipino JSON banks. Optional Supabase parent dashboard.

## 10. Non-Goals (v1)

- No user accounts / login (single child, single device).
- No ads, no in-app purchases, no external links.
- No multiplayer.
- No heavy text typing (keep it tap-first).

## 11. Notes for the Builder

- Keep all copy simple and warm — write for a 9-year-old.
- Never make "wrong" feel like failure. Encourage, explain, move on.
- The `explanation` field is not optional decoration — it's the core learning mechanism. Always show it.
- Make it trivial for a parent to add questions: drop a new object into the subject's JSON, matching the schema in Section 5.
