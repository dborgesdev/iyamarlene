import { ArrowRight, MessageCircle } from "lucide-react";
import { whatsapp } from "../../data/site";

type Props = {
  message: string;
  children: React.ReactNode;
  light?: boolean;
  outline?: boolean;
  emphasis?: "bright" | "aged";
  className?: string;
};
export function WhatsAppLink({
  message,
  children,
  light = false,
  outline = false,
  emphasis,
  className = "",
}: Props) {
  const colors = outline
    ? "border-accent-light bg-transparent text-sand hover:bg-white/10"
    : light
      ? "border-sand bg-sand text-primary hover:bg-surface-light"
      : emphasis === "bright"
        ? "cta-bright"
        : emphasis === "aged"
          ? "cta-aged"
          : "border-primary bg-primary text-sand hover:border-primary-hover hover:bg-primary-hover";

  return (
    <a
      href={whatsapp(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-full border px-6 py-3 text-[15px] font-semibold transition-colors ${colors} ${className}`}
    >
      <MessageCircle size={19} strokeWidth={1.6} aria-hidden="true" />
      {children}
      <ArrowRight size={16} aria-hidden="true" />
    </a>
  );
}
