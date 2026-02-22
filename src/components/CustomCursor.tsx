import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const isHovering = useRef(false);

  useEffect(() => {
    // Only activate on pointer (mouse) devices
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const onEnter = () => { isHovering.current = true; };
    const onLeave = () => { isHovering.current = false; };

    const bindInteractables = () => {
      document
        .querySelectorAll("a, button, input, textarea, [role='button']")
        .forEach((el) => {
          el.addEventListener("mouseenter", onEnter);
          el.addEventListener("mouseleave", onLeave);
        });
    };

    bindInteractables();
    // Re-bind after any dynamic content mounts
    const observer = new MutationObserver(bindInteractables);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("mousemove", onMove, { passive: true });

    const animate = () => {
      // Lerp ring toward cursor
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.left = `${mouse.current.x}px`;
        dotRef.current.style.top = `${mouse.current.y}px`;
        dotRef.current.style.opacity = isHovering.current ? "0" : "1";
      }

      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
        ringRef.current.style.transform = isHovering.current
          ? "translate(-50%, -50%) scale(1.8)"
          : "translate(-50%, -50%) scale(1)";
        ringRef.current.style.borderColor = isHovering.current
          ? "rgba(255,255,255,0.7)"
          : "rgba(255,255,255,0.4)";
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Dot — snaps instantly to cursor */}
      <div
        ref={dotRef}
        className="hidden lg:block fixed pointer-events-none z-[9999] w-1.5 h-1.5 rounded-full bg-foreground"
        style={{
          transform: "translate(-50%, -50%)",
          transition: "opacity 0.15s ease",
        }}
      />
      {/* Ring — lags behind with lerp */}
      <div
        ref={ringRef}
        className="hidden lg:block fixed pointer-events-none z-[9998] w-9 h-9 rounded-full border"
        style={{
          transform: "translate(-50%, -50%)",
          transition: "transform 0.25s ease-out, border-color 0.2s ease",
          borderColor: "rgba(255,255,255,0.4)",
        }}
      />
    </>
  );
}
