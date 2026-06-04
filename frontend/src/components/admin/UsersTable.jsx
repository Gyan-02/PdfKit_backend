function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const PLAN_COLORS = {
  free: "bg-surface-500/20 text-surface-400",
  pro:  "bg-brand-500/20 text-brand-400",
  enterprise: "bg-purple-500/20 text-purple-400",
};

export default function UsersTable({ users }) {
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12 text-surface-500">
        No users found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-white/[0.08] bg-white/[0.03]">
            <th className="px-4 py-3 text-surface-400 font-semibold text-xs uppercase tracking-wider">ID</th>
            <th className="px-4 py-3 text-surface-400 font-semibold text-xs uppercase tracking-wider">Email</th>
            <th className="px-4 py-3 text-surface-400 font-semibold text-xs uppercase tracking-wider">Plan</th>
            <th className="px-4 py-3 text-surface-400 font-semibold text-xs uppercase tracking-wider">Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const planCls = PLAN_COLORS[u.plan_type] || PLAN_COLORS.free;
            return (
              <tr
                key={u.id}
                className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors"
              >
                <td className="px-4 py-3 text-surface-300 font-mono">#{u.id}</td>
                <td className="px-4 py-3 text-surface-200 font-medium">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${planCls}`}>
                    {u.plan_type || "free"}
                  </span>
                </td>
                <td className="px-4 py-3 text-surface-400 text-xs">{formatDate(u.created_at)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
