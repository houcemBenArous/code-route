import { usePWAInstall } from '../hooks/usePWAInstall';

type Tab = 'quiz' | 'course';

interface Props {
  activeTab: Tab;
  onTabChange: (t: Tab) => void;
}

export default function Nav({ activeTab, onTabChange }: Props) {
  const { canInstall, install } = usePWAInstall();

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-white/10 shadow-lg">
      {/* Main row */}
      <div className="flex items-center justify-between px-4 h-16 sm:h-14 gap-3">

        {/* Brand */}
        <span className="text-white font-extrabold text-base sm:text-base tracking-tight flex items-center gap-1.5 select-none shrink-0">
          🚗 <span className="hidden xs:inline sm:inline">Code Route</span>
        </span>

        {/* Tabs — full width on mobile, auto on desktop */}
        <div className="flex flex-1 sm:flex-none gap-1.5 bg-white/10 p-1.5 rounded-xl">
          {(['quiz', 'course'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-2 rounded-lg text-sm sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab === 'quiz' ? '📝 الاختبار' : '📖 الدروس'}
            </button>
          ))}
        </div>

        {/* Install button */}
        {canInstall ? (
          <button
            onClick={install}
            className="shrink-0 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs sm:text-xs font-bold px-3.5 py-2.5 sm:py-2 rounded-xl transition-all duration-200 shadow-md shadow-emerald-900/40"
          >
            <span>⬇️</span>
            <span className="hidden sm:inline">تثبيت</span>
          </button>
        ) : (
          <div className="w-8 sm:w-0 shrink-0" />
        )}

      </div>
    </nav>
  );
}
