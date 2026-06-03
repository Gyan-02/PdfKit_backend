import { useEffect, useRef, useState } from "react";
import { getJobStatus, getDownloadUrl } from "../services/api";

const STATUS_CONFIG = {
  queued: {
    color: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    dotColor: "bg-amber-400",
    label: "Queued",
    pulse: true,
  },
  processing: {
    color: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    dotColor: "bg-blue-400",
    label: "Processing",
    pulse: true,
  },
  completed: {
    color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    dotColor: "bg-emerald-400",
    label: "Completed",
    pulse: false,
  },
  failed: {
    color: "bg-red-500/15 text-red-400 border-red-500/25",
    dotColor: "bg-red-400",
    label: "Failed",
    pulse: false,
  },
};

export default function JobStatus({ jobId }) {
  const [status, setStatus] = useState("queued");
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!jobId) return;

    setStatus("queued");
    setError(null);

    const poll = async () => {
      try {
        const data = await getJobStatus(jobId);
        setStatus(data.status);

        if (data.status === "completed" || data.status === "failed") {
          clearInterval(intervalRef.current);
        }
      } catch (err) {
        setError("Failed to fetch job status");
        clearInterval(intervalRef.current);
      }
    };

    poll(); // immediate first check
    intervalRef.current = setInterval(poll, 2000);

    return () => clearInterval(intervalRef.current);
  }, [jobId]);

  if (!jobId) return null;

  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.queued;

  return (
    <div className="glass-card-elevated p-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
          <h3 className="text-surface-200 font-semibold text-sm">
            Job #{jobId}
          </h3>
        </div>

        {/* Status badge */}
        <span className={`status-badge border ${cfg.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor} ${cfg.pulse ? "animate-pulse" : ""}`} />
          {cfg.label}
        </span>
      </div>

      {/* Progress bar (visual) */}
      <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-5">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            status === "completed"
              ? "w-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              : status === "failed"
              ? "w-full bg-gradient-to-r from-red-600 to-red-500"
              : status === "processing"
              ? "w-2/3 bg-gradient-to-r from-brand-600 to-brand-400 animate-pulse"
              : "w-1/4 bg-gradient-to-r from-amber-600 to-amber-400 animate-pulse"
          }`}
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
          {error}
        </div>
      )}

      {/* Download button */}
      {status === "completed" && (
        <a
          id="download-button"
          href={getDownloadUrl(jobId)}
          download
          className="btn-primary inline-flex items-center gap-2 w-full justify-center"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download Result
        </a>
      )}

      {/* Failed message */}
      {status === "failed" && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <span>Job failed. Please check your input and try again.</span>
        </div>
      )}
    </div>
  );
}
