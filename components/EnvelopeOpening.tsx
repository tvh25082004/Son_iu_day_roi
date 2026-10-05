"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { EASE } from "@/lib/animations";
import { HERO } from "@/lib/photos";
import { EVENT } from "@/lib/config";

export default function EnvelopeOpening({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(14px)" }}
      transition={{ duration: 0.5 }}
      style={{ background: "rgba(38, 30, 18, 0.42)" }}
    >
      {/* ===== Envelope ===== */}
      <motion.div
        className="relative"
        initial={{ scale: 0.92, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="relative h-[220px] w-[320px] sm:h-[260px] sm:w-[380px]">
          {/* thân phong bì */}
          <div
            className="absolute inset-0 rounded-xl shadow-[0_40px_90px_-24px_rgba(0,0,0,0.55)]"
            style={{
              background: "linear-gradient(160deg, #fdf8ee 0%, #f3e9d4 100%)",
            }}
          />
          {/* đường gấp bên */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background:
                "linear-gradient(115deg, transparent 42%, rgba(160,127,62,0.12) 50%, transparent 58%)",
            }}
          />

          {/* thư bên trong — trượt lên khi mở */}
          <motion.div
            className="absolute left-1/2 top-3 h-[190%] w-[86%] -translate-x-1/2 overflow-hidden rounded-lg bg-white shadow-[0_18px_50px_-18px_rgba(0,0,0,0.4)]"
            initial={{ y: 60 }}
            animate={{ y: [-0, -150] }}
            transition={{ delay: 1.05, duration: 1.1, ease: EASE }}
          >
            <div className="relative h-full w-full">
              <Image
                src={HERO}
                alt="Bé Son"
                fill
                sizes="340px"
                className="object-cover object-[50%_22%]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-4 text-center">
                <p className="font-serif text-2xl italic text-white drop-shadow">
                  Son turns ONE
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.34em] text-white/85">
                  {EVENT.displayDate}
                </p>
              </div>
            </div>
          </motion.div>

          {/* nắp phong bì — lật mở */}
          <motion.div
            className="absolute inset-x-0 top-0 z-10 h-[52%] origin-top rounded-t-xl"
            style={{
              background: "linear-gradient(180deg, #f8f1e0 0%, #efe3c8 100%)",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              backfaceVisibility: "hidden",
            }}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: 180 }}
            transition={{ delay: 0.55, duration: 0.85, ease: EASE }}
          >
            <div className="flex h-full items-start justify-center pt-5">
              <span className="text-sm tracking-[0.3em] text-gold-deep/70">✦</span>
            </div>
          </motion.div>

          {/* túi trước của phong bì (che phần dưới lá thư) */}
          <div
            className="absolute inset-0 z-20 rounded-xl"
            style={{
              background: "linear-gradient(200deg, #fbf5e8 0%, #f1e6cd 100%)",
              clipPath:
                "polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-5 z-30 text-center">
            <span className="rounded-full border border-gold/50 px-4 py-1.5 text-[9px] uppercase tracking-[0.34em] text-gold-deep/80">
              For you
            </span>
          </div>

          {/* seal sáp vàng */}
          <motion.div
            className="absolute left-1/2 top-[46%] z-30 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full text-base text-white shadow-lg"
            style={{
              background:
                "radial-gradient(circle at 32% 30%, #dcbd85, #a07f3e 70%)",
            }}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.14, 0], opacity: [1, 1, 0] }}
            transition={{ delay: 0.4, duration: 0.5, times: [0, 0.5, 1] }}
          >
            S
          </motion.div>
        </div>
      </motion.div>

      {/* ===== Light bloom quét toàn màn ===== */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, transparent 30%, rgba(255,240,200,0.85) 50%, transparent 70%)",
        }}
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={{ delay: 1.15, duration: 1.15, ease: "easeInOut" }}
      />

      {/* nền sáng dần → hero */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[#fbf7f0]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.75, duration: 0.8, ease: "easeInOut" }}
        onAnimationComplete={onDone}
      />
    </motion.div>
  );
}
