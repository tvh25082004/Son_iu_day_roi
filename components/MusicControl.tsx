"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { EVENT } from "@/lib/config";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function MusicControl({ start }: { start: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);

  // Load YouTube IFrame API 1 lần
  useEffect(() => {
    if (typeof window === "undefined" || window.YT?.Player) {
      if (window.YT?.Player) setReady(true);
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    document.head.appendChild(tag);

    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      setReady(true);
    };
  }, []);

  // Tạo player khi API ready
  useEffect(() => {
    if (!ready || playerRef.current || !hostRef.current) return;
    playerRef.current = new window.YT.Player(hostRef.current, {
      videoId: EVENT.youtubeId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        fs: 0,
        iv_load_policy: 3,
      },
      events: {
        onReady: (e: any) => e.target.setVolume(55),
        onStateChange: (e: any) => {
          // nếu người dùng bấm pause trực tiếp trên video → cập nhật icon
          if (e.data === 1) setOn(true);
          if (e.data === 2) setOn(false);
        },
      },
    });
    return () => {
      try {
        playerRef.current?.destroy();
      } catch {}
      playerRef.current = null;
    };
  }, [ready]);

  // Sau khi mở thiệp → tự play
  useEffect(() => {
    if (!start || !playerRef.current) return;
    try {
      playerRef.current.playVideo();
      setOn(true);
    } catch {}
  }, [start, ready]);

  const toggle = () => {
    const p = playerRef.current;
    if (!p) return;
    try {
      if (on) {
        p.pauseVideo();
        setOn(false);
      } else {
        p.playVideo();
        setOn(true);
      }
    } catch {}
  };

  return (
    <>
      {/* player ẩn hoàn toàn */}
      <div className="pointer-events-none fixed left-0 top-0 h-px w-px overflow-hidden opacity-0" aria-hidden>
        <div ref={hostRef} />
      </div>

      {start && (
        <motion.button
          type="button"
          onClick={toggle}
          aria-label={on ? "Tắt nhạc" : "Bật nhạc"}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="fixed right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 bg-white/70 text-gold-deep shadow-md backdrop-blur-md"
          style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
          whileTap={{ scale: 0.9 }}
        >
          {on ? (
            <span className="flex items-end gap-[2.5px]" aria-hidden>
              <span className="eq-bar w-[3px] rounded-full bg-gold-deep" style={{ height: 10 }} />
              <span className="eq-bar w-[3px] rounded-full bg-gold-deep" style={{ height: 14, animationDelay: "0.25s" }} />
              <span className="eq-bar w-[3px] rounded-full bg-gold-deep" style={{ height: 8, animationDelay: "0.5s" }} />
            </span>
          ) : (
            <span className="flex items-end gap-[2.5px]" aria-hidden>
              <span className="w-[3px] rounded-full bg-gold-deep/40" style={{ height: 10 }} />
              <span className="w-[3px] rounded-full bg-gold-deep/40" style={{ height: 14 }} />
              <span className="w-[3px] rounded-full bg-gold-deep/40" style={{ height: 8 }} />
            </span>
          )}
        </motion.button>
      )}
    </>
  );
}
