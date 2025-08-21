"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type BentoCardProps = {
  className?: string;
  children: ReactNode;
  hover?: boolean;
  delay?: number;
};

export default function BentoCard({ className = "", children, hover = true, delay = 0 }: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      whileHover={hover ? { scale: 1.01 } : undefined}
      className={`rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.35)] ${className}`}
    >
      {children}
    </motion.div>
  );
}


