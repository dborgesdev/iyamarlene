import { ArrowRight, MessageCircle } from "lucide-react";
import { whatsapp } from "../../data/site";

type Props = {
  message: string;
  children: React.ReactNode;
  light?: boolean;
  outline?: boolean;
  className?: string;
};
export function WhatsAppLink({
  message,
  children,
  light = false,
  outline = false,
  className = "",
}: Props) {
  return (
    <a
      href={whatsapp(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-full border px-6 py-3 text-[15px] font-semibold transition-colors ${outline ? "border-sand/65 bg-transparent text-sand hover:bg-white/10" : light ? "border-sand bg-sand text-forest hover:bg-white" : "border-forest bg-forest text-white hover:border-[#14251c] hover:bg-[#14251c]"} ${className}`}
    >
      <MessageCircle size={19} strokeWidth={1.6} aria-hidden="true" />
      {children}
      <ArrowRight size={16} aria-hidden="true" />
    </a>
  );
}
