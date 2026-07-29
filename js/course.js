/**
 * course.js
 * Renders the course / study section:
 *   - groups all questions by category
 *   - shows only the question + correct answer
 *   - supports live search and category filter chips
 */

// ─── Category metadata (icon per category) ───────────────────────────────────
const CAT_META = {
  'رخصة صنف ب':              { icon: '🪪' },
  'الفحص الفني':              { icon: '🔍' },
  'المخالفات':                { icon: '⚖️' },
  'السرعة':                   { icon: '🚦' },
  'المطر والأمان':            { icon: '🌧️' },
  'مسافة التوقف والأمان':     { icon: '📏' },
  'الوقوف والتوقف':           { icon: '🅿️' },
  'الأضواء':                  { icon: '💡' },
  'المجاوزة':                 { icon: '↔️' },
  'إشارات الطريق':            { icon: '🛣️' },
  'الإسعافات الأولية':        { icon: '🚑' },
  'الميكانيك':                { icon: '🔧' },
  'الحمولة':                  { icon: '📦' },
  'تجديد الرخصة':            { icon: '🔄' },
};

const DEFAULT_ICON = '📋';

// ─── State ────────────────────────────────────────────────────────────────────
let activeCat    = 'all';   // currently selected chip
let searchQuery  = '';
let courseBuilt  = false;   // only build DOM once unless forced

// ─── Entry point ─────────────────────────────────────────────────────────────

/** Called by showSection('course') in quiz.js */
function renderCourse() {
  buildChips();
  buildGroups();
  courseBuilt = true;
}

// ─── Chips ────────────────────────────────────────────────────────────────────

function buildChips() {
  const container = document.getElementById('courseChips');
  if (container.children.length > 0) return; // already built

  const cats = [...new Set(allQuestions.map(q => q.cat))];

  // "الكل" chip
  const allChip = makeChip('الكل', 'all');
  allChip.classList.add('active');
  container.appendChild(allChip);

  cats.forEach(cat => container.appendChild(makeChip(cat, cat)));
}

function makeChip(label, value) {
  const btn = document.createElement('button');
  btn.className   = 'course-chip';
  btn.textContent = label;
  btn.onclick     = () => selectChip(value, btn);
  return btn;
}

function selectChip(cat, btn) {
  activeCat = cat;
  document.querySelectorAll('.course-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  buildGroups();
}

// ─── Search ───────────────────────────────────────────────────────────────────

function filterCourse(val) {
  searchQuery = val.trim().toLowerCase();
  buildGroups();
}

// ─── Groups ───────────────────────────────────────────────────────────────────

function buildGroups() {
  const container = document.getElementById('courseContent');
  container.innerHTML = '';

  // Filter questions
  let pool = allQuestions;
  if (activeCat !== 'all') {
    pool = pool.filter(q => q.cat === activeCat);
  }
  if (searchQuery) {
    pool = pool.filter(q =>
      q.q.toLowerCase().includes(searchQuery) ||
      q.opts[q.ans].toLowerCase().includes(searchQuery)
    );
  }

  if (pool.length === 0) {
    container.innerHTML = '<div class="course-empty">🔍 لا توجد نتائج مطابقة للبحث.</div>';
    return;
  }

  // Group by category, preserving original order
  const groups = {};
  pool.forEach(q => {
    if (!groups[q.cat]) groups[q.cat] = [];
    groups[q.cat].push(q);
  });

  Object.entries(groups).forEach(([cat, qs]) => {
    container.appendChild(buildGroupEl(cat, qs));
  });
}

function buildGroupEl(cat, qs) {
  const meta    = CAT_META[cat] || { icon: DEFAULT_ICON };
  const groupEl = document.createElement('div');
  groupEl.className = 'course-group';

  // Header
  const header = document.createElement('div');
  header.className = 'course-group-header';
  header.innerHTML = `
    <div class="course-group-title">
      <span class="course-group-icon">${meta.icon}</span>
      <span>${cat}</span>
    </div>
    <div style="display:flex;align-items:center;gap:10px">
      <span class="course-group-count">${qs.length} سؤال</span>
      <span class="course-group-chevron">▼</span>
    </div>
  `;

  // Body
  const body = document.createElement('div');
  body.className = 'course-group-body';

  qs.forEach((q, i) => {
    body.appendChild(buildQAEl(q, i + 1));
  });

  header.onclick = () => {
    const isOpen = body.classList.toggle('open');
    header.querySelector('.course-group-chevron').classList.toggle('open', isOpen);
  };

  groupEl.appendChild(header);
  groupEl.appendChild(body);
  return groupEl;
}

function buildQAEl(q, num) {
  const correctAnswer = q.opts[q.ans];
  const qText         = searchQuery ? highlight(q.q, searchQuery) : escHtml(q.q);
  const aText         = searchQuery ? highlight(correctAnswer, searchQuery) : escHtml(correctAnswer);

  const el = document.createElement('div');
  el.className = 'course-qa';
  el.innerHTML = `
    <div class="course-qa-num">س ${num}</div>
    <div class="course-qa-question">${qText}</div>
    <div class="course-qa-answer">
      <span class="course-qa-answer-icon">✅</span>
      <span>${aText}</span>
    </div>
  `;
  return el;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function highlight(text, query) {
  const escaped = escHtml(text);
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return escaped.replace(re, '<mark>$1</mark>');
}
