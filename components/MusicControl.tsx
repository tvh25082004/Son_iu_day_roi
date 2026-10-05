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

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/**
 * Nút bật/tắt nhạc nền.
 *
 * Nguồn phát ưu tiên là file mp3 trong public/audio (chỉ có tiếng, không bao
 * giờ mở video YouTube). Nếu không có file thì fallback sang iframe YouTube —
 * bắt buộc width/height = 1, nếu không YouTube tạo iframe 640×390 và điện
 * thoại sẽ bị mở app YouTube.
 */
export default function MusicControl({ start }: { start: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  const [playing, setPlaying] = useState(music.playing);
  const [useFile, setUseFile] = useState(music.fileAvailable);
  const [ytReady, setYtReady] = useState(false);

  /* ---------- Kiểm tra file mp3 trước khi người dùng bấm ---------- */
  useEffect(() => {
    music.probe();
  }, []);

  /* ---------- Theo dõi trạng thái phát ---------- */
  useEffect(
    () =>
      music.onState((p) => {
        setPlaying(p);
        setUseFile(music.fileAvailable);
      }),
    []
  );

  /* ---------- YouTube fallback: chỉ dựng khi thiếu file mp3 ---------- */
  useEffect(() => {
    if (useFile || typeof window === "undefined") return;

    if (window.YT?.Player) {
      setYtReady(true);
      return;
    }
    window.onYouTubeIframeAPIReady = () => setYtReady(true);
    if (!document.getElementById("yt-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "yt-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.head.appendChild(tag);
    }
  }, [useFile]);

  useEffect(() => {
    if (useFile || !ytReady) return;
    if (playerRef.current || !hostRef.current) return;

    playerRef.current = new window.YT.Player(hostRef.current, {
      videoId: EVENT.youtubeId,
      width: 1,
      height: 1,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        fs: 0,
        iv_load_policy: 3,
        origin: window.location.origin,
      },
      events: {
        onReady: (e: any) => {
          try {
            e.target.setVolume(45);
          } catch {}
        },
        onStateChange: (e: any) => {
          music.setPlaying(e.data === 1);
        },
      },
    });

    return () => {
      try {
        playerRef.current?.destroy();
      } catch {}
      playerRef.current = null;
    };
  }, [useFile, ytReady]);

  /* ---------- Nhận lệnh phát từ bus (khi không có file mp3) ---------- */
  const actOnPlayer = useCallback((cmd: "play" | "pause" | "toggle") => {
    const p = playerRef.current;
    if (!p) return;
    const isOn = playing;
    try {
      if (cmd === "play" || (cmd === "toggle" && !isOn)) p.playVideo();
      else p.pauseVideo();
    } catch {}
  }, [playing]);

  useEffect(() => music.onCommand(actOnPlayer), [actOnPlayer]);

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
      {/* Nguồn phát chính: file mp3 nội bộ, không giao diện, không redirect */}
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
        onError={() => music.markFileMissing()}
      />

      {/* Fallback YouTube: iframe 1×1, ngoài màn hình, không bấm được */}
      {!useFile && (
        <div
          aria-hidden
          className="pointer-events-none fixed bottom-0 left-0 z-0 h-px w-px overflow-hidden opacity-0"
        >
          <div ref={hostRef} />
        </div>
      )}

      {start && (
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