const DUST = [
  { left: "7%", delay: 0, dur: 15, size: 4 },
  { left: "16%", delay: 4, dur: 18, size: 3 },
  { left: "27%", delay: 8, dur: 14, size: 5 },
  { left: "38%", delay: 2, dur: 20, size: 3 },
  { left: "49%", delay: 10, dur: 16, size: 4 },
  { left: "58%", delay: 6, dur: 19, size: 3 },
  { left: "67%", delay: 1, dur: 17, size: 5 },
  { left: "74%", delay: 12, dur: 15, size: 3 },
  { left: "83%", delay: 5, dur: 21, size: 4 },
  { left: "91%", delay: 9, dur: 16, size: 3 },
  { left: "12%", delay: 14, dur: 18, size: 3 },
  { left: "45%", delay: 18, dur: 14, size: 4 },
  { left: "70%", delay: 21, dur: 20, size: 3 },
  { left: "95%", delay: 16, dur: 19, size: 5 },
];

export default function FloatingParticles() {
  return (
    <div className="particles" aria-hidden>
      {DUST.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  );
}
