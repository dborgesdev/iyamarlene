import { useEffect, useRef, useState } from "react";
import { getFeatured } from "../../lib/queries";
import type { Product } from "../../lib/commerce";
import { ProductCard } from "./ProductCard";
import { ProductPresentation } from "./ProductPresentation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { connectCarousel, type CarouselState } from "../../lib/carousel";
export function FeaturedProducts() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState(false);
  const controller = useRef<ReturnType<typeof connectCarousel> | null>(null);
  const [navigation, setNavigation] = useState<CarouselState>({
    start: true,
    end: true,
    progress: 0,
  });
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    controller.current = connectCarousel(el, setNavigation);
    return () => {
      controller.current?.dispose();
      controller.current = null;
    };
  }, [products, error]);
  async function load() {
    setError(false);
    try {
      setProducts(await getFeatured());
    } catch {
      setError(true);
    }
  }
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          void load();
          observer.disconnect();
        }
      },
      { rootMargin: "500px" },
    );
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  if (products?.length === 0 || error)
    return <ProductPresentation sectionRef={section} />;
  return (
    <section
      ref={section}
      id="produtos"
      className="section-space bg-[#eee5d5]"
      aria-labelledby="products-title"
    >
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow mb-4">Ervas e cuidados</p>
            <h2 id="products-title" className="section-title">
              Produtos para o seu cuidado
            </h2>
            <p className="mt-5 max-w-xl leading-8 text-muted">
              Conheça os produtos em destaque na loja de Iyá Marlene.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="carousel-arrow"
              type="button"
              aria-label="Produtos anteriores"
              aria-controls="home-featured-track"
              disabled={!products || navigation.start}
              onClick={() => controller.current?.move(-1)}
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              className="carousel-arrow"
              type="button"
              aria-label="Próximos produtos"
              aria-controls="home-featured-track"
              disabled={!products || navigation.end}
              onClick={() => controller.current?.move(1)}
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div
          className="product-carousel"
          id="home-featured-track"
          ref={track}
          role="region"
          tabIndex={0}
          aria-label="Produtos em destaque"
        >
          {products
            ? products.map((p) => <ProductCard key={p.id} product={p} />)
            : [0, 1, 2].map((n) => (
                <div
                  key={n}
                  className="product-skeleton"
                  aria-label="Carregando produtos"
                />
              ))}
        </div>
        <div
          className="carousel-progress"
          role="progressbar"
          aria-label="Progresso dos produtos em destaque"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(navigation.progress * 100)}
        >
          <span style={{ transform: `scaleX(${navigation.progress})` }} />
        </div>
        <a className="shop-button mt-7" href="/produtos">
          Ver todos os produtos ↗
        </a>
      </div>
    </section>
  );
}
