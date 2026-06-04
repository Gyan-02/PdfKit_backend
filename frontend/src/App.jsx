import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminFiles from "./pages/admin/AdminFiles";
import AdminUsers from "./pages/admin/AdminUsers";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main toolkit */}
        <Route path="/" element={<Dashboard />} />

        {/* Admin panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="files" element={<AdminFiles />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
