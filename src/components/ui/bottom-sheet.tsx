import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
}: BottomSheetProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        aria-label="Close"
        className="absolute inset-0 animate-fade bg-slate-900/50"
        onClick={onClose}
      />
      <div className="animate-sheet relative z-10 flex max-h-[90vh] w-full max-w-[440px] flex-col rounded-t-3xl bg-surface shadow-[var(--shadow-sheet)]">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="press-sm flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground"
            aria-label="Close sheet"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="safe-bottom border-t border-border bg-surface px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
