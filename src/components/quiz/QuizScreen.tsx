import { useMemo, useState } from 'react';
import type { useQuiz } from '../../hooks/useQuiz';
import Timer from './Timer';

type QuizState = ReturnType<typeof useQuiz>;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props { quiz: QuizState; }

export default function QuizScreen({ quiz }: Props) {
  const {
    currentQuestion: q, index, total, correctCount, wrongCount,
    answered, timeLeft, currentPack,
    selectAnswer, nextQuestion, goBackToPacks, openEndModal,
  } = quiz;

  const [selectedText, setSelectedText] = useState<string | null>(null);

  // Shuffle options once per question
  const shuffledOpts = useMemo(() => {
    if (!q) return [];
    return shuffle([0, 1, 2] as (0|1|2)[]);
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!q) return null;

  const correctText = q.opts[q.ans];
  const pct = Math.round(((index) / total) * 100);

  function handleSelect(optIdx: 0|1|2) {
    if (answered) return;
    const text = q!.opts[optIdx];
    setSelectedText(text);
    selectAnswer(text, optIdx === q!.ans);
  }

  function handleNext() {
    setSelectedText(null);
    nextQuestion();
  }

  function getOptionStyle(optIdx: 0|1|2): string {
    const text = q!.opts[optIdx];
    const base = 'w-full text-right px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 relative overflow-hidden ';
    if (!answered) {
      return base + 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 hover:-translate-x-0.5 cursor-pointer shadow-sm';
    }
    if (text === correctText)  return base + 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-md shadow-emerald-100 cursor-default';
    if (text === selectedText) return base + 'border-rose-400 bg-rose-50 text-rose-800 cursor-default';
    return base + 'border-slate-100 bg-slate-50 text-slate-400 cursor-default opacity-60';
  }

  let feedback = null;
  if (answered && selectedText !== null) {
    const isCorrect = selectedText === correctText;
    feedback = (
      <div className={`mt-4 p-3 rounded-xl text-sm font-semibold animate-[fadeSlide_0.2s_ease] border
        ${isCorrect
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
        {isCorrect ? '✅ إجابة صحيحة!' : '❌ إجابة خاطئة! الإجابة الصحيحة مُعلَّمة باللون الأخضر.'}
      </div>
    );
  } else if (answered && timeLeft === 0) {
    feedback = (
      <div className="mt-4 p-3 rounded-xl text-sm font-semibold animate-[fadeSlide_0.2s_ease] border bg-amber-50 text-amber-800 border-amber-200">
        ⏰ انتهى الوقت! الإجابة الصحيحة مُعلَّمة باللون الأخضر.
      </div>
    );
  }

  return (
    <div className="animate-[fadeSlide_0.2s_ease]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={goBackToPacks} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all">
          ← الحزم
        </button>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
          {currentPack?.icon} {currentPack?.name}
        </span>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-slate-100 rounded-full mb-3 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-600 to-rose-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      {/* Stats */}
      <div className="flex justify-between text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 mb-6">
        <span>السؤال {index + 1} / {total}</span>
        <span>✅ {correctCount} صحيح &nbsp;❌ {wrongCount} خطأ</span>
      </div>

      <Timer timeLeft={timeLeft} />

      {/* Category badge */}
      <div className="mb-3">
        <span className="badge">{q.cat}</span>
      </div>

      {/* Question */}
      <div className="bg-slate-50 border-r-4 border-blue-600 rounded-xl p-4 mb-5 text-slate-800 font-bold text-base leading-loose shadow-sm">
        {q.q}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {shuffledOpts.map(optIdx => (
          <button key={optIdx} disabled={answered} onClick={() => handleSelect(optIdx)} className={getOptionStyle(optIdx)}>
            {q.opts[optIdx]}
          </button>
        ))}
      </div>

      {feedback}

      {answered && (
        <button onClick={handleNext} className="btn-primary mt-4">
          {index + 1 >= total ? '🏁 عرض النتيجة' : 'السؤال التالي ◀'}
        </button>
      )}

      <button onClick={openEndModal} className="btn-ghost mt-2.5">
        🏁 إنهاء الاختبار
      </button>
    </div>
  );
}
