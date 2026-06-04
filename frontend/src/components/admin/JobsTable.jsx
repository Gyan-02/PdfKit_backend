const STATUS_COLORS = {
  completed:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  processing: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  queued:     "bg-amber-500/15 text-amber-400 border-amber-500/25",
  failed:     "bg-red-500/15 text-red-400 border-red-500/25",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function JobsTable({ jobs }) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-12 text-surface-500">
        No jobs found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-white/[0.08] bg-white/[0.03]">
            <th className="px-4 py-3 text-surface-400 font-semibold text-xs uppercase tracking-wider">ID</th>
            <th className="px-4 py-3 text-surface-400 font-semibold text-xs uppercase tracking-wider">Tool</th>
            <th className="px-4 py-3 text-surface-400 font-semibold text-xs uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-surface-400 font-semibold text-xs uppercase tracking-wider">Created</th>
            <th className="px-4 py-3 text-surface-400 font-semibold text-xs uppercase tracking-wider">Completed</th>
            <th className="px-4 py-3 text-surface-400 font-semibold text-xs uppercase tracking-wider">Error</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => {
            const statusCls = STATUS_COLORS[job.status] || STATUS_COLORS.queued;
            return (
              <tr
                key={job.id}
                className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors"
              >
                <td className="px-4 py-3 text-surface-300 font-mono">#{job.id}</td>
                <td className="px-4 py-3 text-surface-200 font-medium">
                  {job.tool_name?.replace(/_/g, " ")}
                </td>
                <td className="px-4 py-3">
                  <span className={`status-badge border ${statusCls}`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-surface-400 text-xs">{formatDate(job.created_at)}</td>
                <td className="px-4 py-3 text-surface-400 text-xs">{formatDate(job.completed_at)}</td>
                <td className="px-4 py-3 text-red-400/80 text-xs max-w-[200px] truncate">
                  {job.error_message || "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
