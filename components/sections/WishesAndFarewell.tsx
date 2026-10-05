"use client";

import { motion } from "motion/react";
import Reveal from "@/components/Reveal";
import { EVENT } from "@/lib/config";

/** Lời chúc của người thân gia đình. */
const WISHES = [
  "Chúc bé mỗi ngày một nắng, một nụ cười rạng rỡ.",
  "Chúc con lớn nhanh nhưng luôn hiền lành, dịu dàng.",
  "Chúc con mãi tươi vui trong vòng tay yêu thương của gia đình.",
  "Chúc những bước chân nhỏ bé luôn vững vàng, và những giấc mơ luôn sáng.",
];

/** Màn kết: lời chúc rồi tới lời hẹn gặp tại bữa tiệc. */
export default function WishesAndFarewell() {
  return (
    <section className="relative overflow-hidden px-6 pb-32 pt-16 text-center">
      {/* hào quang ấm phía sau */}
      <div
        className="pointer-events-none absolute left-1/2 top-10 -z-10 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(234,217,189,0.75), transparent 70%)",
        }}
      />

      <Reveal>
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-deep">
          Lời chúc
        </p>
      </Reveal>

      <div className="mx-auto mt-9 max-w-sm space-y-6">
        {WISHES.map((wish, i) => (
          <Reveal key={wish} delay={0.06 * i}>
            <p className="font-serif text-lg leading-relaxed text-ink/85">
              {wish}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.15} className="mt-14">
        <div className="mx-auto flex w-fit items-center gap-3 text-gold/70">
          <span className="h-px w-8 bg-current" />
          <span className="text-sm">✦</span>
          <span className="h-px w-8 bg-current" />
        </div>
      </Reveal>

      <Reveal delay={0.2} className="mt-12">
        <p className="font-serif text-xl italic text-ink/70">
          Rất mong được gặp bạn
        </p>
        <motion.p
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="mt-4 font-serif text-[1.7rem] italic leading-snug text-gold-deep sm:text-4xl"
        >
          Hẹn gặp bạn tại bữa tiệc ✨
        </motion.p>
        <p className="mt-6 text-[11px] uppercase tracking-[0.34em] text-ink/55">
          {EVENT.babyName} · {EVENT.displayDate}
        </p>
      </Reveal>
    </section>
  );
}