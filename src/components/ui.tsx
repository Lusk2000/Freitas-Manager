import { HTMLAttributes, ButtonHTMLAttributes, forwardRef, SelectHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "../lib/utils";

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost" | "primary" }>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-xs font-bold transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none ring-offset-[#0A0A0A]",
          {
            "bg-violet-600 text-white hover:bg-violet-700": variant === "primary",
            "bg-[#222] text-[#E0E0E0] hover:bg-[#333]": variant === "default",
            "border border-[#333] bg-transparent hover:bg-[#1A1A1A] text-[#E0E0E0]": variant === "outline",
            "hover:bg-[#1A1A1A] text-[#999] hover:text-white": variant === "ghost",
            "h-8 py-1.5 px-4": true,
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-md border border-[#333] bg-[#181818] px-3 py-1 text-xs text-[#E0E0E0] placeholder:text-[#555] focus:outline-none focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-[#333] bg-[#181818] px-3 py-2 text-xs text-[#E0E0E0] placeholder:text-[#555] focus:outline-none focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-[#333] bg-[#181818] px-3 py-1 text-xs text-[#E0E0E0] placeholder:text-[#555] focus:outline-none focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-colors",
          className
        )}
        {...props}
      />
    );
  }
);
Select.displayName = "Select";

export const Label = forwardRef<HTMLLabelElement, HTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-[10px] font-bold tracking-widest uppercase text-[#777] mb-1.5 block",
          className
        )}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

export function Badge({ className, variant = "default", ...props }: HTMLAttributes<HTMLDivElement> & { variant?: "default" | "success" | "warning" | "danger" | "purple" }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2",
        {
          "border-transparent bg-zinc-800 text-zinc-100": variant === "default",
          "border-transparent bg-green-500/10 text-green-400": variant === "success",
          "border-transparent bg-yellow-500/10 text-yellow-400": variant === "warning",
          "border-transparent bg-red-500/10 text-red-400": variant === "danger",
          "border-transparent bg-purple-500/10 text-purple-400": variant === "purple",
        },
        className
      )}
      {...props}
    />
  );
}

export function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg transform overflow-hidden rounded-lg bg-[#111] border border-[#222] text-left align-middle shadow-2xl transition-all sm:my-8 sm:w-full">
        <div className="border-b border-[#222] px-6 py-4 flex items-center justify-between bg-[#1A1A1A]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
          <button onClick={onClose} className="text-[#555] hover:text-white transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
