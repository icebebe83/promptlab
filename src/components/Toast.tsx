"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, Check, AlertTriangle, Info, Copy } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info" | "copy";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const iconMap: Record<ToastType, ReactNode> = {
    success: <Check size={16} className="text-emerald-400" />,
    error: <AlertTriangle size={16} className="text-rose-400" />,
    warning: <AlertTriangle size={16} className="text-amber-400" />,
    info: <Info size={16} className="text-blue-400" />,
    copy: <Copy size={16} className="text-brand-yellow" />,
  };

  const borderMap: Record<ToastType, string> = {
    success: "border-emerald-500/30",
    error: "border-rose-500/30",
    warning: "border-amber-500/30",
    info: "border-blue-500/30",
    copy: "border-brand-yellow/30",
  };

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-xl border ${borderMap[toast.type]} shadow-2xl shadow-black/40 animate-slide-in-toast min-w-[280px] max-w-[400px]`}
    >
      <div className="shrink-0">{iconMap[toast.type]}</div>
      <p className="text-sm font-medium text-slate-200 flex-1">{toast.message}</p>
      <button
        onClick={onClose}
        className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
