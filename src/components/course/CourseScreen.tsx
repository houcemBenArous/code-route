import { useState, useMemo } from 'react';
import { allQuestions } from '../../data/questions';
import CategoryGroup from './CategoryGroup';

const CAT_ICONS: Record<string, string> = {
  'رخصة صنف ب': '🪪', 'الفحص الفني': '🔍', 'المخالفات': '⚖️',
  'السرعة': '🚦', 'المطر والأمان': '🌧️', 'مسافة التوقف والأمان': '📏',
  'الوقوف والتوقف': '🅿️', 'الأضواء': '💡', 'المجاوزة': '↔️',
  'إشارات الطريق': '🛣️', 'الإسعافات الأولية': '🚑',
  'الميكانيك': '🔧', 'الحمولة': '📦', 'تجديد الرخصة': '🔄',
};

export default function CourseScreen() {
  const [search,    setSearch]    = useState('');
  const [activeCat, setActiveCat] = useState('all');

  const cats = useMemo(() => [...new Set(allQuestions.map(q => q.cat))], []);

  const filtered = useMemo(() => {
    let pool = allQuestions;
    if (activeCat !== 'all') pool = pool.filter(q => q.cat === activeCat);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      pool = pool.filter(item => item.q.toLowerCase().includes(q) || item.opts[item.ans].toLowerCase().includes(q));
    }
    return pool;
  }, [activeCat, search]);

  // Group by category
  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach(q => {
      if (!map.has(q.cat)) map.set(q.cat, []);
      map.get(q.cat)!.push(q);
    });
    return [...map.entries()];
  }, [filtered]);

  return (
    <div className="animate-[fadeSlide_0.3s_ease]">
      <div className="text-center mb-7">
        <span className="text-4xl block mb-2">📖</span>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-1">الدروس والمراجعة</h1>
        <p className="text-slate-400 text-sm">جميع الأسئلة مع إجاباتها الصحيحة مرتبة حسب المحور</p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 ابحث في الدروس..."
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm bg-slate-50 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
          dir="rtl"
        />
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCat('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold border-2 transition-all whitespace-nowrap
            ${activeCat === 'all' ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-400 hover:text-blue-600'}`}
        >
          الكل
        </button>
        {cats.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border-2 transition-all whitespace-nowrap
              ${activeCat === cat ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-400 hover:text-blue-600'}`}
          >
            {CAT_ICONS[cat] ?? '📋'} {cat}
          </button>
        ))}
      </div>

      {/* Groups */}
      {groups.length === 0 ? (
        <p className="text-center text-slate-400 py-12">🔍 لا توجد نتائج مطابقة للبحث.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map(([cat, qs]) => (
            <CategoryGroup key={cat} cat={cat} icon={CAT_ICONS[cat] ?? '📋'} questions={qs} search={search} />
          ))}
        </div>
      )}
    </div>
  );
}
