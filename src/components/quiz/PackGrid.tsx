import { PACKS } from '../../data/packs';
import { allQuestions } from '../../data/questions';
import type { Pack } from '../../data/packs';

interface Props { onSelect: (pack: Pack) => void; }

export default function PackGrid({ onSelect }: Props) {
  return (
    <div className="animate-[fadeSlide_0.3s_ease]">
      <div className="text-center mb-8">
        <span className="text-5xl mb-3 block drop-shadow-lg">📝</span>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-1">اختبار رخصة السياقة</h1>
        <p className="text-slate-400 text-sm">صنف "ب" — تونس | اختر حزمة للبدء</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PACKS.map(pack => {
          const pool  = allQuestions.filter(pack.filter);
          const count = pack.limit ? Math.min(pack.limit, pool.length) : pool.length;
          return (
            <button
              key={pack.id}
              onClick={() => onSelect(pack)}
              className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 text-center cursor-pointer
                transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group
                ${pack.featured
                  ? 'border-rose-200 bg-rose-50 hover:border-rose-400 hover:shadow-rose-200/50'
                  : 'border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50 hover:shadow-blue-200/50'
                }`}
            >
              <span className="text-3xl">{pack.icon}</span>
              <span className="text-sm font-bold text-slate-800 leading-snug">{pack.name}</span>
              <span className="text-xs text-slate-400 leading-relaxed">{pack.desc}</span>
              <span className={`text-xs font-bold px-3 py-0.5 rounded-full text-white mt-1
                ${pack.featured ? 'bg-rose-500' : 'bg-blue-600'}`}>
                {count} سؤال
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
