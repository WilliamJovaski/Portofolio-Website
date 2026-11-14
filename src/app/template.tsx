"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

// Template di-remount tiap pindah route -> animasi masuk halus (fade + slide pendek).
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
