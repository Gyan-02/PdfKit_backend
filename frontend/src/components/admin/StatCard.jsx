export default function StatCard({ title, value, icon, color = "brand" }) {
  const colorMap = {
    brand:   "from-brand-500/20 to-brand-600/10 text-brand-400 border-brand-500/20",
    green:   "from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/20",
    red:     "from-red-500/20 to-red-600/10 text-red-400 border-red-500/20",
    amber:   "from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/20",
    blue:    "from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/20",
    purple:  "from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/20",
    cyan:    "from-cyan-500/20 to-cyan-600/10 text-cyan-400 border-cyan-500/20",
  };

  const cls = colorMap[color] || colorMap.brand;

  return (
    <div className={`glass-card p-5 bg-gradient-to-br ${cls} border animate-fade-in`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-surface-400 text-xs font-semibold uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-white">{value ?? "—"}</p>
    </div>
  );
}
