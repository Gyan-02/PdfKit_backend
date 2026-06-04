function formatBytes(bytes) {
  if (bytes == null || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function FilesTable({ files }) {
  if (!files || files.length === 0) {
    return (
      <div className="text-center py-12 text-surface-500">
        No files found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-white/[0.08] bg-white/[0.03]">
            <th className="px-4 py-3 text-surface-400 font-semibold text-xs uppercase tracking-wider">ID</th>
            <th className="px-4 py-3 text-surface-400 font-semibold text-xs uppercase tracking-wider">Filename</th>
            <th className="px-4 py-3 text-surface-400 font-semibold text-xs uppercase tracking-wider">Size</th>
            <th className="px-4 py-3 text-surface-400 font-semibold text-xs uppercase tracking-wider">Type</th>
            <th className="px-4 py-3 text-surface-400 font-semibold text-xs uppercase tracking-wider">Uploaded</th>
          </tr>
        </thead>
        <tbody>
          {files.map((f) => (
            <tr
              key={f.id}
              className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors"
            >
              <td className="px-4 py-3 text-surface-300 font-mono">#{f.id}</td>
              <td className="px-4 py-3 text-surface-200 font-medium max-w-[250px] truncate">
                {f.original_filename}
              </td>
              <td className="px-4 py-3 text-surface-300">{formatBytes(f.size_bytes)}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-surface-400 text-xs">
                  {f.mime_type || "—"}
                </span>
              </td>
              <td className="px-4 py-3 text-surface-400 text-xs">{formatDate(f.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
