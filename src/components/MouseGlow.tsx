import { useEffect, useRef } from "react";

export default function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const cursor = useRef({ x: -1000, y: -1000 });
  const raf = useRef(0);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      cursor.current.x += (mouse.current.x - cursor.current.x) * 0.06;
      cursor.current.y += (mouse.current.y - cursor.current.y) * 0.06;
      if (glowRef.current) {
        const { x, y } = cursor.current;
        glowRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, color-mix(in srgb, var(--accent) 5%, transparent), transparent 50%)`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouse);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed inset-0 z-30"
      aria-hidden
    />
  );
}
