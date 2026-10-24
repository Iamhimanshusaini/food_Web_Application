import { CheckCircle2, X } from "lucide-react";

export default function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[80] flex max-w-sm items-center gap-3 rounded-xl bg-slate-900 px-5 py-4 text-sm font-medium text-white shadow-2xl">
      <CheckCircle2 size={19} className="shrink-0 text-emerald-400" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white" aria-label="Close notification"><X size={16} /></button>
    </div>
  );
}
