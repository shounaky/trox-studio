"use client";
import { useEffect, useRef } from "react";

export default function CursorEffect() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0, raf;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px)`;
    };

    const onOver = (e) => {
      const el = e.target;
      if (el.closest("button,a,input,textarea,select,.bw-card,.bw-compcard,.bw-tab,.bw-provider,.bw-trend-card")) {
        ring.classList.add("big");
      }
    };
    const onOut = (e) => {
      const el = e.target;
      if (el.closest("button,a,input,textarea,select,.bw-card,.bw-compcard,.bw-tab,.bw-provider,.bw-trend-card")) {
        ring.classList.remove("big");
      }
    };

    const tick = () => {
      const ease = 0.11;
      rx += (mx - rx) * ease;
      ry += (my - ry) * ease;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cur-dot" />
      <div ref={ringRef} className="cur-ring" />
    </>
  );
}
