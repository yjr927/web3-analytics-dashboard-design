import { ReactNode, HTMLAttributes } from "react";
import { clsx } from "clsx";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hoverGlow?: boolean;
}

// All colors strictly from: #2274a5 #63bce9 #104497 #000000 #0f0a0a #f1f2f2
export function GlassCard({ children, className, hoverGlow = false, style, ...props }: GlassCardProps) {
  return (
    <div
      className={clsx(
        "rounded-[20px] transition-all duration-300",
        hoverGlow && "hover:-translate-y-1 cursor-pointer",
        className
      )}
      style={{
        background: "rgba(16, 68, 151, 0.06)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(34, 116, 165, 0.16)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.40), inset 0 1px 0 rgba(99, 188, 233, 0.05)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
