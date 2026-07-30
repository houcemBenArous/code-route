import { usePWAInstall } from '../hooks/usePWAInstall';

type Tab = 'quiz' | 'course';

interface Props {
  activeTab: Tab;
  onTabChange: (t: Tab) => void;
}

export default function Nav({ activeTab, onTabChange }: Props) {
  const { canInstall, install } = usePWAInstall();

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-5 h-14 shadow-lg">
      {/* Brand */}
      <span className="text-white font-extrabold text-base tracking-tight flex items-center gap-2 select-none">
        🚗 <span>Code Route</span>
      </span>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/10 p-1 rounded-xl">
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

      {/* Install button — only shown when browser supports PWA install */}
      {canInstall ? (
        <button
          onClick={install}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 shadow-md shadow-emerald-900/40 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <span>⬇️</span>
          <span>تثبيت</span>
        </button>
      ) : (
        // Spacer to keep layout balanced when button is hidden
        <div className="w-20" />
      )}
    </nav>
  );
}
