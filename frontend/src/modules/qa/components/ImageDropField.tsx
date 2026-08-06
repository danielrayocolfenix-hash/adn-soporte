import { useEffect, useMemo } from "react";
import { Image as ImageIcon, X } from "lucide-react";

interface ImageDropFieldProps {
  label: string;
  file: File | null;
  existingUrl?: string | null;
  onChange: (file: File | null) => void;
}

export function ImageDropField({ label, file, existingUrl, onChange }: ImageDropFieldProps) {
  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  const previewUrl = objectUrl ?? existingUrl ?? null;

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>

      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <img src={previewUrl} alt={label} className="w-full h-40 object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
          <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
            <ImageIcon size={20} />
          </div>
          <p className="text-xs text-slate-400">PNG, JPG o WEBP hasta 10MB</p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          />
        </label>
      )}
    </div>
  );
}
