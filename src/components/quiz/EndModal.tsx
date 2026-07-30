interface Props {
  answeredSoFar: number;
  correctCount:  number;
  remaining:     number;
  onConfirm:     () => void;
  onCancel:      () => void;
}

export default function EndModal({ answeredSoFar, correctCount, remaining, onConfirm, onCancel }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-5"
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl animate-[modalIn_0.28s_cubic-bezier(0.34,1.56,0.64,1)] border border-slate-100">
        <span className="text-5xl block mb-4">🏁</span>
        <h2 className="text-xl font-extrabold text-slate-800 mb-2 tracking-tight">إنهاء الاختبار؟</h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-5">
          الأسئلة غير المُجاب عنها ستُحتسب كإجابات{' '}
          <strong className="text-rose-500">خاطئة</strong> وستظهر نتيجتك الآن.
        </p>

        {/* Live stats */}
        <div className="flex border border-slate-100 rounded-2xl overflow-hidden mb-6 bg-slate-50">
          {[
            { value: answeredSoFar, label: 'أُجيب عنه',   color: 'text-slate-800' },
            { value: correctCount,  label: 'صحيح',         color: 'text-emerald-600' },
            { value: remaining,     label: 'متبقٍّ',        color: 'text-rose-500' },
          ].map((s, i) => (
            <div key={i} className={`flex-1 py-3 flex flex-col items-center gap-0.5 ${i > 0 ? 'border-r border-slate-200' : ''}`}>
              <span className={`text-2xl font-extrabold ${s.color}`}>{s.value}</span>
              <span className="text-xs text-slate-400 font-medium">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2.5">
          <button onClick={onConfirm} className="btn-danger">نعم، إنهاء الاختبار</button>
          <button onClick={onCancel}  className="btn-ghost">لا، متابعة الاختبار</button>
        </div>
      </div>
    </div>
  );
}
