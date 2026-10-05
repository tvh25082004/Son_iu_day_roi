"use client";

import { EVENT } from "./config";

type StateListener = (playing: boolean) => void;

let node: HTMLAudioElement | null = null;
let playing = false;
/** Các file tồn tại thật trên server, theo thứ tự ưu tiên. */
let available: string[] = [];
/** Vị trí đang thử trong `available`. */
let cursor = -1;
/** Người dùng đã chạm màn hình → nhạc phải chạy, kể cả khi file vừa tìm thấy. */
let wantPlaying = false;

const stateListeners = new Set<StateListener>();

function emitState() {
  stateListeners.forEach((fn) => fn(playing));
}

/**
 * Mọi định dạng có thể đặt vào public/audio/. Không cần sửa code — chỉ cần bỏ
 * file vào thư mục với đúng tên, trang sẽ tự tìm và tự thử từng file cho tới khi
 * có file phát được tiếng. Bỏ nhiều file cùng lúc càng tốt (mp3 + m4a).
 */
export const AUDIO_CANDIDATES: string[] = EVENT.audioSrc
  ? [
      EVENT.audioSrc,
      "/audio/son-birthday.m4a",
      "/audio/son-birthday.mp4",
      "/audio/son-birthday.aac",
      "/audio/son-birthday.ogg",
      "/audio/son-birthday.wav",
    ]
  : [];

/** Kiểm tra những file nào thực sự tồn tại trên server. */
async function probeAll(): Promise<string[]> {
  const found: string[] = [];
  await Promise.all(
    AUDIO_CANDIDATES.map(async (src) => {
      try {
        const res = await fetch(src, { method: "HEAD", cache: "no-store" });
        if (res.ok) found.push(src);
      } catch {
        // file không tồn tại — bỏ qua
      }
    })
  );
  // Giữ đúng thứ tự ưu tiên đã khai báo.
  return AUDIO_CANDIDATES.filter((src) => found.includes(src));
}

/**
 * Nạp file tiếp theo trong danh sách và phát nếu người dùng đã chạm màn hình.
 * Trả về false khi đã hết file để thử.
 */
function loadNext(): boolean {
  if (cursor + 1 >= available.length) return false;
  cursor += 1;
  const src = available[cursor];
  const el = node;
  if (el) {
    el.src = src;
    el.load();
    if (wantPlaying) el.play().catch(() => {});
  }
  return true;
}

/**
 * Chuẩn bị nhạc nền: dò các file trong public/audio/ rồi nạp file đầu tiên.
 * Trả về true nếu tìm thấy ít nhất một file.
 */
async function init(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  if (available.length === 0) {
    available = await probeAll();
    if (available.length === 0) {
      console.warn(
        "[nhạc nền] Chưa có file âm thanh nào trong public/audio/. " +
          "Cần file tên bắt đầu bằng `son-birthday` (mp3/m4a/mp4/aac/ogg/wav). " +
          "Xem README."
      );
      return false;
    }
    cursor = -1;
  }

  return loadNext();
}

/**
 * File vừa nạp không phát được (trình duyệt không giải mã được định dạng đó).
 * Thử file tiếp theo; hết danh sách thì báo thiếu file.
 */
function handleError(): Promise<boolean> {
  return init().then((ok) => !ok);
}

/**
 * Điều khiển nhạc nền — chỉ dùng thẻ <audio> với file trong public/audio.
 *
 * KHÔNG dùng iframe YouTube: Zalo/Messenger mở link bằng WKWebView và sẽ tự mở
 * video YouTube toàn màn hình, đồng thời chặn phát âm thanh. Toàn bộ player
 * YouTube đã bị gỡ khỏi dự án.
 *
 * iOS chỉ cho phát âm thanh khi lệnh phát nằm trong user gesture, nên
 * music.send("play") phải được gọi từ handler của một sự kiện chạm thật.
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

  init,
  handleError,

  /**
   * Gửi lệnh phát. Phải gọi bên trong user gesture thì iOS mới cho phép.
   *
   * Lệnh không bao giờ bị bỏ qua: đánh dấu "muốn phát" trước, nạp file nếu chưa có,
   * rồi mới phát — để lần chạm đầu tiên không bị mất vì file chưa tải kịp.
   */
  send(action: "play" | "pause" | "toggle") {
    const el = node;
    const isOn = el ? !el.paused : false;

    if (action === "play" || (action === "toggle" && !isOn)) {
      wantPlaying = true;
      if (!el) {
        init();
        return;
      }
      if (!el.getAttribute("src")) {
        init();
        return;
      }
      el.play().catch(() => {});
      return;
    }

    wantPlaying = false;
    el?.pause();
  },
};