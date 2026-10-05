"use client";

import Image from "next/image";
import Reveal from "@/components/Reveal";
import { STORY } from "@/lib/photos";

export default function PhotoStory() {
  return (
    <section id="story" className="relative overflow-hidden py-20">
      <Reveal className="mx-auto max-w-md px-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-deep">
          Câu chuyện bằng ảnh
        </p>
        <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
          Một năm của Son
        </h2>
        <p className="mt-3 text-sm text-ink/60">
          Mười hai tháng — một câu chuyện được kể bằng nụ cười.
        </p>
      </Reveal>

      <div className="mt-14 flex flex-col items-center gap-16 px-6">
        {STORY.map((p, i) => {
          const left = i % 2 === 0;
          return (
            <Reveal
              key={p.src}
              delay={0.05}
              className={`w-full max-w-sm ${left ? "self-start md:self-center" : "self-end md:self-center"}`}
            >
              <figure
                className={`relative mx-auto w-[78vw] max-w-[320px] ${
                  left ? "-rotate-2" : "rotate-2"
                } floating-slow`}
                style={{ animationDelay: `${(i % 3) * 1.3}s` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-white p-2.5 shadow-[0_26px_60px_-28px_rgba(120,90,40,0.5)]">
                  <div className="relative h-full w-full overflow-hidden rounded-[16px]">
                    <Image
                      src={p.src}
                      alt={p.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 430px) 78vw, 320px"
                      className="object-cover object-[50%_25%] transition-transform duration-[1600ms] hover:scale-[1.04]"
                    />
                  </div>
                  {/* caption như ghi chú polaroid */}
                  <figcaption className="flex items-end justify-between px-2 pb-1 pt-3">
                    <span className="font-serif text-lg italic text-ink">
                      {p.caption}
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.22em] text-ink/50">
                      {p.sub}
                    </span>
                  </figcaption>
                </div>
                <span
                  className={`absolute -top-3 ${left ? "-right-2" : "-left-2"} text-sm text-gold/70`}
                  aria-hidden
                >
                  ✦
                </span>
              </figure>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mx-auto mt-16 max-w-md px-6 text-center">
        <p className="font-serif text-2xl italic text-gold-deep">
          Một năm đầy yêu thương
        </p>
      </Reveal>
    </section>
  );
}
