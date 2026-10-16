import { ArrowRight } from "lucide-react";
import { services, whatsapp } from "../../data/site";

export function Services() {
  return (
    <section
      id="atendimentos"
      aria-labelledby="services-title"
      className="relative isolate overflow-hidden bg-sand py-14 lg:py-17"
    >
      <img
        src="/images/v2/textura-botanica.webp"
        width={1600}
        height={900}
        loading="lazy"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-[.035]"
      />
      <div className="container-site">
        <div className="grid gap-6 md:grid-cols-2 md:items-end md:gap-16">
          <div>
            <p className="eyebrow mb-4">Atendimentos espirituais</p>
            <h2 id="services-title" className="section-title max-w-112">
              Orientação para diferentes momentos da sua caminhada
            </h2>
          </div>
          <p className="max-w-115 pb-1 text-base leading-8 text-muted">
            Conheça os atendimentos realizados por Iyá Marlene. O primeiro
            contato é um espaço para esclarecer dúvidas e saber mais sobre cada
            prática.
          </p>
        </div>
        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {services.map((item) => (
            <article
              key={item.index}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#dcd1bd] bg-[#f0e9dc]/85"
            >
              <div className="aspect-[1.65] overflow-hidden">
                <img
                  src={item.image}
                  width={item.imageWidth ?? 1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  alt={item.imageAlt}
                  className="h-full w-full object-cover"
                  style={{
                    objectPosition: item.imagePosition,
                    transform: `scale(${item.imageScale})`,
                    transformOrigin: item.imagePosition,
                  }}
                />
              </div>
              <div className="relative mx-3 -mt-6 md:mx-2 lg:mx-3 flex grow flex-col rounded-t-2xl bg-[#f0e9dc] px-5 pb-6 pt-6 md:px-3 lg:px-5">
                <h3 className="serif text-[27px] leading-tight md:min-h-17 tracking-[-.025em]">
                  {item.title}
                </h3>
                <p className="mt-3 grow text-base leading-7 text-muted">
                  {item.description}
                </p>
                <a
                  href={whatsapp(item.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.cta}: ${item.title}`}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold"
                >
                  <span>{item.cta}</span>
                  <ArrowRight
                    className="shrink-0"
                    size={15}
                    aria-hidden="true"
                  />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
