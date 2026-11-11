import { legalPages, type LegalSlug } from '../../data/legal';
import { messages, whatsapp } from '../../data/site';
export function LegalPage({ slug }: { slug: LegalSlug }) {
  const page = legalPages[slug];
  return <article className="commerce-page"><div className="internal-hero"><div className="container-site"><p className="eyebrow">Informações da loja</p><h1 className="section-title mt-5">{page.title}</h1><p className="mt-6 max-w-2xl leading-8 text-muted">{page.intro}</p></div></div><div className="container-site py-12"><div className="legal-copy"><p className="legal-notice">Texto-base para revisão e aprovação antes da publicação. Dados empresariais e condições operacionais pendentes de confirmação.</p>{page.sections.map(([title, text]) => <section key={title}><h2 className="serif text-3xl">{title}</h2><p>{text}</p></section>)}<a className="shop-button" href={whatsapp(messages.general)} target="_blank" rel="noopener noreferrer">Falar com a loja ↗</a><p className="text-sm">Versão para revisão — 11 de novembro de 2026.</p></div></div></article>;
}
