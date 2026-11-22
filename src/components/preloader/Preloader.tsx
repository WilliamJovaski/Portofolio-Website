"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// Daftar bahasa dengan karakter unik dan warna keluarga biru dari design tokens
const greetings = [
  { text: "Hello.", color: "var(--color-ink)" },        // Inggris
  { text: "Halo.", color: "var(--color-blue)" },         // Indonesia
  { text: "Bonjour.", color: "var(--color-green)" },      // Prancis
  { text: "Ciao.", color: "var(--color-ink)" },         // Italia
  { text: "こんにちは.", color: "var(--color-blue)" },     // Jepang
  { text: "नमस्ते.", color: "var(--color-green)" },          // India
  { text: "Привет.", color: "var(--color-ink)" },       // Rusia
  { text: "안녕하세요.", color: "var(--color-blue)" },       // Korea
  { text: "مرحباً.", color: "var(--color-green)" },         // Arab
  { text: "你好.", color: "var(--color-ink)" }           // Mandarin
];

interface PreloaderProps {
  /** Dipanggil setelah kata terakhir selesai dan teks sudah hilang. */
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [showText, setShowText] = useState(true); 
  const [index, setIndex] = useState(0);

  // Simpan callback di ref supaya timer tidak ter-reset kalau parent re-render
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Logika teks sapaan
  useEffect(() => {
    if (index < greetings.length - 1) {
      const timer = setTimeout(() => {
        setIndex(index + 1);
      }, 200); 
      return () => clearTimeout(timer);
    } else {
      // Biarkan teks Mandarin diam sejenak (400ms), lalu hilangkan teksnya
      const hideTextTimer = setTimeout(() => {
        setShowText(false); 
      }, 400);

      // Setelah teks hilang, panggil onComplete (dulu: lanjut ke fase envelope)
      const completeTimer = setTimeout(() => {
        onCompleteRef.current();
      }, 900); 

      return () => {
        clearTimeout(hideTextTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [index]);

  return (
    <div className="fixed inset-0 z-[9999] bg-paper flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {showText && (
          <motion.div
            exit={{ opacity: 0, y: -40 }} 
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold"
          >
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="whitespace-nowrap block will-change-[opacity,transform]"
              style={{ 
                color: greetings[index].color,
                transform: "translateZ(0)" 
              }} 
            >
              {greetings[index].text}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
