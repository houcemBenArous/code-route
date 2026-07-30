type Tab = 'quiz' | 'course';

interface Props {
  activeTab: Tab;
  onTabChange: (t: Tab) => void;
}

export default function Nav({ activeTab, onTabChange }: Props) {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-white/8 flex items-center justify-between px-5 h-14 shadow-lg">
      <span className="text-white font-extrabold text-base tracking-tight flex items-center gap-2">
        🚗 <span>Code Route</span>
      </span>
      <div className="flex gap-1 bg-white/8 p-1 rounded-xl">
        {(['quiz', 'course'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab === 'quiz' ? '📝 الاختبار' : '📖 الدروس'}
          </button>
        ))}
      </div>
    </nav>
  );
}
