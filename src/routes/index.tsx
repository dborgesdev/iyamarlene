import { createFileRoute } from "@tanstack/react-router";
import App from "../App";
import { seo } from "../lib/seo";
export const Route = createFileRoute("/")({
  head: () => ({
    ...seo(
      "Orientação e cuidados espirituais",
      "Conheça os atendimentos com cartas e búzios, trabalhos espirituais e produtos de Iyá Marlene. Entre em contato para saber mais e agendar.",
      "/",
    ),
    links: [
      ...seo("", "", "/").links,
      {
        rel: "preload",
        as: "image",
        href: "/images/v2/hero-mobile.webp",
        media: "(max-width: 767px)",
      },
      {
        rel: "preload",
        as: "image",
        href: "/images/v2/hero-desktop.webp",
        media: "(min-width: 768px)",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Iyá Marlene",
          url: "https://iyamarlene.com.br/",
          inLanguage: "pt-BR",
        }),
      },
    ],
  }),
  component: App,
});
