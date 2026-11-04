"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let observer: IntersectionObserver | undefined;
    let callbackFallback: ReturnType<typeof setTimeout> | undefined;
    let hardFallback: ReturnType<typeof setTimeout> | undefined;
    let animationFrame: number | undefined;

    const show = () => {
      element.classList.remove("is-reveal-pending");
      element.classList.add("is-visible");
      observer?.disconnect();
      if (callbackFallback) clearTimeout(callbackFallback);
      if (hardFallback) clearTimeout(hardFallback);
    };

    try {
      const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion || !("IntersectionObserver" in window)) {
        show();
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (callbackFallback) clearTimeout(callbackFallback);
          if (entry?.isIntersecting || (entry?.intersectionRatio ?? 0) > 0) show();
        },
        { rootMargin: "0px 0px -5% 0px", threshold: 0.01 },
      );

      const bounds = element.getBoundingClientRect();
      const isInViewport = bounds.bottom > 0 && bounds.top < window.innerHeight;

      element.classList.remove("is-visible");
      element.classList.add("is-reveal-pending");

      if (isInViewport) {
        animationFrame = window.requestAnimationFrame(show);
      } else {
        observer.observe(element);
      }

      callbackFallback = setTimeout(show, 900);
      hardFallback = setTimeout(show, 6000);
    } catch {
      show();
    }

    return () => {
      observer?.disconnect();
      if (callbackFallback) clearTimeout(callbackFallback);
      if (hardFallback) clearTimeout(hardFallback);
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}
