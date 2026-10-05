"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Cover from "@/components/Cover";
import EnvelopeOpening from "@/components/EnvelopeOpening";
import Hero from "@/components/sections/Hero";
import Countdown from "@/components/sections/Countdown";
import EventDetails from "@/components/sections/EventDetails";
import PhotoStory from "@/components/sections/PhotoStory";
import FinalMessage from "@/components/sections/FinalMessage";
import FloatingParticles from "@/components/FloatingParticles";
import MusicControl from "@/components/MusicControl";
import { EASE } from "@/lib/animations";
import { EVENT } from "@/lib/config";
import { music } from "@/lib/music";

type Stage = "cover" | "opening" | "open";

export default function Page() {
  const [stage, setStage] = useState<Stage>("cover");

  // iOS chỉ cho phát nhạc khi lệnh phát nằm trong user gesture. Người dùng có
  // thể chạm bất kỳ đâu trên màn hình (kể cả lúc đang xem bìa thiệp) để bắt đầu
  // nhạc, nên nghe bắt kỳ chạm nào cũng gửi lệnh phát.
  //
  // Không dùng cờ "chỉ chạm một lần": nếu người dùng chạm trước lúc file nhạc
  // kịp tải xong thì cờ đó sẽ khóa vĩnh viễn và nhạc không bao giờ chạy. Gửi lệnh
  // phát lại hoàn toàn vô hại — HTMLAudioElement không phát lại từ đầu khi đã
  // phát, và nút bật/tắt đã chặn sự kiện riêng (xem MusicControl).
  const primeAudio = useCallback(() => {
    if (music.playing) return;
    music.send("play");
  }, []);

  useEffect(() => {
    const opts = { passive: true } as const;
    const targets: Array<EventTarget | null> = [
      window,
      document,
      document.body,
    ];
    targets.forEach((t) => t?.addEventListener("touchend", primeAudio, opts));
    targets.forEach((t) => t?.addEventListener("click", primeAudio, opts));
    return () => {
      targets.forEach((t) => t?.removeEventListener("touchend", primeAudio));
      targets.forEach((t) => t?.removeEventListener("click", primeAudio));
    };
  }, [primeAudio]);

  const open = () => {
    primeAudio();
    setStage("opening");
  };

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <FloatingParticles />

      <motion.div
        initial="hidden"
        animate={stage === "open" ? "show" : "hidden"}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      >
        <Hero />
        <Countdown />
        <EventDetails />
        <PhotoStory />
        <FinalMessage />

        <footer className="relative px-6 pb-[calc(env(safe-area-inset-bottom)+2rem)] text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-ink/40">
            Son ✦ {EVENT.year} ✦ Làm với tất cả yêu thương
          </p>
        </footer>
      </motion.div>

      <MusicControl />

      <AnimatePresence>
        {stage === "cover" && <Cover key="cover" onOpen={open} />}
        {stage === "opening" && (
          <EnvelopeOpening key="opening" onDone={() => setStage("open")} />
        )}
      </AnimatePresence>

      {/* hero chỉ animate show sau khi mở thiệp — để luôn render nhưng che */}
      {stage !== "open" && (
        <motion.div
          className="fixed inset-0 z-20 bg-ivory"
          initial={{ opacity: 1 }}
          animate={{ opacity: stage === "opening" ? 0 : 1 }}
          transition={{ delay: stage === "opening" ? 1.7 : 0, duration: 0.7, ease: EASE }}
        />
      )}
    </main>
  );
}
