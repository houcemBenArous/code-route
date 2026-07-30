interface Props { timeLeft: number; }

export default function Timer({ timeLeft }: Props) {
  const warning = timeLeft <= 10;
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-extrabold border-4 transition-all duration-300
        ${warning
          ? 'border-rose-500 text-rose-500 bg-rose-50 animate-[pulseWarn_0.8s_ease_infinite_alternate]'
          : 'border-blue-600 text-blue-600 bg-blue-50'
        }`}>
        {timeLeft}
      </div>
      <span className="text-slate-400 text-sm font-medium">ثانية متبقية</span>
    </div>
  );
}
