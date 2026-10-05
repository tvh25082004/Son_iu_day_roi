export const EVENT = {
  babyName: "Lê Nguyễn Khánh Đăng",
  nickName: "Son",
  year: "2026",
  displayDate: "11 • 10 • 2026",
  eventISO: "2026-10-11T18:00:00+07:00",
  timeLabel: "18:00",
  venue: "Đại Việt Palace",
  venueDetail: "Tầng 3 — 145 Dương Đình Nghệ",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Đại Việt Palace, 145 Dương Đình Nghệ"),
  // Nhạc nền: đặt file .mp3 vào public/audio/ và khai báo tên file ở đây.
  // Bắt buộc phải là file âm thanh — KHÔNG dùng YouTube, vì khi mở link từ
  // Zalo/Messenger (WKWebView) YouTube sẽ tự mở video toàn màn hình.
  audioSrc: "/audio/son-birthday.mp3",
} as const;
