import { ORIGIN } from "./commerce";
export function seo(
  title: string,
  description: string,
  path: string,
  image = `${ORIGIN}/og-image.jpg`,
) {
  return {
    meta: [
      { title: `${title} | Iyá Marlene` },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: ORIGIN + path },
      { property: "og:image", content: image },
      { property: "og:image:secure_url", content: image },
      { property: "og:image:alt", content: image === `${ORIGIN}/og-image.jpg` ? 'Iyá Marlene — Ervas, aromas e cuidados. Composição botânica com ervas e vela.' : title },
      ...(image === `${ORIGIN}/og-image.jpg` ? [{ property: 'og:image:width', content: '1200' }, { property: 'og:image:height', content: '630' }, { property: 'og:image:type', content: 'image/jpeg' }] : []),
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: image === `${ORIGIN}/og-image.jpg` ? 'Iyá Marlene — Ervas, aromas e cuidados' : title },
    ],
    links: [{ rel: "canonical", href: ORIGIN + path }],
  };
}
