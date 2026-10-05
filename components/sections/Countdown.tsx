"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Reveal from "@/components/Reveal";

const TARGET = new Date("2026-10-11T18:00:00+07:00").getTime();

function diffParts(now: number) {
  const d = Math.max(0, TARGET - now);
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d / 3600000) % 24),
    minutes: Math.floor((d / 60000) % 60),
    seconds: Math.floor((d / 1000) % 60),
    done: d === 0,
  };
}

function Digit({ value, label }: { value: number; label: string }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[4.4rem] w-[4.4rem] overflow-hidden rounded-2xl border border-gold/35 bg-white/70 shadow-[0_16px_40px_-20px_rgba(120,90,40,0.4)] backdrop-blur-sm sm:h-24 sm:w-24">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            initial={{ y: 26, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -26, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center font-serif text-4xl text-ink sm:text-5xl"
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-ink/55">
        {label}
      </span>
    </div>
  );
}

export default function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const parts = now === null ? null : diffParts(now);

  return (
    <section className="relative px-6 py-20">
      <Reveal className="mx-auto max-w-md text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-deep">
          Đếm từng khoảnh khắc
        </p>
        <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
          Đếm ngược đến ngày hạnh phúc
        </h2>
      </Reveal>

      <Reveal delay={0.15} className="mx-auto mt-10 max-w-md">
        {parts === null ? (
          <div className="flex justify-center gap-3 sm:gap-4" aria-hidden>
            {["--", "--", "--", "--"].map((v, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="flex h-[4.4rem] w-[4.4rem] items-center justify-center rounded-2xl border border-gold/35 bg-white/70 font-serif text-4xl text-ink/30 sm:h-24 sm:w-24 sm:text-5xl">
                  {v}
                </div>
                <span className="mt-2.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-ink/55">
                  {["Ngày", "Giờ", "Phút", "Giây"][i]}
                </span>
              </div>
            ))}
          </div>
        ) : parts.done ? (
          <p className="font-serif text-3xl italic text-gold-deep">
            Tiệc đã bắt đầu rồi ✨
          </p>
        ) : (
          <div className="flex justify-center gap-3 sm:gap-4" role="timer" aria-label="Đếm ngược đến buổi tiệc">
            <Digit value={parts.days} label="Ngày" />
            <Digit value={parts.hours} label="Giờ" />
            <Digit value={parts.minutes} label="Phút" />
            <Digit value={parts.seconds} label="Giây" />
          </div>
        )}
      </Reveal>
    </section>
  );
}
