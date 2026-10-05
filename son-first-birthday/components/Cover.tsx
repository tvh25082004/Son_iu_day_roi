"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/animations";
import { EVENT } from "@/lib/config";

export default function Cover({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-30 overflow-hidden"
      exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.8, ease: EASE } }}
    >
      {/* nền giấy ấm */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, #fdfaf4 0%, #f6efe2 55%, #eee2cb 100%)",
        }}
      />
      <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-champagne/45 blur-3xl" />
      <div className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
          className="text-lg text-gold"
        >
          ✦
        </motion.span>

        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.72em" }}
          animate={{ opacity: 1, letterSpacing: "0.4em" }}
          transition={{ delay: 0.45, duration: 1.5, ease: EASE }}
          className="mt-6 text-[11px] font-semibold uppercase text-gold-deep"
        >
          A little miracle
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.95, duration: 1.1, ease: EASE }}
          className="mt-5 font-serif text-[2.6rem] leading-tight sm:text-5xl"
        >
          is turning <span className="italic text-gold-deep">ONE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.35, duration: 1 }}
          className="mt-6 font-serif text-xl text-ink/90"
        >
          {EVENT.babyName}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.55, duration: 0.8 }}
          className="mt-2 text-[11px] uppercase tracking-[0.32em] text-ink/60"
        >
          {EVENT.displayDate}
        </motion.p>

        <motion.button
          type="button"
          onClick={onOpen}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.05, duration: 0.9, ease: EASE }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="shimmer mt-12 rounded-full border border-gold/70 bg-white/55 px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-gold-deep shadow-[0_12px_44px_-14px_rgba(160,127,62,0.55)] backdrop-blur-sm transition-colors hover:bg-white/85"
        >
          Open invitation
        </motion.button>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.9 }}
        className="absolute inset-x-0 bottom-7 z-10 text-center text-[10px] uppercase tracking-[0.3em] text-ink/50"
      >
        18:00 ✦ {EVENT.venue}
      </motion.p>
    </motion.div>
  );
}
