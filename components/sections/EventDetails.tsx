"use client";

import { motion } from "motion/react";
import Reveal from "@/components/Reveal";
import { EVENT } from "@/lib/config";

export default function EventDetails() {
  return (
    <section id="event" className="relative px-6 py-20">
      <Reveal className="mx-auto max-w-md text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-deep">
          Ghi lịch
        </p>
        <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
          Ngày 11 tháng 10 năm 2026
        </h2>
      </Reveal>

      <Reveal delay={0.12} className="mx-auto mt-10 max-w-md">
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.35 }}
          className="relative rounded-[26px] border border-gold/40 bg-white/75 px-7 py-10 text-center shadow-[0_28px_70px_-30px_rgba(120,90,40,0.45)] backdrop-blur-sm"
        >
          {/* góc trang trí */}
          <span className="absolute left-4 top-4 text-xs text-gold/70" aria-hidden>✦</span>
          <span className="absolute right-4 top-4 text-xs text-gold/70" aria-hidden>✦</span>
          <span className="absolute bottom-4 left-4 text-xs text-gold/70" aria-hidden>✦</span>
          <span className="absolute bottom-4 right-4 text-xs text-gold/70" aria-hidden>✦</span>

          <p className="font-serif text-5xl text-gold-deep">{EVENT.timeLabel}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-ink/50">
            Giờ tiệc
          </p>

          <div className="mx-auto my-7 h-px w-24 bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

          <h3 className="font-serif text-3xl text-ink">{EVENT.venue}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">
            {EVENT.venueDetail}
          </p>

          <div className="mx-auto my-7 h-px w-24 bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

          <p className="text-[11px] uppercase tracking-[0.3em] text-ink/55">
            Sinh nhật 1 tuổi ✦ gia đình &amp; bạn bè
          </p>

          <motion.a
            href={EVENT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="mt-8 inline-flex min-h-[44px] items-center rounded-full border border-gold/70 bg-ivory px-8 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-deep shadow-sm transition-colors hover:bg-champagne/40"
          >
            Xem vị trí
          </motion.a>
        </motion.div>
      </Reveal>
    </section>
  );
}
