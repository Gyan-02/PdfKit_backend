import { useState, useEffect } from "react";
import { getJobs } from "../../services/adminApi";
import JobsTable from "../../components/admin/JobsTable";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getJobs()
      .then(setJobs)
      .catch((err) => setError(err?.response?.data?.detail || "Failed to load jobs"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Jobs</h1>
          <p className="text-surface-500 text-sm">All processing jobs</p>
        </div>
        <span className="text-surface-500 text-sm">
          {jobs.length} total
        </span>
      </div>

      {loading && (
        <div className="flex items-center gap-3 justify-center py-16">
          <div className="spinner" />
          <span className="text-surface-400 text-sm">Loading jobs…</span>
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
          {error}
        </div>
      )}

      {!loading && !error && <JobsTable jobs={jobs} />}
    </div>
  );
}
