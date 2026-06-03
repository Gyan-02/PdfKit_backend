import { useMemo } from "react";

/**
 * Given the selected tool and list of uploaded files,
 * render the appropriate extra input fields.
 *
 * `formData` and `setFormData` are lifted state from Dashboard.
 */

/* ── Which tools use multiple file_ids ────────────────────────── */
const MULTI_FILE_TOOLS = new Set(["merge_pdf", "jpg_to_pdf"]);

/* ── Extra fields per tool ────────────────────────────────────── */
const EXTRA_FIELDS = {
  rotate_pdf:    [{ name: "rotation",        label: "Rotation (°)",   type: "select", options: [90, 180, 270] }],
  protect_pdf:   [{ name: "password",        label: "Password",       type: "password" }],
  unlock_pdf:    [{ name: "password",        label: "Password",       type: "password" }],
  watermark_pdf: [{ name: "text",            label: "Watermark Text", type: "text" }],
  ai_translate:  [{ name: "target_language", label: "Target Language", type: "select", options: ["Spanish", "French", "German", "Hindi", "Chinese", "Japanese", "Arabic", "Portuguese", "Russian", "Korean"] }],
  ai_rewrite:    [{ name: "tone",            label: "Tone",           type: "select", options: ["Professional", "Casual", "Academic", "Friendly", "Concise", "Creative"] }],
  qr_pdf:        [{ name: "text",            label: "QR Text / URL",  type: "text" }],
};

export default function DynamicForm({ tool, files, formData, setFormData }) {
  const isMulti = MULTI_FILE_TOOLS.has(tool);
  const extras = EXTRA_FIELDS[tool] || [];

  /* Build the file_id / file_ids selector */
  const fileOptions = useMemo(
    () => files.map((f) => ({ value: f.file_id, label: `${f.filename} (#${f.file_id})` })),
    [files]
  );

  if (!tool) {
    return (
      <div className="flex items-center justify-center py-8 text-surface-500 text-sm animate-fade-in">
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
        </svg>
        Select a tool above to configure options
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-slide-up">
      {/* ── File selector ──────────────────────────────────────── */}
      {isMulti ? (
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-2">
            Select Files <span className="text-surface-500 text-xs">(multiple)</span>
          </label>
          {fileOptions.length === 0 ? (
            <p className="text-surface-500 text-sm italic">Upload files first</p>
          ) : (
            <div className="space-y-2">
              {fileOptions.map((opt) => {
                const checked = (formData.file_ids || []).includes(opt.value);
                return (
                  <label
                    key={opt.value}
                    className={`
                      flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer transition-all duration-200
                      ${checked
                        ? "bg-brand-500/10 border-brand-500/30"
                        : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"}
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const ids = formData.file_ids || [];
                        const newIds = checked
                          ? ids.filter((id) => id !== opt.value)
                          : [...ids, opt.value];
                        setFormData((prev) => ({ ...prev, file_ids: newIds }));
                      }}
                      className="accent-brand-500 w-4 h-4"
                    />
                    <span className="text-surface-300 text-sm">{opt.label}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-2">Select File</label>
          {fileOptions.length === 0 ? (
            <p className="text-surface-500 text-sm italic">Upload a file first</p>
          ) : (
            <div className="relative">
              <select
                id="file-select"
                value={formData.file_id || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, file_id: Number(e.target.value) }))
                }
                className="select-field pr-10"
              >
                <option value="" disabled>
                  Choose a file…
                </option>
                {fileOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-surface-900">
                    {opt.label}
                  </option>
                ))}
              </select>
              <svg className="w-4 h-4 text-surface-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* ── Extra fields ───────────────────────────────────────── */}
      {extras.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-surface-300 mb-2">{field.label}</label>
          {field.type === "select" ? (
            <div className="relative">
              <select
                id={`field-${field.name}`}
                value={formData[field.name] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, [field.name]: field.name === "rotation" ? Number(e.target.value) : e.target.value }))
                }
                className="select-field pr-10"
              >
                <option value="" disabled>
                  Choose…
                </option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt} className="bg-surface-900">
                    {opt}
                    {field.name === "rotation" ? "°" : ""}
                  </option>
                ))}
              </select>
              <svg className="w-4 h-4 text-surface-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          ) : (
            <input
              id={`field-${field.name}`}
              type={field.type}
              placeholder={field.label}
              value={formData[field.name] || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
              }
              className="input-field"
            />
          )}
        </div>
      ))}
    </div>
  );
}
