import { useState } from 'react';
import type { HistoryEntry } from '../../hooks/useQuiz';

interface Props { history: HistoryEntry[]; }

export default function ReviewSection({ history }: Props) {
  const [open, setOpen] = useState(false);
  const mistakes = history.filter(h => !h.correct);
  if (mistakes.length === 0) return null;

  return (
    <div className="mt-6 border border-slate-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-600 font-bold text-sm transition-all duration-200"
      >
        <span>📋 مراجعة الأخطاء ({mistakes.length} خطأ)</span>
        <span className={`text-xs transition-transform duration-250 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && (
        <div className="divide-y divide-slate-100">
          {mistakes.map((h, i) => {
            const correctText = h.question.opts[h.question.ans];
            return (
              <div key={i} className="px-5 py-4 bg-white hover:bg-slate-50 transition-colors">
                <div className="text-xs text-slate-300 font-bold uppercase tracking-widest mb-1">
                  خطأ {i + 1} / {mistakes.length}
                </div>
                <span className="badge mb-2 inline-block">{h.question.cat}</span>
                <p className="text-sm font-semibold text-slate-800 leading-relaxed mb-3">{h.question.q}</p>
                <div className="flex flex-col gap-1.5">
                  {/* What they chose */}
                  {h.skipped ? (
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 text-sm">
                      <span>⏭️</span>
                      <div><span className="block text-xs font-bold uppercase opacity-60 mb-0.5">لم يُجَب عنه</span>السؤال تم تخطيه</div>
                    </div>
                  ) : h.timeout ? (
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                      <span>⏰</span>
                      <div><span className="block text-xs font-bold uppercase opacity-60 mb-0.5">انتهى الوقت</span>لم يتم الإجابة في الوقت المحدد</div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm">
                      <span>❌</span>
                      <div><span className="block text-xs font-bold uppercase opacity-60 mb-0.5">إجابتك</span>{h.chosenText}</div>
                    </div>
                  )}
                  {/* Correct answer */}
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
                    <span>✅</span>
                    <div><span className="block text-xs font-bold uppercase opacity-60 mb-0.5">الإجابة الصحيحة</span>{correctText}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
