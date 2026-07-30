import type { useQuiz } from '../../hooks/useQuiz';
import ReviewSection from './ReviewSection';

type QuizState = ReturnType<typeof useQuiz>;
interface Props { quiz: QuizState; }

export default function ResultScreen({ quiz }: Props) {
  const { correctCount, wrongCount, total, pct, passed, history, currentPack, restartPack, goBackToPacks } = quiz;

  return (
    <div className="text-center animate-[fadeSlide_0.3s_ease]">
      <span className="text-7xl block mb-4 drop-shadow-lg">{passed ? '🏆' : '😞'}</span>
      <h2 className={`text-3xl font-extrabold mb-2 tracking-tight ${passed ? 'text-emerald-600' : 'text-rose-600'}`}>
        {passed ? 'مبروك! لقد نجحت!' : 'للأسف لم تنجح'}
      </h2>
      <p className="text-slate-500 text-sm mb-6">
        نسبتك: <strong className="text-slate-700">{pct}%</strong>
        {' — '}{passed ? 'تجاوزت عتبة 80%' : 'لم تبلغ عتبة 80% المطلوبة'}
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-5 text-right">
        <p className="text-sm text-slate-500 font-medium">📦 الحزمة: <strong className="text-slate-700">{currentPack?.icon} {currentPack?.name}</strong></p>
        <p className="text-sm text-slate-500 font-medium">📋 مجموع الأسئلة: <strong className="text-slate-700">{total}</strong></p>
        <p className="text-sm text-slate-500 font-medium">✅ إجابات صحيحة: <strong className="text-emerald-600">{correctCount}</strong></p>
        <p className="text-sm text-slate-500 font-medium">❌ إجابات خاطئة: <strong className="text-rose-600">{wrongCount}</strong></p>
        <p className="col-span-2 text-sm text-slate-500 font-medium">🎯 النسبة المئوية: <strong className="text-slate-700">{pct}%</strong></p>
        {!passed && (
          <p className="col-span-2 text-sm text-rose-500 font-semibold">⚠️ يجب إعادة الاختبار لتحسين نتيجتك.</p>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        <button onClick={restartPack} className="btn-primary">إعادة هذه الحزمة 🔄</button>
        <button onClick={goBackToPacks} className="btn-ghost">← العودة للحزم</button>
      </div>

      <ReviewSection history={history} />
    </div>
  );
}
