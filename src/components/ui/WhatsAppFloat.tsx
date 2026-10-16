import { useEffect, useRef } from "react";
import { messages, whatsapp } from "../../data/site";

export function WhatsAppFloat() {
  const link = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let frame = 0;
    const reposition = () => {
      const button = link.current;
      if (!button) return;
      button.style.bottom = "max(20px, env(safe-area-inset-bottom))";
      const bounds = button.getBoundingClientRect();
      // Use individual text lines so the button can stay in nearby whitespace.
      const obstacles = [
        ...document.querySelectorAll(
          "main p, footer p, main h1, main h2, main h3, main li, a, button",
        ),
      ]
        .filter(
          (element) =>
            element !== button && element.getBoundingClientRect().height > 0,
        )
        .flatMap((element) => {
          if (element.matches("a, button"))
            return [element.getBoundingClientRect()];
          const range = document.createRange();
          range.selectNodeContents(element);
          return [...range.getClientRects()];
        });
      let offset = 0;
      const limit = Math.max(0, bounds.top - 16);
      for (; offset < limit; offset += 8) {
        const top = bounds.top - offset;
        const bottom = bounds.bottom - offset;
        if (
          !obstacles.some(
            (rect) =>
              rect.right > bounds.left - 8 &&
              rect.left < bounds.right + 8 &&
              rect.bottom > top - 8 &&
              rect.top < bottom + 8,
          )
        )
          break;
      }
      button.style.bottom = `calc(max(20px, env(safe-area-inset-bottom)) + ${Math.min(offset, limit)}px)`;
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(reposition);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-expanded", "hidden"],
    });
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.body);
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
  }, []);

  return (
    <a
      ref={link}
      href={whatsapp(messages.floating)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Agendar consulta pelo WhatsApp"
      className="fixed z-40 flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-forest text-white shadow-lg transition-colors hover:bg-[#14251c] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-clay"
      style={{
        right: "max(20px, env(safe-area-inset-right))",
        bottom: "max(20px, env(safe-area-inset-bottom))",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width="30"
        height="30"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.52 3.48A11.91 11.91 0 0 0 12.04 0C5.46 0 .1 5.35.1 11.93c0 2.1.55 4.15 1.6 5.96L0 24l6.26-1.64a11.9 11.9 0 0 0 5.77 1.47h.01c6.58 0 11.94-5.35 11.94-11.93a11.86 11.86 0 0 0-3.46-8.42ZM12.04 21.8a9.9 9.9 0 0 1-5.03-1.38l-.36-.21-3.72.97.99-3.62-.24-.37a9.85 9.85 0 0 1-1.51-5.26c0-5.47 4.45-9.92 9.92-9.92a9.86 9.86 0 0 1 7.01 2.91 9.84 9.84 0 0 1 2.9 7.02c0 5.46-4.45 9.91-9.96 9.86Zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.22 1.36.19 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
      </svg>
    </a>
  );
}
