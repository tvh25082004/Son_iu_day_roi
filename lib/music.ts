"use client";

import { EVENT } from "./config";

type StateListener = (playing: boolean) => void;

let node: HTMLAudioElement | null = null;
let playing = false;

const stateListeners = new Set<StateListener>();

function emitState() {
  stateListeners.forEach((fn) => fn(playing));
}

/**
 * Điều khiển nhạc nền — chỉ dùng thẻ <audio> với file mp3 trong public/audio.
 *
 * KHÔNG dùng iframe YouTube: các ứng dụng nhắn tin (Zalo, Messenger) mở link
 * bằng WKWebView và sẽ tự mở video YouTube toàn màn hình, đồng thời chặn phát
 * âm thanh. Vì vậy toàn bộ player YouTube đã bị gỡ khỏi dự án.
 *
 * iOS chỉ cho phát âm thanh khi lệnh phát nằm trong user gesture, nên
 * music.send("play") được gọi từ đúng handler của nút "Mở thiệp mời".
 */
export const music = {
  get playing() {
    return playing;
  },

  register(el: HTMLAudioElement | null) {
    node = el;
  },

  onState(fn: StateListener) {
    stateListeners.add(fn);
    fn(playing);
    return () => {
      stateListeners.delete(fn);
    };
  },

  setPlaying(value: boolean) {
    playing = value;
    emitState();
  },

  /** Kiểm tra file mp3 có tồn tại không, để báo lỗi sớm trong console. */
  probe() {
    if (typeof window === "undefined" || !EVENT.audioSrc) return;
    fetch(EVENT.audioSrc, { method: "HEAD", cache: "no-store" })
      .then((res) => {
        if (!res.ok) {
          console.warn(
            `[nhạc nền] Không tìm thấy ${EVENT.audioSrc} (HTTP ${res.status}). ` +
              `Hãy đặt file mp3 vào public/audio/ — xem README.`
          );
        }
      })
      .catch(() => {});
  },

  /** Gửi lệnh phát. Phải gọi bên trong user gesture thì iOS mới cho phép. */
  send(action: "play" | "pause" | "toggle") {
    const el = node;
    if (!el) return;
    const isOn = !el.paused;
    if (action === "play" || (action === "toggle" && !isOn)) {
      el.play().catch(() => {});
      return;
    }
    el.pause();
  },
};