import { messages } from "../../data/site";
import { WhatsAppLink } from "../ui/WhatsAppLink";

export function Products() {
  return (
    <section
      id="produtos"
      aria-labelledby="products-title"
      className="relative grid overflow-hidden bg-[#eee5d5] lg:min-h-110 lg:grid-cols-2"
    >
      <figure className="relative min-w-0">
        <img
          src="/images/v2/produtos.webp"
          width={1600}
          height={900}
          loading="lazy"
          decoding="async"
          alt="Composição ilustrativa de sabonetes, ervas e frascos; não representa o catálogo de Iyá Marlene"
          className="h-64 w-full object-cover object-[50%_58%] sm:h-80 lg:h-full lg:min-h-110"
        />
      </figure>
      <div className="relative isolate flex flex-col items-start justify-center px-5 py-12 sm:px-10 lg:px-14 lg:py-14 xl:pr-[max(40px,calc((100vw-1160px)/2))]">
        <img
          src="/images/v2/textura-botanica.webp"
          width={1600}
          height={900}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-[.045]"
        />
        <p className="eyebrow mb-4">Ervas e cuidados</p>
        <h2 id="products-title" className="section-title max-w-115">
          Banhos, sabonetes
          <br className="hidden sm:block" /> e perfumes
        </h2>
        <p className="mt-5 max-w-115 text-base leading-8 text-muted">
          Elementos da natureza fazem parte dos produtos apresentados por Iyá
          Marlene. Entre em contato para conhecer as opções e consultar a
          disponibilidade.
        </p>
        <ul
          className="my-5 flex flex-wrap gap-2 text-sm text-forest"
          aria-label="Produtos"
        >
          {["Banhos de ervas", "Sabonetes", "Perfumes"].map((name) => (
            <li
              key={name}
              className="rounded-full border border-[#b7ad97] px-3 py-2"
            >
              {name}
            </li>
          ))}
        </ul>
        <WhatsAppLink message={messages.products}>
          Consultar produtos
        </WhatsAppLink>
      </div>
    </section>
  );
}
