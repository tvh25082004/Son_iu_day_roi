"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { EVENT } from "@/lib/config";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/**
 * Nhạc nền.
 *
 * Ưu tiên file âm thanh nội bộ (public/audio) qua thẻ <audio>: trên điện
 * thoại iOS/Android chỉ có tiếng, không bao giờ mở app YouTube.
 *
 * Nếu thiếu file audio → fallback sang iframe YouTube. Bắt buộc phải truyền
 * width/height = 1, nếu không YouTube tạo iframe 640×390 và trên điện thoại
 * bị trình duyệt nâng thành video toàn màn hình / mở app YouTube.
 */
export default function MusicControl({ start }: { start: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const userPaused = useRef(false);

  const [engine, setEngine] = useState<"local" | "youtube">(
    EVENT.audioSrc ? "local" : "youtube"
  );
  const [ytReady, setYtReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  /* ---------- YouTube fallback: nạp API một lần ---------- */
  useEffect(() => {
    if (engine !== "youtube" || typeof window === "undefined") return;

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
  }, [engine]);

  /* ---------- Tạo player 1×1 ---------- */
  useEffect(() => {
    if (engine !== "youtube" || !ytReady) return;
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
          if (e.data === 1) setPlaying(true);
          if (e.data === 2 || e.data === 0) setPlaying(false);
        },
      },
    });

    return () => {
      try {
        playerRef.current?.destroy();
      } catch {}
      playerRef.current = null;
    };
  }, [engine, ytReady]);

  const play = useCallback(() => {
    userPaused.current = false;
    if (engine === "local") {
      const a = audioRef.current;
      if (!a) return;
      a.volume = 0.45;
      a.play().catch(() => {});
      return;
    }
    try {
      playerRef.current?.playVideo();
    } catch {}
  }, [engine]);

  const pause = useCallback(() => {
    userPaused.current = true;
    if (engine === "local") {
      audioRef.current?.pause();
      return;
    }
    try {
      playerRef.current?.pauseVideo();
    } catch {}
  }, [engine]);

  /* ---------- Thử bật nhạc khi mở thiệp ----------
   * iOS chỉ cho autoplay trong user gesture, nên nếu bị chặn thì icon vẫn hiện
   * trạng thái tắt và người dùng bấm một cái là nghe được. */
  useEffect(() => {
    if (!start) return;
    if (engine === "local") {
      const a = audioRef.current;
      if (!a) return;
      a.volume = 0.45;
      a.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
      return;
    }
    if (!ytReady || !playerRef.current) return;
    try {
      playerRef.current.playVideo();
    } catch {}
  }, [start, engine, ytReady]);

  /* ---------- Người dùng bật/tắt ---------- */
  const toggle = () => {
    if (playing) {
      pause();
      setPlaying(false);
    } else {
      play();
      setPlaying(true);
    }
  };

  const EQ_BARS = [10, 14, 8];

  return (
    <>
      {/* Nguồn âm thanh nội bộ — không có giao diện, chỉ phát nhạc */}
      <audio
        ref={audioRef}
        src={EVENT.audioSrc}
        loop
        preload="auto"
        playsInline
        onError={() => setEngine("youtube")}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={EVENT.audioSrc} type="audio/mpeg" />
      </audio>

      {/* Fallback YouTube: iframe 1×1, nằm ngoài màn hình, không bấm được */}
      {engine === "youtube" && (
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
            {EQ_BARS.map((h, i) => (
              <span
                key={h + i}
                style={{
                  height: h,
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