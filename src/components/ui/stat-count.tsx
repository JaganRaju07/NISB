"use client";

import { useEffect, useRef, useState } from "react";

export function StatCount({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(node);
      const start = performance.now();
      const duration = 700;
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        setShown(Math.round(value * progress));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref} className="tabular-nums">{shown.toLocaleString()}<span>{suffix}</span></span>;
}
