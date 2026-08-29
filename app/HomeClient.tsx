"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/** Ported from the legacy index.html Component.setupRain(). */
function RainCanvas() {
  const rainRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = rainRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const intensity = 0.7;
    let W = 0;
    let H = 0;
    let drops: { x: number; y: number; len: number; sp: number; drift: number; a: number }[] = [];
    let raf = 0;
    let dead = false;

    const onResize = () => {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
      const n = Math.floor(110 * intensity + 30);
      drops = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        len: 10 + Math.random() * 20,
        sp: 7 + Math.random() * 10,
        drift: -0.6 - Math.random() * 0.9,
        a: 0.14 + Math.random() * 0.3,
      }));
    };
    onResize();
    window.addEventListener("resize", onResize);

    const tick = () => {
      if (dead) return;
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1.2;
      for (const d of drops) {
        ctx.strokeStyle = "rgba(165,195,225," + d.a + ")";
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.drift * 2, d.y + d.len);
        ctx.stroke();
        d.y += d.sp;
        d.x += d.drift;
        if (d.y > H) {
          d.y = -d.len;
          d.x = Math.random() * W;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={rainRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 3,
        opacity: 0.85,
      }}
    />
  );
}

/** Ported from the legacy index.html Component.bindPointer(). */
function CursorFollow({ splitTop }: { splitTop: () => number | null }) {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      const x = e.clientX;
      const y = e.clientY;
      const target = e.target as HTMLElement | null;
      const hot = !!target?.closest?.("[data-hot]");
      const centerZone = !!target?.closest?.("[data-cz]");

      if (dot) {
        dot.style.opacity = "1";
        dot.style.transform = `translate3d(${x}px,${y}px,0)`;
      }
      if (ring) {
        ring.style.opacity = "1";
        ring.style.transform = `translate3d(${x}px,${y}px,0) scale(${hot ? 1.7 : 1})`;
      }

      const top = splitTop();
      const overSplit = top !== null && y >= top;
      let mode: "warm" | "cold" | "grey";
      if (centerZone) mode = "grey";
      else if (overSplit) mode = x < window.innerWidth / 2 ? "warm" : "cold";
      else mode = x < window.innerWidth / 2 ? "warm" : "cold";

      const c = mode === "warm" ? "#ffb347" : mode === "cold" ? "#9fd7ff" : "#c9ced2";
      const gl =
        mode === "warm"
          ? "rgba(255,179,71,.7)"
          : mode === "cold"
            ? "rgba(159,215,255,.7)"
            : "rgba(200,206,210,.6)";
      if (dot) {
        dot.style.background = c;
        dot.style.boxShadow = `0 0 12px 2px ${gl}`;
      }
      if (ring) ring.style.borderColor = c;
    };

    window.addEventListener("mousemove", onMove);
    document.body.style.cursor = "none";
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.body.style.cursor = "";
    };
  }, [splitTop]);

  return (
    <>
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 34,
          height: 34,
          margin: "-17px 0 0 -17px",
          border: "1.5px solid #19d3c5",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 90,
          transition: "border-color .3s ease, opacity .3s ease",
          opacity: 0,
        }}
      />
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 7,
          height: 7,
          margin: "-3.5px 0 0 -3.5px",
          background: "#19d3c5",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 91,
          boxShadow: "0 0 12px 2px rgba(25,211,197,.7)",
          transition: "background .3s ease, box-shadow .3s ease, opacity .3s ease",
          opacity: 0,
        }}
      />
    </>
  );
}

function ThresholdSigil() {
  return (
    <svg
      viewBox="0 0 120 170"
      width="140"
      height="198"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="60" y1="70" x2="60" y2="158" stroke="#cfd3d6" strokeWidth="6" />
      <g style={{ animation: "electricFlickerB 3.4s linear infinite" }}>
        <path d="M60 6 L60 56" stroke="#c7cdd1" strokeWidth="8" />
        <path d="M60 2 L50 22 L70 22 Z" fill="#c7cdd1" stroke="none" />
      </g>
      <g style={{ animation: "electricFlickerA 2.6s linear infinite" }}>
        <path d="M27 16 Q18 48 54 64" stroke="#ffd23f" strokeWidth="9" fill="none" />
        <path d="M22 8 L18 30 L36 18 Z" fill="#ffd23f" stroke="none" />
        <g style={{ animation: "rayPulse 1.8s ease-in-out infinite" }}>
          <line x1="14" y1="14" x2="2" y2="10" stroke="#ffd23f" strokeWidth="2.4" />
          <line x1="12" y1="24" x2="0" y2="24" stroke="#ffd23f" strokeWidth="2.4" />
          <line x1="14" y1="34" x2="3" y2="40" stroke="#ffd23f" strokeWidth="2.4" />
        </g>
      </g>
      <g style={{ animation: "electricFlickerC 3.1s linear infinite" }}>
        <path d="M93 16 Q102 48 66 64" stroke="#5fc3ff" strokeWidth="9" fill="none" />
        <path d="M98 8 L102 30 L84 18 Z" fill="#5fc3ff" stroke="none" />
        <ellipse cx="99" cy="30" rx="2.6" ry="4" fill="#5fc3ff" stroke="none" style={{ animation: "dripFall 2.2s ease-in infinite" }} />
        <ellipse cx="90" cy="48" rx="2.2" ry="3.4" fill="#5fc3ff" stroke="none" style={{ animation: "dripFall 2.2s ease-in .9s infinite" }} />
      </g>
      <ellipse cx="60" cy="102" rx="21" ry="12" stroke="#e8e6df" strokeWidth="3.5" />
      <path d="M39 102 Q34 92 27 90 M34 96 Q28 92 22 94" stroke="#e8e6df" strokeWidth="2" />
      <path d="M81 102 Q86 92 93 90 M86 96 Q92 92 98 94" stroke="#e8e6df" strokeWidth="2" />
      <path d="M42 92 Q40 84 34 80 M46 89 Q45 82 41 76" stroke="#e8e6df" strokeWidth="1.6" />
      <path d="M78 92 Q80 84 86 80 M74 89 Q75 82 79 76" stroke="#e8e6df" strokeWidth="1.6" />
      <g style={{ transformOrigin: "60px 102px", animation: "eyeBlink 3.2s ease-in-out infinite" }}>
        <circle cx="60" cy="102" r="5.4" fill="#ffb347" stroke="none" />
      </g>
    </svg>
  );
}

/** Ported from the legacy index.html Component.typeTitle()/showMythicLine(). */
function TypedTitle() {
  const [title, setTitle] = useState("");
  const [mythicVisible, setMythicVisible] = useState(false);

  useEffect(() => {
    const full = "AKSHAASTRA";
    let i = 0;
    let dead = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const after = (ms: number, fn: () => void) => {
      const t = setTimeout(() => {
        if (!dead) fn();
      }, ms);
      timers.push(t);
    };

    const step = () => {
      if (dead) return;
      i++;
      setTitle(full.slice(0, i));
      if (i < full.length) after(65 + Math.random() * 45, step);
      else after(500, () => setMythicVisible(true));
    };
    after(500, step);

    return () => {
      dead = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <>
      <h1
        style={{
          fontFamily: "var(--font-alfa-slab), serif",
          fontSize: "clamp(30px,4.8vw,58px)",
          letterSpacing: ".04em",
          color: "#e8e6df",
          textShadow: "3px 3px 0 #000, 0 0 34px rgba(25,211,197,.25)",
          minHeight: "1.1em",
        }}
      >
        {title}
      </h1>
      <div style={{ minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span
          style={{
            fontFamily: "var(--font-alfa-slab), serif",
            fontSize: "clamp(20px,2.6vw,30px)",
            letterSpacing: ".1em",
            color: "#e8e6df",
            textShadow: "0 0 30px rgba(25,211,197,.6)",
            display: "inline-block",
            opacity: mythicVisible ? 1 : 0,
            transform: mythicVisible ? "scale(1)" : "scale(2.4)",
            transition: "opacity .35s cubic-bezier(.2,1,.3,1), transform .5s cubic-bezier(.17,.9,.3,1.4)",
          }}
        >
          Weapon-Eyes
        </span>
      </div>
    </>
  );
}

/** Warm-side falling light rays, ported from the legacy rayDrip layer. Visible while leaning warm. */
function RayDrip({ visible }: { visible: boolean }) {
  const rays = [
    { left: "8%", h: "46vh", w: 12, dur: "2.6s", delay: "0s" },
    { left: "24%", h: "38vh", w: 7, dur: "3.4s", delay: ".7s" },
    { left: "41%", h: "52vh", w: 15, dur: "2.2s", delay: "1.2s" },
    { left: "58%", h: "42vh", w: 9, dur: "3s", delay: ".3s" },
    { left: "74%", h: "48vh", w: 12, dur: "2.8s", delay: "1.7s" },
    { left: "89%", h: "34vh", w: 6, dur: "3.8s", delay: "1s" },
  ];
  return (
    <div
      className="pointer-events-none absolute inset-y-0 left-0 z-[3] overflow-hidden"
      style={{ width: "50%", opacity: visible ? 1 : 0, transition: "opacity .7s ease" }}
    >
      {rays.map((r, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: r.left,
            width: r.w,
            height: r.h,
            background:
              "linear-gradient(180deg,rgba(255,210,120,0),rgba(255,190,90,.75) 30%,rgba(255,120,50,.4) 75%,transparent)",
            filter: "blur(1px)",
            animation: `rayDrip ${r.dur} linear ${r.delay} infinite`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "10vh",
          background: "linear-gradient(180deg,rgba(255,190,90,.35),transparent)",
        }}
      />
    </div>
  );
}

/** Cold-side growing icicles + drips, ported from the legacy iceGrow/iceDropFall layer. Visible while leaning cold. */
function IceDrip({ visible }: { visible: boolean }) {
  const spikes = [
    { left: "6%", h: "22vh", w: 20, delay: "0s", dur: "1.6s" },
    { left: "18%", h: "14vh", w: 12, delay: ".3s", dur: "2s" },
    { left: "31%", h: "30vh", w: 26, delay: ".15s", dur: "1.8s" },
    { left: "47%", h: "18vh", w: 14, delay: ".5s", dur: "2.2s" },
    { left: "61%", h: "26vh", w: 22, delay: ".25s", dur: "1.7s" },
    { left: "78%", h: "20vh", w: 16, delay: ".4s", dur: "2.1s" },
  ];
  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 z-[3] overflow-hidden"
      style={{ width: "50%", opacity: visible ? 1 : 0, transition: "opacity .7s ease" }}
    >
      {spikes.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: s.left,
            width: s.w,
            height: s.h,
            transformOrigin: "top",
            background:
              "linear-gradient(180deg,rgba(225,242,255,.95),rgba(159,215,255,.6) 55%,rgba(107,184,232,.2))",
            clipPath: "polygon(0 0,100% 0,50% 100%)",
            animation: `iceGrow ${s.dur} ease-out ${s.delay} both`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: "29vh",
          left: "32.5%",
          width: 5,
          height: 9,
          borderRadius: "50%",
          background: "rgba(200,232,255,.9)",
          animation: "iceDropFall 2.4s ease-in .8s infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "25vh",
          left: "62%",
          width: 4,
          height: 8,
          borderRadius: "50%",
          background: "rgba(200,232,255,.85)",
          animation: "iceDropFall 3s ease-in 1.6s infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "8vh",
          background: "linear-gradient(180deg,rgba(159,215,255,.3),transparent)",
        }}
      />
    </div>
  );
}

export default function HomeClient() {
  const splitRef = useRef<HTMLElement | null>(null);
  const [lean, setLean] = useState<"warm" | "cold" | null>(null);

  // Ported from Component.setupLinger(): after lingering 4s on the split
  // screen without choosing a side, the Vaitarandor door replaces the
  // "third way" teaser text.
  const [vaitVisible, setVaitVisible] = useState(false);
  const [doorHover, setDoorHover] = useState(false);

  useEffect(() => {
    const el = splitRef.current;
    if (!el) return;
    let lingerTimer: ReturnType<typeof setTimeout> | null = null;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            lingerTimer = setTimeout(() => setVaitVisible(true), 4000);
          } else if (lingerTimer) {
            clearTimeout(lingerTimer);
          }
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (lingerTimer) clearTimeout(lingerTimer);
    };
  }, []);

  const warmWidth = lean === "warm" ? "67%" : lean === "cold" ? "33%" : "50%";

  return (
    <main style={{ background: "#07070c", color: "#e8e6df" }}>
      <RainCanvas />
      <CursorFollow
        splitTop={() => (splitRef.current ? splitRef.current.getBoundingClientRect().top : null)}
      />

      {/* Screen 1 — The Threshold */}
      <section className="relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden px-6 text-center">
        <div
          className="pointer-events-none absolute z-[2]"
          style={{
            top: "-8%",
            left: "-12%",
            width: "75%",
            height: "80%",
            background: "radial-gradient(ellipse at center, rgba(58,64,145,.5), transparent 62%)",
            filter: "blur(26px)",
            animation: "mistDrift 22s ease-in-out infinite",
          }}
        />
        <div
          className="pointer-events-none absolute z-[2]"
          style={{
            bottom: "-12%",
            right: "-10%",
            width: "70%",
            height: "75%",
            background: "radial-gradient(ellipse at center, rgba(200,90,50,.28), transparent 62%)",
            filter: "blur(30px)",
            animation: "mistDrift2 27s ease-in-out infinite",
          }}
        />

        <div className="relative z-[5] flex flex-col items-center gap-8">
          <div data-hot="true" style={{ transition: "transform .5s cubic-bezier(.2,1.4,.4,1)" }}>
            <ThresholdSigil />
          </div>

          <TypedTitle />

          <p
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: ".32em",
              color: "rgba(232,230,223,.85)",
              textTransform: "uppercase",
            }}
          >
            which eyes will you wear?
          </p>

          {/* Decision 6: the old subtle "▾ COME CLOSER ▾" text-cue is replaced
              with a real, bordered, filled button matching the visual weight
              of the split-screen CTAs (STEP THROUGH / ENTER THE STILLNESS /
              CROSS THE VAITARANI). Same behavior: jumps to the split section. */}
          <a
            href="#the-split"
            data-hot="true"
            className="cta-button"
            style={{
              marginTop: 22,
              fontSize: 16,
              color: "#12100a",
              background: "#19d3c5",
              padding: "20px 46px",
              boxShadow: "5px 5px 0 #000, 0 0 28px rgba(25,211,197,.45)",
            }}
          >
            ▾ COME CLOSER ▾
          </a>
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[6]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(0,0,0,.5) 1px, transparent 1.5px)",
            backgroundSize: "5px 5px",
            opacity: 0.5,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-[7]"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(2,2,6,.85) 100%)",
          }}
        />
      </section>

      {/* Screen 2 — The Split */}
      <section
        id="the-split"
        ref={splitRef}
        className="relative grid min-h-screen grid-cols-1 overflow-hidden md:grid-cols-2"
        style={{
          background: "linear-gradient(200deg,#0b0e26 0%,#0a0a14 55%,#101433 100%)",
        }}
      >
        {/* Ported from Component.renderVals() warmWidth: the warm-tinted
            layer slides wider/narrower on hover while the text grid below
            stays fixed 50/50 — the "cursor moves side to side" interaction.
            Hidden below `md`: it's a left/right split-screen effect that
            only makes sense once the two worlds sit side by side; on a
            single-column mobile layout it just washes tint across both
            stacked blocks. Each block gets its own static tint instead
            (see the warm/cold block backgrounds below). */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden overflow-hidden md:block"
          style={{
            width: warmWidth,
            background: "linear-gradient(160deg,#1a0d08 0%,#241007 45%,#12100a 100%)",
            transition: "width .9s cubic-bezier(.6,.05,.2,1)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 30% 40%, rgba(255,78,46,.22), transparent 60%),radial-gradient(ellipse at 60% 80%, rgba(255,179,71,.14), transparent 55%)",
            }}
          />
        </div>

        <RayDrip visible={lean === "warm"} />
        <IceDrip visible={lean === "cold"} />

        <div
          onMouseEnter={() => setLean("warm")}
          onMouseLeave={() => setLean(null)}
          data-hot="true"
          className="relative z-[4] flex flex-col items-start justify-center gap-4 bg-[linear-gradient(160deg,#1a0d08_0%,#241007_45%,#12100a_100%)] px-6 py-16 sm:px-10 md:bg-none"
        >
          <div
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: 12,
              letterSpacing: ".5em",
              color: "#ffb347",
            }}
          >
            THE WARM WORLD
          </div>
          <h2
            style={{
              fontFamily: "var(--font-alfa-slab), serif",
              fontSize: "clamp(40px,5.5vw,78px)",
              lineHeight: 0.95,
              color: "#ff4e2e",
              textShadow: "4px 4px 0 #000, 0 0 40px rgba(255,78,46,.3)",
            }}
          >
            RUDRAKSHI
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(232,220,200,.75)", maxWidth: 340 }}>
            Neelavalley keeps its lights on for everyone — the valley-glow, the drums, the coast that remembers.
          </p>
          <Link
            href="/worlds/warm"
            data-hot="true"
            className="cta-button"
            style={{
              marginTop: 8,
              fontSize: 14,
              color: "#12100a",
              background: "#ffb347",
              padding: "16px 34px 16px 40px",
              boxShadow: "5px 5px 0 #000, 0 0 28px rgba(255,78,46,.45)",
            }}
          >
            STEP THROUGH
          </Link>
        </div>

        <div
          onMouseEnter={() => setLean("cold")}
          onMouseLeave={() => setLean(null)}
          data-hot="true"
          className="relative z-[4] flex flex-col items-end justify-center gap-4 bg-[linear-gradient(20deg,#08080f_0%,#0a0a14_45%,#101433_100%)] px-6 py-16 text-right sm:px-10 md:bg-none"
        >
          <div
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: 12,
              letterSpacing: ".5em",
              color: "#9fd7ff",
            }}
          >
            THE COLD WORLD
          </div>
          <h2
            style={{
              fontFamily: "var(--font-alfa-slab), serif",
              fontSize: "clamp(40px,5.5vw,78px)",
              lineHeight: 0.95,
              color: "#9fd7ff",
              textShadow: "4px 4px 0 #000, 0 0 40px rgba(159,215,255,.25)",
            }}
          >
            TAMASA
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(200,214,232,.7)", maxWidth: 340 }}>
            Nothing moves in Sthavantum unless it has been measured first. It prefers you that way.
          </p>
          <Link
            href="/worlds/cold"
            data-hot="true"
            className="cta-button"
            style={{
              marginTop: 8,
              fontSize: 14,
              color: "#07080f",
              background: "#9fd7ff",
              padding: "16px 34px 16px 40px",
              boxShadow: "5px 5px 0 #000, 0 0 28px rgba(159,215,255,.4)",
            }}
          >
            ENTER THE STILLNESS
          </Link>
        </div>

        {/* The center seam only reads correctly once warm/cold sit side by
            side; on the stacked mobile layout it just draws a line through
            whichever block happens to be at the section's vertical middle. */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 left-0 z-[3] hidden md:block"
          style={{
            width: 3,
            marginLeft: "50%",
            background:
              "linear-gradient(180deg,transparent,#19d3c5 20%,#ffb347 50%,#19d3c5 80%,transparent)",
            boxShadow: "0 0 22px 4px rgba(25,211,197,.55)",
            animation: "seamFlicker 4.2s linear infinite",
          }}
        />

        {/* Wraps the "third way" teaser and the Vaitarandor door, which
            crossfade via opacity and must occupy the same spot. Below `md`
            (where warm/cold stack in one column instead of sitting side by
            side) this renders as a normal block *after* both worlds, using
            CSS grid stacking (both children in the same cell) so the
            crossfade doesn't reserve double height. At `md`+ it switches
            back to the original dead-center overlay. */}
        <div className="relative z-[7] my-10 grid place-items-center px-6 text-center md:absolute md:left-1/2 md:top-1/2 md:my-0 md:-translate-x-1/2 md:-translate-y-1/2">
          {/* "There is a third way" teaser — fades out once the door reveals. */}
          <div
            className="pointer-events-none col-start-1 row-start-1 flex flex-col items-center gap-3"
            style={{ opacity: vaitVisible ? 0 : 1, transition: "opacity 1s ease" }}
          >
            <div
              style={{
                width: 1.5,
                height: 46,
                margin: "0 auto",
                background: "linear-gradient(180deg,transparent,rgba(212,216,220,.85),transparent)",
                animation: "seamPulse 2.2s ease-in-out infinite",
              }}
            />
            <div
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: 11,
                letterSpacing: ".5em",
                color: "rgba(212,216,220,.9)",
                animation: "seamPulse 3.4s ease-in-out infinite",
              }}
            >
              THERE IS A THIRD WAY
            </div>
            <div
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: 10,
                letterSpacing: ".35em",
                color: "rgba(200,206,210,.65)",
              }}
            >
              VAITARANDOR · THE CITY BETWEEN
            </div>
          </div>

          {/* The Vaitarandor door — revealed after lingering on this screen. */}
          <div
            data-hot="true"
            data-cz="true"
            onMouseEnter={() => setDoorHover(true)}
            onMouseLeave={() => setDoorHover(false)}
            className="col-start-1 row-start-1 flex flex-col items-center gap-3"
            style={{
              opacity: vaitVisible ? 1 : 0,
              pointerEvents: vaitVisible ? "auto" : "none",
              transition: "opacity 2.2s ease",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: -46,
                left: "50%",
                transform: "translateX(-50%)",
                opacity: doorHover ? 1 : 0,
                transition: "opacity .5s ease",
                animation: "moonFlicker 4s linear infinite",
                pointerEvents: "none",
              }}
            >
              <svg viewBox="0 0 28 28" width="26" height="26" fill="none" stroke="rgba(212,216,220,.9)" strokeWidth="1.5">
                <path d="M20 4 A11 11 0 1 0 24 16 A8.5 8.5 0 0 1 20 4 Z" />
              </svg>
              <div style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: ".2em", color: "rgba(212,216,220,.6)", marginTop: 2 }}>
                SOMAYANA
              </div>
            </div>
            <div
              aria-hidden="true"
              style={{
                width: 72,
                height: 118,
                border: "1.5px solid rgba(200,206,210,.65)",
                background: "linear-gradient(180deg,#191c20,#23262b)",
                position: "relative",
                animation: "doorGlow 3.4s ease-in-out infinite",
                transform: doorHover ? "scale(1.06)" : "scale(1)",
                transition: "transform .4s ease",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: "50%",
                  width: 1,
                  background: "linear-gradient(180deg,transparent,rgba(220,226,230,.8),transparent)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "52%",
                  left: "58%",
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "rgba(220,226,230,.85)",
                }}
              />
            </div>
            <div
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: 12,
                letterSpacing: ".5em",
                color: "rgba(212,216,220,.9)",
              }}
            >
              VAITARANDOR
            </div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: ".3em",
                color: "rgba(200,206,210,.5)",
                textTransform: "uppercase",
              }}
            >
              the city between · it noticed you waiting
            </div>
            <Link
              href="/worlds/border"
              data-hot="true"
              className="cta-button pointer-events-auto"
              style={{
                fontSize: 12,
                color: "#c9ced2",
                background: "rgba(20,22,26,.8)",
                border: "1.5px solid rgba(200,206,210,.5)",
                padding: "11px 22px",
                boxShadow: "none",
              }}
            >
              CROSS THE VAITARANI
            </Link>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[6]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(0,0,0,.4) 1px, transparent 1.5px)",
            backgroundSize: "6px 6px",
            opacity: 0.35,
          }}
        />
      </section>
    </main>
  );
}
