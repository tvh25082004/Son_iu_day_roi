"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { EVENT } from "@/lib/config";
import { music } from "@/lib/music";

const EQ_BARS = [
  { id: "low", height: 10 },
  { id: "mid", height: 14 },
  { id: "high", height: 8 },
];

/**
 * Nút bật/tắt nhạc nền.
 *
 * Nguồn phát duy nhất là file mp3 trong public/audio, phát qua thẻ <audio>.
 * Cố tình KHÔNG nhúng YouTube: khi mở link từ Zalo/Messenger, các app này
 * dùng WKWebView và sẽ tự mở video YouTube toàn màn hình rồi không phát nhạc.
 */
export default function MusicControl() {
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    music.probe();
    return music.onState(setPlaying);
  }, []);

  const handleError = useCallback(() => {
    setMissing(true);
  }, []);

  const toggle = () => {
    if (playing) {
      music.send("pause");
      setPlaying(false);
    } else {
      music.send("play");
      setPlaying(true);
    }
  };

  return (
    <>
      {/* Nguồn phát duy nhất: file mp4/mp3 nội bộ, không giao diện, không redirect */}
      <audio
        ref={(el) => {
          if (el) el.volume = 0.45;
          music.register(el);
        }}
        src={EVENT.audioSrc}
        loop
        preload="auto"
        playsInline
        onPlay={() => music.setPlaying(true)}
        onPause={() => music.setPlaying(false)}
        onError={handleError}
      />

      {!missing && (
        <motion.button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Tắt nhạc" : "Bật nhạc"}
          aria-pressed={playing}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="fixed right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 bg-white/70 text-gold-deep shadow-md backdrop-blur-md"
          style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="flex items-end gap-[2.5px]" aria-hidden>
            {EQ_BARS.map((bar, i) => (
              <span
                key={bar.id}
                style={{
                  height: bar.height,
                  ...(playing
                    ? { animation: `eq 0.9s ease-in-out ${i * 0.25}s infinite` }
                    : {}),
                }}
                className={`w-[3px] rounded-full ${
                  playing ? "bg-gold-deep" : "bg-gold-deep/40"
                }`}
              />
            ))}
          </span>
        </motion.button>
      )}
    </>
  );
}