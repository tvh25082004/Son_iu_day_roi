"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { music } from "@/lib/music";

const EQ_BARS = [
  { id: "low", height: 10 },
  { id: "mid", height: 14 },
  { id: "high", height: 8 },
];

type Status = "loading" | "ready" | "missing";

/**
 * Nút bật/tắt nhạc nền.
 *
 * Nguồn phát duy nhất là file âm thanh trong public/audio, phát qua thẻ <audio>.
 * Cố tình KHÔNG nhúng YouTube: khi mở link từ Zalo/Messenger, các app này dùng
 * WKWebView và sẽ tự mở video YouTube toàn màn hình rồi không phát nhạc.
 *
 * Không có bất kỳ dòng chữ nào bắt người dùng phải bấm — chạm vào bất kỳ đâu trên
 * màn hình là nhạc chạy (xem app/page.tsx).
 */
export default function MusicControl() {
  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let alive = true;
    music.init().then((found) => {
      if (alive) setStatus(found ? "ready" : "missing");
    });
    return music.onState(setPlaying);
  }, []);

  const handleError = useCallback(() => {
    // File vừa nạp không phát được (ví dụ trình duyệt không giải mã được định
    // dạng đó) → lib/music tự thử file tiếp theo; chỉ khi hết danh sách mới báo
    // thiếu file.
    music.handleError().then((missing) => {
      if (missing) setStatus("missing");
    });
  }, []);

  const toggle = (e: React.MouseEvent) => {
    // Ngăn sự kiện nổi lên window: nếu lọt lên đó, page.tsx sẽ gửi "play" và
    // ngay lập tức phát lại sau khi người dùng vừa bấm tắt.
    e.stopPropagation();
    if (music.playing) {
      music.send("pause");
    } else {
      music.send("play");
    }
  };

  return (
    <>
      {/*
        Nguồn phát duy nhất: file âm thanh nội bộ trong public/audio, không giao
        diện, không redirect. Không khai báo src cứng ở đây — lib/music tự dò
        xem thư mục có file nào rồi mới gán, nên chỉ cần thả file vào là chạy,
        không phải sửa code.
      */}
      <audio
        ref={(el) => {
          if (el) el.volume = 0.45;
          music.register(el);
        }}
        loop
        preload="auto"
        playsInline
        onPlay={() => music.setPlaying(true)}
        onPause={() => music.setPlaying(false)}
        onError={handleError}
      />

      {status === "ready" && (
        <motion.button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Tắt nhạc" : "Bật nhạc"}
          aria-pressed={playing}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
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