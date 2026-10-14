import { ArrowRight, Instagram } from "lucide-react";
import { biography, INSTAGRAM } from "../../data/site";
import { Introduction } from "./Introduction";

export function About() {
  return (
    <section
      id="sobre"
      aria-labelledby="about-title"
      className="grid overflow-hidden bg-forest text-sand lg:grid-cols-2"
    >
      <div className="flex flex-col items-start justify-center px-5 py-12 sm:px-10 lg:py-14 lg:pl-[max(40px,calc((100vw-1160px)/2))] lg:pr-12">
        <p className="eyebrow mb-4 !text-[#dec09d]">Conheça Iyá Marlene</p>
        <h2 id="about-title" className="section-title max-w-128">
          {biography.title}
        </h2>
        <Introduction paragraphs={biography.paragraphs} />
        <a
          href={INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-full border border-sand/60 px-5 py-3 text-[15px] font-medium hover:bg-white/10"
        >
          <Instagram size={18} aria-hidden="true" />
          Conheça mais pelo Instagram{" "}
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
      <figure className="relative mx-auto aspect-[4/5] w-full max-w-lg lg:mx-0 lg:aspect-auto lg:min-h-160 lg:max-w-none">
        <img
          src={biography.portrait}
          width={1080}
          height={1350}
          alt="Retrato de Iyá Marlene"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
        />
      </figure>
    </section>
  );
}
