import { ArrowDown } from "lucide-react";
import { messages } from "../../data/site";
import { WhatsAppLink } from "../ui/WhatsAppLink";

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-sand"
    >
      <picture className="block lg:absolute lg:inset-0 lg:-z-20">
        <source
          media="(min-width: 768px)"
          srcSet="/images/v2/hero-desktop.webp"
          width={1600}
          height={900}
        />
        <img
          src="/images/v2/hero-mobile.webp"
          width={720}
          height={960}
          fetchPriority="high"
          alt="Composição conceitual com vela, flores, cartas e búzios; imagem ilustrativa"
          className="hero-photo absolute inset-x-0 bottom-0 -z-20 h-52 w-full object-cover object-[50%_63%] lg:inset-0 lg:h-full lg:object-[center_58%]"
        />
      </picture>
      <div className="hero-wash pointer-events-none absolute inset-0 -z-10" />
      <div className="container-site relative pb-52 pt-7 sm:pb-62 sm:pt-10 lg:flex lg:min-h-[650px] lg:items-center lg:pb-16 lg:pt-32">
        <div className="max-w-xl lg:w-[49%] lg:max-w-[550px]">
          <p className="eyebrow mb-5 max-w-65 leading-6">
            Cuidado espiritual
            <br />
            para o seu caminho
          </p>
          <h1
            id="hero-title"
            className="serif text-[clamp(2.9rem,5.3vw,5.1rem)] leading-[.98] tracking-[-.045em]"
          >
            Orientação,
            <br />
            escuta e<br />
            <span className="italic text-clay">acolhimento</span>
          </h1>
          <p className="mt-6 max-w-108 text-base leading-8 text-muted ">
            Com Iyá Marlene, conheça um trabalho de orientação e cuidado
            espiritual por meio dos oráculos, trabalhos e elementos da natureza.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
            <WhatsAppLink message={messages.booking}>
              Agendar uma consulta
            </WhatsAppLink>
            <a
              href="#atendimentos"
              className="inline-flex min-h-11 items-center gap-2 text-[15px] font-medium"
            >
              Conhecer atendimentos <ArrowDown size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
