"use client";

import { useState } from "react";
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

type Stage = "cover" | "opening" | "open";

export default function Page() {
  const [stage, setStage] = useState<Stage>("cover");

  const open = () => setStage("opening");

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
            Son ✦ {EVENT.year} ✦ Made with love
          </p>
        </footer>
      </motion.div>

      <MusicControl start={stage !== "cover"} />

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
