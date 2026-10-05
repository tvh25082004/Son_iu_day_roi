# Son iu day roi 🎂

Trang web thiệp mời sinh nhật 1 tuổi cho **Lê Nguyễn Khánh Đăng** (Son).
Next.js 15 (App Router) + Tailwind CSS v4 + Motion.

## Chạy local

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve production build
```

## Deploy lên Vercel

Next.js nằm ở **repo root** nên Vercel tự detect được framework — **không được** đổi
Root Directory.

- Project Settings → Build & Development Settings → **Root Directory: `/`** (mặc định)
- Framework Preset: **Next.js**
- Build Command: `npm run build` · Output: mặc định

> Lỗi `404 NOT_FOUND` xuất hiện khi app nằm trong thư mục con (ví dụ `son-first-birthday/`)
> mà Root Directory lại để trống. Repo này đã chuyển app lên root để tránh lỗi đó.

## Cấu trúc

```
app/            layout, page, globals.css, icon
components/     Cover, EnvelopeOpening, FloatingParticles, MusicControl, Reveal
components/sections/  Hero, Countdown, EventDetails, PhotoStory, FinalMessage
lib/            config (tên bé, ngày giờ, địa điểm, YouTube id), photos, animations
public/images/  ảnh đã tối ưu (son-01 … son-08), og.jpg
original-photos/ảnh gốc chưa nén
```

## Nhạc nền

Nhạc phát bằng thẻ `<audio>` HTML5 — trên điện thoại **chỉ có tiếng, không mở video YouTube**.

**Bắt buộc:** đặt file âm thanh vào `public/audio/son-birthday.mp3` (repo có sẵn thư mục
`public/audio/`). Trong `lib/config.ts`:

```ts
audioSrc: "/audio/son-birthday.mp3",
```

Cách lấy nhạc (chạy ở nơi YouTube không chặn mạng):

```bash
yt-dlp -f 140 -x --audio-format mp3 \
  -o "public/audio/son-birthday.%(ext)s" \
  "https://www.youtube.com/watch?v=8Fid-rNWeho"
```

Hoặc tải audio trên điện thoại rồi chép file thành `public/audio/son-birthday.mp3`.

Nếu thiếu file, site vẫn chạy và fallback sang iframe YouTube kích thước **1×1**
(bắt buộc phải 1×1, nếu không YouTube tạo iframe 640×390 và điện thoại sẽ mở app
YouTube). Xem `components/MusicControl.tsx` và `lib/music.ts`.

> iOS chỉ cho phát nhạc khi lệnh phát nằm trong user gesture, nên `lib/music.ts`
> được gọi từ đúng handler của nút "Mở thiệp mời". Không chuyển sang `useEffect`
> hoặc `setTimeout` — iOS sẽ bỏ qua và nhạc không lên.

## Sửa nội dung

Thay đổi thông tin sự kiện trong `lib/config.ts` (tên bé, ngày giờ, địa điểm, bài nhạc).
Danh sách ảnh trong `lib/photos.ts`. Màu và typography trong `app/globals.css`.