import { useState } from 'react';
import type { Question } from '../../data/questions';

interface Props { cat: string; icon: string; questions: Question[]; search: string; }

function highlight(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

export default function CategoryGroup({ cat, icon, questions, search }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-slate-700 to-blue-800 hover:brightness-110 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2.5 text-white font-bold text-sm">
          <span>{icon}</span>
          <span>{cat}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold bg-white/20 text-white rounded-full px-2.5 py-0.5">{questions.length} سؤال</span>
          <span className={`text-white/70 text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
        </div>
      </button>

      {/* Body */}
      {open && (
        <div className="divide-y divide-slate-100">
          {questions.map((q, i) => (
            <div key={i} className="px-5 py-3.5 bg-white hover:bg-slate-50 transition-colors flex flex-col gap-2">
              <span className="text-xs text-slate-300 font-bold uppercase tracking-widest">س {i + 1}</span>
              {/* Image if present */}
              {q.image && (
                <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={q.image} alt="صورة السؤال" className="w-full max-h-48 object-contain p-1.5" />
                </div>
              )}
              <p
                className="text-sm font-semibold text-slate-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: highlight(q.q, search) }}
              />
              <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-emerald-800 text-sm font-semibold">
                <span className="mt-0.5 flex-shrink-0">✅</span>
                <span dangerouslySetInnerHTML={{ __html: highlight(q.opts[q.ans], search) }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
