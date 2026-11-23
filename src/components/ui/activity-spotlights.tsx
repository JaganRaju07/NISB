"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

export function ActivityTile({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef<number | null>(null);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    const node = ref.current;
    frame.current = requestAnimationFrame(() => {
      if (!node) return;
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      node.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    });
  };

  return <article ref={ref} onPointerMove={handlePointerMove} className={`activity-card ${className}`}>{children}</article>;
}
