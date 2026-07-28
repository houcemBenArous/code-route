/**
 * quiz.js
 * Core quiz engine — pack definitions, state management, timer, rendering, scoring.
 */

// ─── Pack Definitions ─────────────────────────────────────────────────────────

/**
 * Each pack:
 *   id        – unique key
 *   name      – Arabic display name
 *   icon      – emoji
 *   desc      – short Arabic description shown on the card
 *   filter    – function(q) → true if question belongs to this pack
 *   limit     – max questions per session (null = all)
 *   featured  – true → red highlight card (main pack)
 */
const PACKS = [
  {
    id:       'all',
    name:     'الحزمة الكاملة',
    icon:     '📚',
    desc:     'جميع الأسئلة من كل المحاور',
    filter:   () => true,
    limit:    null,
    featured: true,
  },
  {
    id:     'random30',
    name:   '30 سؤال عشوائي',
    icon:   '🎲',
    desc:   '30 سؤالاً مختلطاً من جميع المحاور',
    filter: () => true,
    limit:  30,
  },
  {
    id:     'violations',
    name:   'المخالفات والعقوبات',
    icon:   '⚖️',
    desc:   'خصم النقاط، الغرامات، السجن',
    filter: q => q.cat === 'المخالفات',
    limit:  null,
  },
  {
    id:     'mechanics',
    name:   'الميكانيك والصيانة',
    icon:   '🔧',
    desc:   'البطارية، العجلات، الزيوت، الشمعات',
    filter: q => q.cat === 'الميكانيك',
    limit:  null,
  },
  {
    id:     'firstaid',
    name:   'الإسعافات الأولية',
    icon:   '🚑',
    desc:   'التنفس الاصطناعي، النزيف، أرقام الطوارئ',
    filter: q => q.cat === 'الإسعافات الأولية',
    limit:  null,
  },
  {
    id:     'speed',
    name:   'السرعة والمطر',
    icon:   '🚦',
    desc:   'حدود السرعة داخل وخارج مناطق العمران',
    filter: q => q.cat === 'السرعة' || q.cat === 'المطر والأمان',
    limit:  null,
  },
  {
    id:     'parking',
    name:   'الوقوف والتوقف',
    icon:   '🅿️',
    desc:   'المسافات، ألوان الأرصفة، الوقوف المفرط',
    filter: q => q.cat === 'الوقوف والتوقف',
    limit:  null,
  },
  {
    id:     'lights',
    name:   'الأضواء',
    icon:   '💡',
    desc:   'ضوء الطريق، المقاطعة، الوضعية',
    filter: q => q.cat === 'الأضواء',
    limit:  null,
  },
  {
    id:     'overtaking',
    name:   'المجاوزة وإشارات الطريق',
    icon:   '🛣️',
    desc:   'قواعد المجاوزة، الأولويات، الإشارات',
    filter: q => q.cat === 'المجاوزة' || q.cat === 'إشارات الطريق',
    limit:  null,
  },
  {
    id:     'license',
    name:   'رخصة صنف ب وتجديدها',
    icon:   '🪪',
    desc:   'شروط الرخصة، الفحص الفني، التجديد',
    filter: q => q.cat === 'رخصة صنف ب' || q.cat === 'الفحص الفني' || q.cat === 'تجديد الرخصة',
    limit:  null,
  },
  {
    id:     'load',
    name:   'الحمولة',
    icon:   '📦',
    desc:   'قواعد الحمولة الأمامية والخلفية',
    filter: q => q.cat === 'الحمولة',
    limit:  null,
  },
];

// ─── State ────────────────────────────────────────────────────────────────────
let currentPack  = null;   // active PACKS entry
let questions    = [];
let currentIndex = 0;
let correctCount = 0;
let wrongCount   = 0;
let timer        = null;
let timeLeft     = 30;
let answered     = false;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Fisher-Yates shuffle — returns a new shuffled array. */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Shorthand for getElementById. */
const $ = id => document.getElementById(id);

// ─── Pack Screen ──────────────────────────────────────────────────────────────

/** Render all pack cards into #packsGrid. */
function renderPackScreen() {
  $('packScreen').style.display    = 'block';
  $('quizScreen').style.display    = 'none';
  $('resultScreen').classList.remove('show');

  const grid = $('packsGrid');
  grid.innerHTML = '';

  PACKS.forEach(pack => {
    // Count available questions
    const pool  = allQuestions.filter(pack.filter);
    const count = pack.limit ? Math.min(pack.limit, pool.length) : pool.length;

    const card = document.createElement('div');
    card.className = 'pack-card' + (pack.featured ? ' featured' : '');
    card.innerHTML = `
      <div class="pack-icon">${pack.icon}</div>
      <div class="pack-name">${pack.name}</div>
      <div class="pack-meta">${pack.desc}</div>
      <span class="pack-badge">${count} سؤال</span>
    `;
    card.onclick = () => startPack(pack);
    grid.appendChild(card);
  });
}

// ─── Quiz Lifecycle ───────────────────────────────────────────────────────────

/**
 * Start a quiz session for the given pack.
 * @param {object} pack - one entry from PACKS
 */
function startPack(pack) {
  currentPack = pack;

  // Build question pool
  let pool = shuffle(allQuestions.filter(pack.filter));
  if (pack.limit && pool.length > pack.limit) {
    pool = pool.slice(0, pack.limit);
  }

  questions    = pool;
  currentIndex = 0;
  correctCount = 0;
  wrongCount   = 0;

  $('packScreen').style.display    = 'none';
  $('quizScreen').style.display    = 'block';
  $('resultScreen').classList.remove('show');

  $('packLabel').textContent = `${pack.icon} ${pack.name}`;
  $('totalQ').textContent    = questions.length;

  loadQuestion();
}

/** Load the current question into the DOM. */
function loadQuestion() {
  answered = false;
  timeLeft = 30;
  clearInterval(timer);

  const q     = questions[currentIndex];
  const total = questions.length;

  $('currentQ').textContent     = currentIndex + 1;
  $('correctCount').textContent = correctCount;
  $('wrongCount').textContent   = wrongCount;
  $('progressBar').style.width  = `${(currentIndex / total) * 100}%`;

  $('categoryBadge').innerHTML  = `<span class="category-badge">${q.cat}</span>`;
  $('questionText').textContent = q.q;

  const feedback = $('feedback');
  feedback.className   = 'feedback';
  feedback.textContent = '';
  $('nextBtn').className = 'next-btn';

  const container = $('optionsContainer');
  container.innerHTML = '';

  shuffle([0, 1, 2]).forEach(origIdx => {
    const btn       = document.createElement('button');
    btn.className   = 'option-btn';
    btn.textContent = q.opts[origIdx];
    btn.onclick     = () => selectAnswer(btn, origIdx === q.ans);
    container.appendChild(btn);
  });

  updateTimerDisplay();
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) { clearInterval(timer); onTimeout(); }
  }, 1000);
}

// ─── Timer ────────────────────────────────────────────────────────────────────

function updateTimerDisplay() {
  const circle = $('timerCircle');
  circle.textContent = timeLeft;
  circle.classList.toggle('warning', timeLeft <= 10);
}

// ─── Answer Handling ──────────────────────────────────────────────────────────

function selectAnswer(btn, isCorrect) {
  if (answered) return;
  answered = true;
  clearInterval(timer);

  const allBtns = document.querySelectorAll('.option-btn');
  allBtns.forEach(b => (b.disabled = true));

  const feedback = $('feedback');

  if (isCorrect) {
    btn.classList.add('correct');
    correctCount++;
    feedback.textContent = '✅ إجابة صحيحة!';
    feedback.className   = 'feedback show correct-fb';
  } else {
    btn.classList.add('wrong');
    wrongCount++;
    revealCorrectAnswer(allBtns);
    feedback.textContent = '❌ إجابة خاطئة! الإجابة الصحيحة مُعلَّمة باللون الأخضر.';
    feedback.className   = 'feedback show wrong-fb';
  }

  $('nextBtn').className = 'next-btn show';
}

function onTimeout() {
  if (answered) return;
  answered = true;
  wrongCount++;

  const allBtns = document.querySelectorAll('.option-btn');
  allBtns.forEach(b => (b.disabled = true));
  revealCorrectAnswer(allBtns);

  const feedback       = $('feedback');
  feedback.textContent = '⏰ انتهى الوقت! الإجابة الصحيحة مُعلَّمة باللون الأخضر.';
  feedback.className   = 'feedback show timeout-fb';
  $('nextBtn').className = 'next-btn show';
}

function revealCorrectAnswer(allBtns) {
  const correctText = questions[currentIndex].opts[questions[currentIndex].ans];
  allBtns.forEach(b => {
    if (b.textContent === correctText) b.classList.add('reveal');
  });
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= questions.length) {
    showResult();
  } else {
    loadQuestion();
  }
}

function confirmEndQuiz() {
  const msg = 'هل أنت متأكد أنك تريد إنهاء الاختبار؟\nستُحتسب الأسئلة غير المُجاب عنها كإجابات خاطئة.';
  if (!confirm(msg)) return;
  clearInterval(timer);
  const remaining = questions.length - currentIndex - (answered ? 1 : 0);
  wrongCount += remaining;
  showResult();
}

function goBackToPacks() {
  clearInterval(timer);
  renderPackScreen();
}

// ─── Results ──────────────────────────────────────────────────────────────────

function showResult() {
  clearInterval(timer);
  $('quizScreen').style.display = 'none';
  $('resultScreen').classList.add('show');

  const total  = questions.length;
  const pct    = Math.round((correctCount / total) * 100);
  const passed = pct >= 80;

  $('resultIcon').textContent  = passed ? '🏆' : '😞';
  $('resultTitle').textContent = passed ? 'مبروك! لقد نجحت!' : 'للأسف لم تنجح';
  $('resultTitle').className   = `result-title ${passed ? 'success' : 'fail'}`;
  $('resultScore').textContent =
    `نسبتك: ${pct}% ${passed ? '— تجاوزت عتبة 80%' : '— لم تبلغ عتبة 80% المطلوبة'}`;

  $('resultDetails').innerHTML = `
    <p>📦 الحزمة: <strong>${currentPack.icon} ${currentPack.name}</strong></p>
    <p>✅ إجابات صحيحة: <strong>${correctCount}</strong></p>
    <p>❌ إجابات خاطئة: <strong>${wrongCount}</strong></p>
    <p>📋 مجموع الأسئلة: <strong>${total}</strong></p>
    <p>🎯 النسبة المئوية: <strong>${pct}%</strong></p>
    ${!passed ? '<p style="color:#dc3545;margin-top:10px;">⚠️ يجب إعادة الاختبار لتحسين نتيجتك.</p>' : ''}
  `;
}

/** Restart the same pack (useful after a failed attempt). */
function restartCurrentPack() {
  if (currentPack) startPack(currentPack);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
renderPackScreen();
