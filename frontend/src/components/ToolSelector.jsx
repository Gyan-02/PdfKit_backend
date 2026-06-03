const TOOLS = [
  { key: "merge_pdf",     label: "Merge PDF",     icon: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5",       category: "Edit" },
  { key: "split_pdf",     label: "Split PDF",     icon: "M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5", category: "Edit" },
  { key: "rotate_pdf",    label: "Rotate PDF",    icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182",   category: "Edit" },
  { key: "watermark_pdf", label: "Watermark PDF", icon: "M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418",   category: "Edit" },
  { key: "page_numbers",  label: "Page Numbers",  icon: "M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5", category: "Edit" },
  { key: "protect_pdf",   label: "Protect PDF",   icon: "M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z", category: "Security" },
  { key: "unlock_pdf",    label: "Unlock PDF",    icon: "M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z", category: "Security" },
  { key: "jpg_to_pdf",    label: "JPG → PDF",     icon: "M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z", category: "Convert" },
  { key: "pdf_to_jpg",    label: "PDF → JPG",     icon: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z", category: "Convert" },
  { key: "compress_pdf",  label: "Compress PDF",  icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125", category: "Optimize" },
  { key: "ai_summarise",  label: "AI Summarise",  icon: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z", category: "AI" },
  { key: "ai_translate",  label: "AI Translate",  icon: "m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802", category: "AI" },
  { key: "ai_rewrite",    label: "AI Rewrite",    icon: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125",  category: "AI" },
  { key: "qr_pdf",        label: "QR PDF",        icon: "M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z", category: "Other" },
];

const CATEGORY_COLORS = {
  Edit:     "from-blue-500/20 to-cyan-500/20 text-cyan-400",
  Security: "from-amber-500/20 to-orange-500/20 text-amber-400",
  Convert:  "from-emerald-500/20 to-teal-500/20 text-emerald-400",
  Optimize: "from-purple-500/20 to-violet-500/20 text-purple-400",
  AI:       "from-pink-500/20 to-rose-500/20 text-pink-400",
  Other:    "from-slate-500/20 to-gray-500/20 text-slate-400",
};

export default function ToolSelector({ selected, onSelect }) {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
        {TOOLS.map((tool) => {
          const isActive = selected === tool.key;
          const catColor = CATEGORY_COLORS[tool.category] || CATEGORY_COLORS.Other;
          return (
            <button
              key={tool.key}
              id={`tool-${tool.key}`}
              onClick={() => onSelect(tool.key)}
              className={`
                group relative flex flex-col items-center gap-2 p-4 rounded-xl
                border transition-all duration-200 text-center
                ${
                  isActive
                    ? "bg-brand-500/15 border-brand-500/40 shadow-lg shadow-brand-500/10"
                    : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12]"
                }
              `}
            >
              {/* Category tag */}
              <span
                className={`absolute top-1.5 right-1.5 text-[9px] font-bold uppercase tracking-widest
                            px-1.5 py-0.5 rounded bg-gradient-to-r ${catColor}`}
              >
                {tool.category}
              </span>

              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors
                  ${isActive ? "bg-brand-500/20" : "bg-white/[0.04] group-hover:bg-white/[0.08]"}
                `}
              >
                <svg
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-brand-400" : "text-surface-400 group-hover:text-surface-300"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={tool.icon} />
                </svg>
              </div>

              {/* Label */}
              <span
                className={`text-xs font-medium leading-tight transition-colors ${
                  isActive ? "text-brand-300" : "text-surface-400 group-hover:text-surface-300"
                }`}
              >
                {tool.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
