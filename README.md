# 🚗 Code Route — رخصة السياقة صنف ب

An interactive Arabic-language quiz & study app for the **Tunisian Category B driving license exam**, built as a Progressive Web App (PWA) installable on any phone.

Live demo: [code-route.vercel.app](https://code-route.vercel.app)

---

## Tech Stack

| Layer      | Technology                   |
| ---------- | ---------------------------- |
| Framework  | React 18 + TypeScript        |
| Build tool | Vite 6                       |
| Styling    | Tailwind CSS v3              |
| PWA        | vite-plugin-pwa (Workbox)    |
| Deployment | Vercel (auto-deploy on push) |
| Font       | Cairo (Google Fonts)         |

---

## Features

- **11 quiz packs** — full pack, 30 random questions, and 9 themed packs by topic
- **40-second countdown timer** per question with warning pulse animation
- **Instant feedback** — correct answer revealed in green on wrong answer or timeout
- **Mistake review** — collapsible section on result screen showing every wrong answer, what you chose, and the correct answer
- **Early end** — custom modal with live stats (answered / correct / remaining)
- **Study mode (الدروس)** — all questions grouped by category with correct answers only, live search, category filter chips
- **PWA** — installable on Android & iOS, works fully offline after first visit
- **Responsive** — mobile-first design, works on all screen sizes

---

## Project Structure

```
src/
├── components/
│   ├── Nav.tsx                  # Sticky top navigation
│   ├── quiz/
│   │   ├── PackGrid.tsx         # Pack selection cards
│   │   ├── QuizScreen.tsx       # Active quiz (question + options)
│   │   ├── Timer.tsx            # Countdown circle
│   │   ├── EndModal.tsx         # End quiz confirmation modal
│   │   ├── ResultScreen.tsx     # Score + stats
│   │   └── ReviewSection.tsx    # Collapsible mistake review
│   └── course/
│       ├── CourseScreen.tsx     # Study section with search & filters
│       └── CategoryGroup.tsx    # Collapsible category accordion
├── data/
│   ├── questions.ts             # All 180+ questions (typed)
│   └── packs.ts                 # Pack definitions with filters
├── hooks/
│   └── useQuiz.ts               # All quiz engine logic (custom hook)
├── App.tsx
├── main.tsx
└── index.css                    # Tailwind directives + custom components
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Deploying to Vercel

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Vercel auto-detects Vite — no config needed
4. Click Deploy → live in ~30 seconds

Every `git push` triggers an automatic redeploy.

---

## PWA Installation

**Android (Chrome):** A green "تثبيت" banner appears automatically — tap to install.

**iOS (Safari):** Tap Share → "Add to Home Screen".

Once installed, the app works **fully offline**.

---

## License

MIT
