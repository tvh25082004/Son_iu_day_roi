"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { FINAL } from "@/lib/photos";
import { EVENT } from "@/lib/config";

export default function FinalMessage() {
  return (
    <section className="relative overflow-hidden px-6 pb-28 pt-24 text-center">
      {/* hào quang ấm phía sau */}
      <div
        className="pointer-events-none absolute left-1/2 top-16 -z-10 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(234,217,189,0.8), transparent 70%)" }}
      />

      <Reveal>
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-deep">
          Trân trọng gửi
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mx-auto mt-8 w-[70vw] max-w-[300px]">
        <div className="floating-slow relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[26px] border border-gold/50 shadow-[0_30px_70px_-26px_rgba(120,90,40,0.5)]">
          <Image
            src={FINAL}
            alt="Bé Son — khoảnh khắc đẹp nhất năm đầu đời"
            fill
            loading="lazy"
            sizes="(max-width: 430px) 70vw, 300px"
            className="object-cover object-[50%_20%]"
          />
          <div className="pointer-events-none absolute inset-0 rounded-t-[999px] rounded-b-[26px] ring-1 ring-inset ring-white/40" />
        </div>
      </Reveal>

      <Reveal delay={0.15} className="mx-auto mt-10 max-w-sm">
        <p className="font-serif text-xl leading-relaxed text-ink/90">
          Cảm ơn bạn đã cùng chúng tôi
          <br />
          chúc mừng cột mốc nhỏ bé này.
        </p>
        <p className="mt-6 font-serif text-2xl italic text-gold-deep">
          Yêu thương,
        </p>
        <p className="mt-1 font-serif text-xl text-ink">Gia đình Son</p>
        <p className="mt-6 text-[11px] uppercase tracking-[0.34em] text-ink/55">
          {EVENT.displayDate}
        </p>
      </Reveal>

      <Reveal delay={0.25}>
        <motion.p
          animate={{ opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="mt-12 font-serif text-3xl italic text-gold-deep"
        >
          Hẹn gặp bạn tại bữa tiệc ✨
        </motion.p>
      </Reveal>
    </section>
  );
}
