/** Ảnh "images daily" — những ngày bình thường của Bé Son. */
export type DailyPhoto = {
  src: string;
  alt: string;
};

/**
 * Tên file sau khi tối ưu, sinh từ thư mục images-daily/ theo thứ tự alphabet.
 * Giữ đúng tên này để carousel luôn khớp với file thật trong public/.
 */
const FILES = [
  "daily-01", "daily-02", "daily-03", "daily-05", "daily-06",
  "daily-07", "daily-08", "daily-09", "daily-10", "daily-11", "daily-12",
  "daily-13", "daily-14", "daily-15", "daily-16", "daily-17", "daily-18",
  "daily-19", "daily-20", "daily-21", "daily-22", "daily-23", "daily-24",
  "daily-25", "daily-26", "daily-27", "daily-28", "daily-29", "daily-30",
  "daily-31", "daily-32", "daily-33",
];

export const DAILY: DailyPhoto[] = FILES.map((name, i) => ({
  src: `/images-daily/${name}.jpg`,
  alt: `Bé Son — khoảnh khắc mỗi ngày ${i + 1}`,
}));