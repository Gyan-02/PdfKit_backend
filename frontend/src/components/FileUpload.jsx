import { useState, useCallback } from "react";
import { uploadFile } from "../services/api";

const ACCEPTED_TYPES = ".pdf,.jpg,.jpeg,.png";

export default function FileUpload({ onFilesUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = useCallback(
    async (fileList) => {
      if (!fileList || fileList.length === 0) return;

      setUploading(true);
      setError(null);

      try {
        const results = [];
        for (const file of Array.from(fileList)) {
          const data = await uploadFile(file);
          results.push(data);
        }

        setUploadedFiles((prev) => [...prev, ...results]);
        onFilesUploaded((prev) => [...prev, ...results]);
      } catch (err) {
        setError(err?.response?.data?.detail || "Upload failed. Check backend.");
      } finally {
        setUploading(false);
      }
    },
    [onFilesUploaded]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      handleUpload(e.dataTransfer.files);
    },
    [handleUpload]
  );

  const removeFile = (indexToRemove) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    onFilesUploaded((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="animate-fade-in">
      {/* Upload zone */}
      <div
        id="upload-dropzone"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center gap-3
          p-8 rounded-2xl border-2 border-dashed cursor-pointer
          transition-all duration-300
          ${
            dragOver
              ? "upload-zone-active"
              : "border-white/[0.10] hover:border-white/[0.20] bg-white/[0.02] hover:bg-white/[0.04]"
          }
        `}
      >
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-brand-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
            />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-surface-300 font-medium text-sm">
            Drag & drop files here, or{" "}
            <label
              htmlFor="file-input"
              className="text-brand-400 hover:text-brand-300 cursor-pointer underline underline-offset-2"
            >
              browse
            </label>
          </p>
          <p className="text-surface-500 text-xs mt-1">PDF, JPG, PNG accepted</p>
        </div>

        <input
          id="file-input"
          type="file"
          accept={ACCEPTED_TYPES}
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-surface-950/60 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="spinner" />
              <span className="text-surface-300 text-sm font-medium">Uploading…</span>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-slide-up">
          {error}
        </div>
      )}

      {/* File chips */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 animate-slide-up">
          {uploadedFiles.map((f, idx) => (
            <div
              key={`${f.file_id}-${idx}`}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg
                         bg-brand-500/10 border border-brand-500/20 text-sm"
            >
              <svg className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <span className="text-surface-300 truncate max-w-[140px]">{f.filename}</span>
              <span className="text-surface-500 text-xs">#{f.file_id}</span>
              <button
                onClick={() => removeFile(idx)}
                className="ml-1 text-surface-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
