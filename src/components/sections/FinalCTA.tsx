import { messages } from "../../data/site";
import { WhatsAppLink } from "../ui/WhatsAppLink";
export function FinalCTA() {
  return (
    <section
      id="contato"
      aria-labelledby="contact-title"
      className="relative isolate overflow-hidden bg-clay py-12 text-sand lg:py-14"
    >
      <img
        src="/images/v2/contato-bg.webp"
        width={1600}
        height={900}
        loading="lazy"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_60%]"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(111,57,33,.89),rgba(125,63,37,.91)_60%,rgba(72,47,28,.5))]" />
      <div className="container-site grid gap-6 md:grid-cols-2 md:items-center md:gap-16">
        <div>
          <p className="eyebrow mb-4 !text-[#f0d9bd]">Entre em contato</p>
          <h2 id="contact-title" className="section-title max-w-120">
            Seu primeiro passo pode ser uma conversa
          </h2>
        </div>
        <div className="flex flex-col items-start">
          <p className="max-w-100 text-base leading-8 text-[#f6eadd]">
            Converse com Iyá Marlene para tirar dúvidas sobre os atendimentos e
            produtos e solicitar seu agendamento.
          </p>
          <WhatsAppLink message={messages.general} light className="mt-5">
            Falar com Iyá Marlene
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}
