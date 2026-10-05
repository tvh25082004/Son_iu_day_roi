"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { DAILY } from "@/lib/daily";

/**
 * Khung trượt "images daily" — những ngày bình thường của Bé Son.
 *
 * Dùng overflow-x + scroll-snap gốc của trình duyệt thay vì thư viện kéo ảnh:
 * trên iOS (Zalo, Messenger, Safari) kéo nguyên bản mượt hơn hẳn, không giật,
 * và vẫn cuộn bằng ngón tay lẫn chuột. Hai nút bên cạnh để trượt cả hai chiều
 * trên máy tính.
 */
export default function ImagesDaily() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [hinted, setHinted] = useState(false);
  const total = DAILY.length;

  const slideTo = useCallback((i: number, smooth = true) => {
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[i] as HTMLElement | undefined;
    if (!child) return;
    track.scrollTo({
      left: child.offsetLeft - track.offsetLeft,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  // Bám vị trí thật của scrollbar nên chấm điểm không lệch khi người xem tự kéo.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // Bước nhảy giữa hai slide = chiều rộng slide + gap, phải tính từ
        // offsetLeft thật. Dùng clientWidth sẽ lệch dần vì có gap.
        const first = track.children[0] as HTMLElement | undefined;
        const second = track.children[1] as HTMLElement | undefined;
        const pitch = first && second ? second.offsetLeft - first.offsetLeft : 0;
        if (pitch <= 0) return;
        setIndex(Math.round(track.scrollLeft / pitch));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((cur) => {
        const next = (cur + dir + total) % total;
        slideTo(next);
        return next;
      });
    },
    [slideTo, total]
  );

  useEffect(() => {
    const t = setTimeout(() => setHinted(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative pb-24 pt-4">
      <Reveal className="px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-deep">
          images daily
        </p>
        <h3 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
          Những ngày bình thường
        </h3>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ink/70">
          Không phải ngày lễ, cũng không cần chuẩn bị gì — chỉ là những ngày
          thường ngày bên Bé Son.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-9">
        <div className="flex items-stretch gap-3 px-4">
          <Arrow dir={-1} onClick={() => go(-1)} />

          {/* Mỗi slide rộng ~72% bề ngang nên luôn thấy 1.5 ô ở giữa */}
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {DAILY.map((photo, i) => (
              <figure
                key={photo.src}
                className="relative aspect-[3/4] w-[72vw] max-w-[260px] shrink-0 snap-start overflow-hidden rounded-[22px] border border-gold/45 bg-ink/5 shadow-[0_22px_50px_-24px_rgba(120,90,40,0.5)]"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  loading={i < 2 ? "eager" : "lazy"}
                  sizes="(max-width: 430px) 72vw, 260px"
                  className="object-cover"
                />
                <span className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-inset ring-white/35" />
              </figure>
            ))}
          </div>

          <Arrow dir={1} onClick={() => go(1)} />
        </div>
      </Reveal>

      <Reveal delay={0.15} className="mt-6 flex flex-col items-center gap-3">
        <div className="flex max-w-[86vw] flex-wrap items-center justify-center gap-1.5">
          {DAILY.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => {
                setIndex(i);
                slideTo(i);
              }}
              aria-label={`Tới ảnh ${i + 1}`}
              aria-current={index === i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: index === i ? 20 : 6,
                background:
                  index === i ? "rgb(168,132,72)" : "rgba(120,90,40,0.28)",
              }}
            />
          ))}
        </div>
        <p
          className="text-[11px] uppercase tracking-[0.28em] text-ink/45 transition-opacity duration-700"
          style={{ opacity: hinted ? 1 : 0 }}
        >
          Vuốt ← →
        </p>
      </Reveal>
    </section>
  );
}

function Arrow({
  dir,
  onClick,
}: {
  dir: 1 | -1;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === -1 ? "Ảnh trước" : "Ảnh tiếp theo"}
      className="hidden shrink-0 self-center rounded-full border border-gold/60 bg-white/70 p-2 text-gold-deep shadow-sm backdrop-blur-md transition active:scale-90 sm:block"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d={dir === -1 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}