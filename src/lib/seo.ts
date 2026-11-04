import { ORIGIN } from "./commerce";
export function seo(
  title: string,
  description: string,
  path: string,
  image = `${ORIGIN}/images/v2/hero-desktop.webp`,
) {
  return {
    meta: [
      { title: `${title} | Iyá Marlene` },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: ORIGIN + path },
      { property: "og:image", content: image },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: ORIGIN + path }],
  };
}
