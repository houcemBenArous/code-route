interface Props { onClose: () => void; }

export default function InstallModal({ onClose }: Props) {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isAndroid = /android/i.test(navigator.userAgent);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-5"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-[modalIn_0.28s_cubic-bezier(0.34,1.56,0.64,1)] border border-slate-100 text-right">
        <span className="text-4xl block mb-3">📲</span>
        <h2 className="text-lg font-extrabold text-slate-800 mb-2">تثبيت التطبيق</h2>
        <p className="text-sm text-slate-500 mb-5 leading-relaxed">
          يمكنك تثبيت <strong>Code Route</strong> على هاتفك لاستخدامه بدون إنترنت.
        </p>

        {isIOS && (
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-xl">1️⃣</span>
              <p className="text-sm text-slate-700">اضغط على زر <strong>مشاركة</strong> في أسفل المتصفح <strong>⬆️</strong></p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-xl">2️⃣</span>
              <p className="text-sm text-slate-700">اختر <strong>"إضافة إلى الشاشة الرئيسية"</strong></p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-xl">3️⃣</span>
              <p className="text-sm text-slate-700">اضغط <strong>"إضافة"</strong> للتأكيد</p>
            </div>
          </div>
        )}

        {isAndroid && (
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-xl">1️⃣</span>
              <p className="text-sm text-slate-700">اضغط على <strong>⋮</strong> (القائمة) في متصفح Chrome</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-xl">2️⃣</span>
              <p className="text-sm text-slate-700">اختر <strong>"إضافة إلى الشاشة الرئيسية"</strong></p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-xl">3️⃣</span>
              <p className="text-sm text-slate-700">اضغط <strong>"تثبيت"</strong> للتأكيد</p>
            </div>
          </div>
        )}

        {!isIOS && !isAndroid && (
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-xl">💻</span>
              <p className="text-sm text-slate-700">في Chrome، اضغط على أيقونة <strong>⊕</strong> في شريط العنوان لتثبيت التطبيق</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <span className="text-xl">📱</span>
              <p className="text-sm text-slate-700">للحصول على أفضل تجربة، افتح الموقع من <strong>هاتفك</strong></p>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors"
        >
          حسناً، فهمت ✓
        </button>
      </div>
    </div>
  );
}
