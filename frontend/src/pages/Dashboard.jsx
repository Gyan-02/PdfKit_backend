import { useState } from "react";
import { Link } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import ToolSelector from "../components/ToolSelector";
import DynamicForm from "../components/DynamicForm";
import JobStatus from "../components/JobStatus";
import { processTool } from "../services/api";

const MULTI_FILE_TOOLS = new Set(["merge_pdf", "jpg_to_pdf"]);

export default function Dashboard() {
  const [files, setFiles] = useState([]);       // [{ file_id, filename }]
  const [tool, setTool] = useState(null);        // "merge_pdf" | "rotate_pdf" | …
  const [formData, setFormData] = useState({});   // dynamic payload
  const [jobId, setJobId] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  /* Reset form when tool changes */
  const handleToolChange = (key) => {
    setTool(key);
    setFormData({});
    setJobId(null);
    setError(null);
  };

  /* Build the payload for the selected tool */
  const buildPayload = () => {
    if (MULTI_FILE_TOOLS.has(tool)) {
      const ids = formData.file_ids || [];
      if (ids.length === 0) throw new Error("Select at least one file");
      if (tool === "merge_pdf" && ids.length < 2) throw new Error("Merge requires at least 2 files");
      return { file_ids: ids, ...filterExtra() };
    }

    const fileId = formData.file_id;
    if (!fileId) throw new Error("Select a file");
    return { file_id: fileId, ...filterExtra() };
  };

  /* Extract only the extra fields (not file_id / file_ids) */
  const filterExtra = () => {
    const { file_id, file_ids, ...rest } = formData;
    return rest;
  };

  const handleProcess = async () => {
    setError(null);
    try {
      const payload = buildPayload();
      setProcessing(true);
      const data = await processTool(tool, payload);
      setJobId(data.job_id);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Processing failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-animated-gradient text-white">
      {/* ── Background decoration ──────────────────────────────── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-brand-600/[0.04] rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-600/[0.04] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* ── Admin link ─────────────────────────────────────── */}
        <div className="flex justify-end mb-4">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.10] text-surface-400 text-sm font-medium hover:bg-white/[0.10] hover:text-surface-200 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            Admin Panel
          </Link>
        </div>

        {/* ── Header ──────────────────────────────────────────── */}
        <header className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white to-surface-300 bg-clip-text text-transparent">
                PDF Toolkit
              </span>
            </h1>
          </div>
          <p className="text-surface-400 text-sm sm:text-base max-w-lg mx-auto">
            Upload, transform, and enhance your PDF documents with powerful tools and AI.
          </p>
        </header>

        {/* ── Section 1: Upload ──────────────────────────────── */}
        <section className="glass-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-brand-500/15 text-brand-400 text-xs font-bold">1</span>
            <h2 className="text-surface-200 font-semibold">Upload Files</h2>
          </div>
          <FileUpload onFilesUploaded={setFiles} />
        </section>

        {/* ── Section 2: Tool selector ──────────────────────── */}
        <section className="glass-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-brand-500/15 text-brand-400 text-xs font-bold">2</span>
            <h2 className="text-surface-200 font-semibold">Choose Tool</h2>
          </div>
          <ToolSelector selected={tool} onSelect={handleToolChange} />
        </section>

        {/* ── Section 3: Dynamic form + process ─────────────── */}
        <section className="glass-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-brand-500/15 text-brand-400 text-xs font-bold">3</span>
            <h2 className="text-surface-200 font-semibold">Configure & Process</h2>
          </div>

          <DynamicForm
            tool={tool}
            files={files}
            formData={formData}
            setFormData={setFormData}
          />

          {/* Error banner */}
          {error && (
            <div className="mt-4 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-slide-up">
              {error}
            </div>
          )}

          {/* Process button */}
          {tool && (
            <button
              id="process-button"
              onClick={handleProcess}
              disabled={processing || !tool}
              className="btn-primary mt-6 w-full flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="spinner" />
                  Processing…
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                  </svg>
                  Process
                </>
              )}
            </button>
          )}
        </section>

        {/* ── Section 4: Job status ─────────────────────────── */}
        {jobId && (
          <section className="mb-8">
            <JobStatus jobId={jobId} />
          </section>
        )}

        {/* ── Footer ──────────────────────────────────────────── */}
        <footer className="text-center text-surface-600 text-xs pt-4 pb-8">
          PDF Toolkit &middot; Built with React + Vite
        </footer>
      </div>
    </div>
  );
}
