"use client";

import { useEffect, useRef } from "react";

/**
 * Adds `motion-ready` to <body> on mount, then observes all `[data-reveal]`
 * elements and adds `.revealed` when they enter the viewport.
 * Renders nothing — mount once in the layout or on pages that need scroll animations.
 */
export default function Reveal() {
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    document.body.classList.add("motion-ready");

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;          // respect user preference

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            io.unobserve(e.target);   // once is enough
          }
        }
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.15 },
    );

    const observe = () => {
      document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    };
    observe();

    // Re-observe after dynamic content (e.g. country cards) renders
    const mo = new MutationObserver(() => observe());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  return null;
}
