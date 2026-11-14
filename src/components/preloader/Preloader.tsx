"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// Daftar bahasa dengan karakter unik dan warna masing-masing
const greetings = [
  { text: "Hello.", color: "var(--cosmos-blue)" },        // Inggris
  { text: "Halo.", color: "var(--crimson-blaze)" },         // Indonesia
  { text: "Bonjour.", color: "var(--gochujang-red)" },      // Prancis
  { text: "Ciao.", color: "var(--cosmos-blue)" },         // Italia
  { text: "こんにちは.", color: "var(--crimson-blaze)" },     // Jepang
  { text: "नमस्ते.", color: "var(--gochujang-red)" },          // India
  { text: "Привет.", color: "var(--cosmos-blue)" },       // Rusia
  { text: "안녕하세요.", color: "var(--crimson-blaze)" },       // Korea
  { text: "مرحباً.", color: "var(--gochujang-red)" },         // Arab
  { text: "你好.", color: "var(--cosmos-blue)" }           // Mandarin
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
