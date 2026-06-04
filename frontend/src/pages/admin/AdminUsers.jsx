import { useState, useEffect } from "react";
import { getUsers } from "../../services/adminApi";
import UsersTable from "../../components/admin/UsersTable";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getUsers()
      .then(setUsers)
      .catch((err) => setError(err?.response?.data?.detail || "Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Users</h1>
          <p className="text-surface-500 text-sm">All registered users</p>
        </div>
        <span className="text-surface-500 text-sm">
          {users.length} total
        </span>
      </div>

      {loading && (
        <div className="flex items-center gap-3 justify-center py-16">
          <div className="spinner" />
          <span className="text-surface-400 text-sm">Loading users…</span>
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
          {error}
        </div>
      )}

      {!loading && !error && <UsersTable users={users} />}
    </div>
  );
}
