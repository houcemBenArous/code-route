# 🚗 Tunisian Driving License Quiz — Category B

An interactive Arabic-language quiz app to help prepare for the **Tunisian Category B driving license exam**. Built with pure HTML, CSS, and JavaScript — no dependencies, no install required.

---

## 📁 Project Structure

```
code permis/
├── quiz.html       # The quiz application (open this in your browser)
├── .gitignore      # Excludes rules.md from version control
└── README.md       # This file
```

> **Note:** `rules.md` (the source study material) is listed in `.gitignore` and is not tracked by Git.

---

## 🚀 How to Use

1. Open `quiz.html` in any modern web browser (Chrome, Firefox, Edge, etc.)
2. The start screen shows the total number of questions and the rules
3. Click **"ابدأ الاختبار"** to begin
4. Read each question and select your answer within **30 seconds**
5. If time runs out, the correct answer is revealed and the question is marked wrong
6. At the end, your score is displayed with a pass or fail result

---

## 🎯 Quiz Rules

| Rule                  | Detail                                 |
| --------------------- | -------------------------------------- |
| Questions per session | All questions (75+), shuffled randomly |
| Time per question     | 30 seconds                             |
| Pass threshold        | **80% or higher**                      |
| Question order        | Random every session                   |
| Answer choices        | 3 options per question                 |

---

## 📚 Topics Covered

All questions are based strictly on `rules.md` and cover:

- **Category B License** — seat limits, weight limits, trailer rules, permitted vehicle classes
- **Violations & Penalties** — point deductions, fines, prison terms, license suspension
- **Speed Limits** — urban, rural, highway, trainee driver limits, rain/fog reductions
- **Parking & Stopping** — definitions, distances, curb colors, excessive parking
- **Lights** — headlights, dipped beams, position lights, range distances
- **Overtaking** — direction rules, lateral distances, prohibited situations
- **Road Signs & Traffic Rules** — priority order, roundabouts, stop signs
- **First Aid** — emergency numbers, CPR rates, bleeding protocol, unconscious victim positioning
- **Mechanics** — battery, air filter, spark plugs, tire pressure, fluid levels
- **Load Rules** — front/rear overhang limits, marking requirements
- **License Renewal** — renewal schedule by age group
- **Technical Inspection** — periodic and random inspection rules

---

## ✅ Pass / Fail

- **Pass:** Score ≥ 80% → 🏆 Congratulations screen
- **Fail:** Score < 80% → 😞 Fail screen with a prompt to retry

You can restart the quiz at any time from the result screen. Each new session reshuffles all questions.

---

## 🛠️ Technical Details

- **No frameworks or libraries** — plain HTML5, CSS3, and vanilla JavaScript
- **No internet connection required** — fully offline
- **Single file** — everything is self-contained in `quiz.html`
- Compatible with all modern browsers on Windows, macOS, and mobile

---

## 📝 Source Material

All quiz content is derived from `rules.md`, which contains the official Tunisian driving regulations for Category B, including traffic law, first aid procedures, vehicle mechanics, and road sign rules.

`rules.md` is excluded from version control via `.gitignore` — it is private study material and should not be committed to any repository.
