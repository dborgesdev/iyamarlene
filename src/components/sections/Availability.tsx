import { availability } from "../../data/site";
import { WhatsAppLink } from "../ui/WhatsAppLink";

export function Availability() {
  return (
    <section
      id="horarios"
      aria-labelledby="availability-title"
      className="bg-sand py-12 lg:py-14"
    >
      <div className="container-site">
        <h2
          id="availability-title"
          className="serif text-[clamp(1.9rem,3vw,2.6rem)] leading-tight tracking-[-.025em]"
        >
          Modalidades e horários
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {availability.map((item) => (
            <article
              key={item.id}
              className="flex flex-col items-start rounded-2xl border border-line bg-[#f0e9dc]/60 p-6 lg:p-8"
            >
              <h3 className="serif text-[27px] leading-tight">{item.title}</h3>
              <p className="mt-4 text-base leading-7 text-muted">
                {item.days}
                <br />
                <span className="font-semibold text-forest">{item.hours}</span>
              </p>
              <WhatsAppLink
                message={item.message}
                className="mt-5 w-full sm:w-auto"
              >
                {item.cta}
              </WhatsAppLink>
            </article>
          ))}
        </div>
        <p className="mt-5 text-sm leading-6 text-muted">
          Consulte a disponibilidade e confirme seu agendamento pelo WhatsApp.
        </p>
      </div>
    </section>
  );
}
