import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info } from "lucide-react";

interface TooltipProps {
  children: ReactNode;
  content: string;
}

export function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center w-full"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 w-max max-w-xs pointer-events-none"
          >
            <div className="bg-[#1A1F3A] border border-white/10 text-white text-xs px-3 py-2 rounded-lg shadow-xl flex items-start gap-2 backdrop-blur-md">
               <Info className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
               <p>{content}</p>
            </div>
            {/* Arrow */}
            <div className="w-2 h-2 bg-[#1A1F3A] border-r border-b border-white/10 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}