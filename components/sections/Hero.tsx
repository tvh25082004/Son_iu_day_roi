"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { EASE } from "@/lib/animations";
import { HERO } from "@/lib/photos";
import { EVENT } from "@/lib/config";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 pb-16 pt-[calc(env(safe-area-inset-top)+4rem)]"
    >
      <motion.div
        className="flex flex-col items-center text-center"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.16, delayChildren: 0.15 } } }}
      >
        <motion.span
          variants={{ hidden: { opacity: 0, scale: 0.5 }, show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } } }}
          className="text-base text-gold"
        >
          ✦
        </motion.span>

        <motion.h1
          variants={{ hidden: { opacity: 0, y: 26, filter: "blur(8px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: EASE } } }}
          className="mt-5 font-serif text-[17vw] leading-[1.02] text-ink sm:text-7xl"
        >
          <span className="block">Son</span>
          <span className="block italic text-gold-deep">is turning</span>
          <span className="block">ONE</span>
        </motion.h1>

        {/* Ảnh hero — vòm sang trọng */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 40, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.2, ease: EASE } } }}
          className="floating-slower relative mt-10 w-[74vw] max-w-[330px]"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[28px] shadow-[0_30px_80px_-24px_rgba(120,90,40,0.45)]">
            <div className="absolute inset-[7px] overflow-hidden rounded-t-[999px] rounded-b-[22px]">
              <motion.div
                className="relative h-full w-full"
                initial={{ scale: 1 }}
                animate={{ scale: 1.05 }}
                transition={{ duration: 12, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
              >
                <Image
                  src={HERO}
                  alt="Bé Son — ảnh nhẹ nhàng nhất"
                  fill
                  priority
                  sizes="(max-width: 430px) 74vw, 330px"
                  className="object-cover object-[50%_18%]"
                />
              </motion.div>
            </div>
            {/* viền vàng kép */}
            <div className="pointer-events-none absolute inset-0 rounded-t-[999px] rounded-b-[28px] border border-gold/60" />
          </div>

          <div className="pointer-events-none absolute -inset-3 -z-10 rounded-t-[999px] rounded-b-[36px] border border-gold/25" />

          <span className="absolute -left-1 top-6 text-gold/70">✦</span>
          <span className="absolute -right-2 bottom-10 text-xs text-gold/60">✦</span>
        </motion.div>

        <motion.p
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 1, delay: 0.2 } } }}
          className="mt-9 font-serif text-2xl text-ink"
        >
          {EVENT.babyName}
        </motion.p>

        <motion.p
          variants={{ hidden: { opacity: 0, letterSpacing: "0.6em" }, show: { opacity: 1, letterSpacing: "0.34em", transition: { duration: 1.3, ease: EASE } } }}
          className="mt-3 text-[12px] font-medium uppercase text-gold-deep"
        >
          {EVENT.displayDate}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1.4rem)] flex flex-col items-center gap-2"
        aria-hidden
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-ink/45">Scroll</span>
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-gold/70"
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
