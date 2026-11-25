import { messages } from "../../data/site";
import { WhatsAppLink } from "../ui/WhatsAppLink";
export function FinalCTA() {
  return (
    <section
      id="contato"
      aria-labelledby="contact-title"
      className="relative isolate overflow-hidden bg-accent-deep py-12 text-sand lg:py-14"
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
      <div className="absolute inset-0 -z-10 contact-wash" />
      <div className="container-site grid gap-6 md:grid-cols-2 md:items-center md:gap-16">
        <div>
          <p className="eyebrow eyebrow-inverse mb-4">Entre em contato</p>
          <h2 id="contact-title" className="section-title max-w-120">
            Seu primeiro passo pode ser uma conversa
          </h2>
        </div>
        <div className="flex flex-col items-start">
          <p className="max-w-100 text-base leading-8 text-sand">
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
