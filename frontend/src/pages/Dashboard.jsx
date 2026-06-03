import { useState } from "react";
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
