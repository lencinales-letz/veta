"use client";

import { motion } from "framer-motion";

export default function BackgroundGrid() {
  const rows = 10;
  const cols = 16;
  const cells = Array.from({ length: rows * cols });
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(56,189,248,0.15),transparent_60%)]" />
      <div className="grid h-full w-full" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {cells.map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.04, 0.08, 0.04] }}
            transition={{ duration: 6, repeat: Infinity, delay: (i % cols) * 0.1 }}
            className="border-r border-b border-black/[0.04] dark:border-white/[0.06]"/>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/60 dark:to-black/60" />
    </div>
  );
}


