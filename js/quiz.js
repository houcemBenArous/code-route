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
    desc:   'حدود السرعة، مسافة التوقف والأمان، المطر',
    filter: q => q.cat === 'السرعة' || q.cat === 'المطر والأمان' || q.cat === 'مسافة التوقف والأمان',
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
let history      = [];     // { q, chosenText, correct: bool, timeout: bool, skipped: bool }

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
  history      = [];

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
    history.push({ q: questions[currentIndex], chosenText: btn.textContent, correct: true, timeout: false, skipped: false });
  } else {
    btn.classList.add('wrong');
    wrongCount++;
    revealCorrectAnswer(allBtns);
    feedback.textContent = '❌ إجابة خاطئة! الإجابة الصحيحة مُعلَّمة باللون الأخضر.';
    feedback.className   = 'feedback show wrong-fb';
    history.push({ q: questions[currentIndex], chosenText: btn.textContent, correct: false, timeout: false, skipped: false });
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
  history.push({ q: questions[currentIndex], chosenText: null, correct: false, timeout: true, skipped: false });
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
  // Populate live stats in the modal
  const answered_so_far = currentIndex + (answered ? 1 : 0);
  const remaining       = questions.length - answered_so_far;
  document.getElementById('modalStats').innerHTML = `
    <div class="modal-stat-item">
      <span class="modal-stat-value">${answered_so_far}</span>
      <span class="modal-stat-label">سؤال أُجيب عنه</span>
    </div>
    <div class="modal-stat-item">
      <span class="modal-stat-value" style="color:#28a745">${correctCount}</span>
      <span class="modal-stat-label">إجابة صحيحة</span>
    </div>
    <div class="modal-stat-item">
      <span class="modal-stat-value" style="color:#e94560">${remaining}</span>
      <span class="modal-stat-label">سؤال متبقٍّ</span>
    </div>
  `;
  document.getElementById('endQuizModal').classList.add('open');
}

function closeEndQuizModal() {
  document.getElementById('endQuizModal').classList.remove('open');
}

function endQuizConfirmed() {
  closeEndQuizModal();
  clearInterval(timer);

  // Record current question as skipped if not yet answered
  if (!answered && currentIndex < questions.length) {
    history.push({ q: questions[currentIndex], chosenText: null, correct: false, timeout: false, skipped: true });
  }

  // Mark all remaining questions as skipped
  const startSkip = currentIndex + (answered ? 1 : 1);
  for (let i = startSkip; i < questions.length; i++) {
    history.push({ q: questions[i], chosenText: null, correct: false, timeout: false, skipped: true });
    wrongCount++;
  }

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

  renderReview();
}

/** Build the mistakes review list. */
function renderReview() {
  const mistakes = history.filter(h => !h.correct);
  const section  = $('reviewSection');
  const list     = $('reviewList');

  if (mistakes.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  // Reset to collapsed state
  list.classList.remove('open');
  $('reviewChevron').classList.remove('open');
  $('reviewToggleLabel').textContent = `📋 مراجعة الأخطاء (${mistakes.length} خطأ)`;

  list.innerHTML = mistakes.map((h, i) => {
    const correctText = h.q.opts[h.q.ans];
    let chosenBlock = '';

    if (h.skipped) {
      chosenBlock = `
        <div class="review-answer skipped-ans">
          <span class="review-answer-icon">⏭️</span>
          <div class="review-answer-text">
            <span class="review-answer-label">لم يُجَب عنه</span>
            السؤال تم تخطيه
          </div>
        </div>`;
    } else if (h.timeout) {
      chosenBlock = `
        <div class="review-answer timeout-ans">
          <span class="review-answer-icon">⏰</span>
          <div class="review-answer-text">
            <span class="review-answer-label">انتهى الوقت</span>
            لم يتم الإجابة في الوقت المحدد
          </div>
        </div>`;
    } else {
      chosenBlock = `
        <div class="review-answer wrong-ans">
          <span class="review-answer-icon">❌</span>
          <div class="review-answer-text">
            <span class="review-answer-label">إجابتك</span>
            ${h.chosenText}
          </div>
        </div>`;
    }

    return `
      <div class="review-card">
        <div class="review-card-num">خطأ ${i + 1} / ${mistakes.length}</div>
        <span class="review-card-cat">${h.q.cat}</span>
        <div class="review-card-question">${h.q.q}</div>
        <div class="review-answers">
          ${chosenBlock}
          <div class="review-answer correct-ans">
            <span class="review-answer-icon">✅</span>
            <div class="review-answer-text">
              <span class="review-answer-label">الإجابة الصحيحة</span>
              ${correctText}
            </div>
          </div>
        </div>
      </div>`;
  }).join('');
}

/** Toggle the review list open/closed. */
function toggleReview() {
  const list    = $('reviewList');
  const chevron = $('reviewChevron');
  const label   = $('reviewToggleLabel');
  const isOpen  = list.classList.toggle('open');
  chevron.classList.toggle('open', isOpen);
  const count = history.filter(h => !h.correct).length;
  label.textContent = isOpen
    ? `📋 إخفاء مراجعة الأخطاء (${count} خطأ)`
    : `📋 مراجعة الأخطاء (${count} خطأ)`;
}

/** Restart the same pack (useful after a failed attempt). */
function restartCurrentPack() {
  if (currentPack) startPack(currentPack);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
renderPackScreen();

// Close modal when clicking the dark overlay (outside the box)
document.getElementById('endQuizModal').addEventListener('click', function (e) {
  if (e.target === this) closeEndQuizModal();
});
