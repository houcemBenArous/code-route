/**
 * quiz.js
 * Core quiz engine — state management, timer, rendering, scoring.
 */

// ─── State ────────────────────────────────────────────────────────────────────
let questions   = [];
let currentIndex = 0;
let correctCount = 0;
let wrongCount   = 0;
let timer        = null;
let timeLeft     = 30;
let answered     = false;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Fisher-Yates shuffle — returns a shuffled copy of the array.
 * @param {Array} arr
 * @returns {Array}
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Shorthand for document.getElementById */
function $(id) {
  return document.getElementById(id);
}

// ─── Quiz Lifecycle ───────────────────────────────────────────────────────────

/** Initialise and start a new quiz session. */
function startQuiz() {
  questions    = shuffle(allQuestions);
  currentIndex = 0;
  correctCount = 0;
  wrongCount   = 0;

  $('startScreen').style.display = 'none';
  $('quizScreen').style.display  = 'block';
  $('resultScreen').classList.remove('show');
  $('totalQ').textContent = questions.length;

  loadQuestion();
}

/** Load the current question into the DOM. */
function loadQuestion() {
  answered = false;
  timeLeft = 30;
  clearInterval(timer);

  const q     = questions[currentIndex];
  const total = questions.length;

  // Stats & progress
  $('currentQ').textContent    = currentIndex + 1;
  $('correctCount').textContent = correctCount;
  $('wrongCount').textContent   = wrongCount;
  $('progressBar').style.width  = `${(currentIndex / total) * 100}%`;

  // Question
  $('categoryBadge').innerHTML = `<span class="category-badge">${q.cat}</span>`;
  $('questionText').textContent = q.q;

  // Reset feedback & next button
  const feedback = $('feedback');
  feedback.className   = 'feedback';
  feedback.textContent = '';
  $('nextBtn').className = 'next-btn';

  // Build shuffled options
  const container = $('optionsContainer');
  container.innerHTML = '';

  shuffle([0, 1, 2]).forEach((origIdx) => {
    const btn       = document.createElement('button');
    btn.className   = 'option-btn';
    btn.textContent = q.opts[origIdx];
    btn.onclick     = () => selectAnswer(btn, origIdx === q.ans);
    container.appendChild(btn);
  });

  // Start countdown
  updateTimerDisplay();
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      onTimeout();
    }
  }, 1000);
}

// ─── Timer ────────────────────────────────────────────────────────────────────

function updateTimerDisplay() {
  const circle = $('timerCircle');
  circle.textContent = timeLeft;
  circle.classList.toggle('warning', timeLeft <= 10);
}

// ─── Answer Handling ──────────────────────────────────────────────────────────

/**
 * Called when the user selects an answer.
 * @param {HTMLButtonElement} btn      - The clicked button
 * @param {boolean}           isCorrect
 */
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

/** Called when the timer runs out before the user answers. */
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

/**
 * Highlight the correct answer button in green.
 * @param {NodeList} allBtns
 */
function revealCorrectAnswer(allBtns) {
  const correctText = questions[currentIndex].opts[questions[currentIndex].ans];
  allBtns.forEach(b => {
    if (b.textContent === correctText) b.classList.add('reveal');
  });
}

// ─── Navigation ───────────────────────────────────────────────────────────────

/** Advance to the next question or show results if the quiz is over. */
function nextQuestion() {
  currentIndex++;
  if (currentIndex >= questions.length) {
    showResult();
  } else {
    loadQuestion();
  }
}

/**
 * Ask for confirmation then end the quiz early.
 * Remaining unanswered questions are counted as wrong.
 */
function confirmEndQuiz() {
  const msg = 'هل أنت متأكد أنك تريد إنهاء الاختبار؟\nستُحتسب الأسئلة غير المُجاب عنها كإجابات خاطئة.';
  if (!confirm(msg)) return;

  clearInterval(timer);
  const remaining = questions.length - currentIndex - (answered ? 1 : 0);
  wrongCount += remaining;
  showResult();
}

// ─── Results ──────────────────────────────────────────────────────────────────

/** Calculate score and render the result screen. */
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
  $('resultScore').textContent = `نسبتك: ${pct}% ${passed ? '— تجاوزت عتبة 80%' : '— لم تبلغ عتبة 80% المطلوبة'}`;

  $('resultDetails').innerHTML = `
    <p>✅ إجابات صحيحة: <strong>${correctCount}</strong></p>
    <p>❌ إجابات خاطئة: <strong>${wrongCount}</strong></p>
    <p>📋 مجموع الأسئلة: <strong>${total}</strong></p>
    <p>🎯 النسبة المئوية: <strong>${pct}%</strong></p>
    ${!passed ? '<p style="color:#dc3545;margin-top:10px;">⚠️ يجب إعادة الاختبار لتحسين نتيجتك.</p>' : ''}
  `;
}

/** Reset UI and go back to the start screen. */
function restartQuiz() {
  $('resultScreen').classList.remove('show');
  $('startScreen').style.display = 'block';
  $('quizScreen').style.display  = 'none';
}

// ─── Init ─────────────────────────────────────────────────────────────────────
$('totalQCount').textContent = allQuestions.length;
