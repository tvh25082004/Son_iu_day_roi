"use client";

import { EVENT } from "./config";

export type MusicCommand = "play" | "pause" | "toggle";

type StateListener = (playing: boolean) => void;
type CommandListener = (cmd: MusicCommand) => void;

let node: HTMLAudioElement | null = null;
let fileWorks = Boolean(EVENT.audioSrc);
let playing = false;

const commandListeners = new Set<CommandListener>();
const stateListeners = new Set<StateListener>();

function emitState() {
  stateListeners.forEach((fn) => fn(playing));
}

/**
 * Bus điều khiển nhạc nền.
 *
 * iOS chỉ cho phát âm thanh khi phát lệnh nằm trong user gesture (tức là ngay
 * trong sự kiện click của nút "Mở thiệp mời"). Nếu gọi play() trong useEffect
 * sau đó thì iOS sẽ bỏ qua và nhạc không bao giờ lên. Vì vậy lệnh phát được
 * gửi từ đúng handler của nút, rồi bus này định tuyến tới đúng player.
 */
export const music = {
  get playing() {
    return playing;
  },

  /** File mp3 trong public/audio có dùng được không. */
  get fileAvailable() {
    return fileWorks;
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

  onCommand(fn: CommandListener) {
    commandListeners.add(fn);
    return () => {
      commandListeners.delete(fn);
    };
  },

  setPlaying(value: boolean) {
    playing = value;
    emitState();
  },

  markFileMissing() {
    fileWorks = false;
    emitState();
  },

  /**
   * Kiểm tra file mp3 ngay khi app mở, trước lúc người dùng bấm gì, để biết
   * sẽ dùng nguồn nào. Nếu không kiểm tra trước, lúc bấm nút phát thử file
   * rồi mới chuyển sang YouTube thì lệnh phát đã nằm ngoài gesture → iOS chặn.
   */
  probe() {
    if (typeof window === "undefined") return;
    if (!EVENT.audioSrc) {
      fileWorks = false;
      emitState();
      return;
    }
    fetch(EVENT.audioSrc, { method: "HEAD", cache: "no-store" })
      .then((res) => {
        if (!res.ok) fileWorks = false;
      })
      .catch(() => {
        fileWorks = false;
      })
      .finally(emitState);
  },

  /** Gửi lệnh phát. Phải gọi bên trong user gesture. */
  send(cmd: MusicCommand) {
    if (fileWorks && node) {
      const isOn = !node.paused;
      if (cmd === "play" || (cmd === "toggle" && !isOn)) {
        node.play().catch(() => {});
        return;
      }
      node.pause();
      return;
    }
    commandListeners.forEach((fn) => fn(cmd));
  },
};