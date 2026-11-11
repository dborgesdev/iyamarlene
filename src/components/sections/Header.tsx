import { useCart } from "../cart/CartProvider";
import { ArrowUpRight, Menu, X, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { messages, navigation, whatsapp } from "../../data/site";

import { Brand } from "../ui/Brand";

export function Header() {
  const { cart } = useCart();
  const commerceLinks = (
    <>
      <a
        href="/carrinho"
        className="inline-flex min-h-11 items-center gap-1"
        aria-label={`Carrinho, ${cart?.items_count || 0} itens`}
      >
        <ShoppingBag aria-hidden="true" size={18} /> {cart?.items_count || 0}
      </a>
    </>
  );
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return (
    <header className="relative z-30 bg-sand lg:absolute lg:inset-x-0 lg:top-0 lg:bg-transparent">
      <div className="container-site grid h-20 grid-cols-[1fr_auto_auto] items-center gap-4 lg:grid-cols-[auto_1fr_auto] lg:h-24">
        <div className="justify-self-start">
          <Brand />
        </div>
        <nav
          aria-label="Navegação principal"
          className="hidden justify-self-center items-center gap-4 rounded-full lg:flex lg:bg-sand/85 lg:px-5 lg:py-1 xl:gap-4"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              className="inline-flex min-h-11 items-center text-[15px] font-medium"
              href={item.href}
            >
              {item.label}
            </a>
          ))}
          {commerceLinks}
        </nav>
        <a
          className="hidden min-h-12 items-center justify-self-end gap-2 rounded-full bg-forest px-5 py-3 text-[15px] font-semibold text-white hover:bg-[#24372d] lg:inline-flex"
          target="_blank"
          rel="noopener noreferrer"
          href={whatsapp(messages.booking)}
        >
          Agendar consulta <ArrowUpRight aria-hidden="true" size={16} />
        </a>
        <a
          href="/carrinho"
          className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1 lg:hidden"
          aria-label={`Carrinho, ${cart?.items_count || 0} itens`}
        >
          <ShoppingBag size={20} aria-hidden="true" />
          {cart?.items_count || 0}
        </a>
        <button
          ref={toggle}
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg lg:hidden"
          aria-controls="mobile-navigation"
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <nav
        id="mobile-navigation"
        aria-label="Menu móvel"
        hidden={!open}
        className="absolute inset-x-0 top-full border-y border-line bg-sand px-5 py-4 shadow-lg lg:hidden"
      >
        {navigation.map((item) => (
          <a
            onClick={() => setOpen(false)}
            key={item.href}
            href={item.href}
            className="block py-3 font-medium"
          >
            {item.label}
          </a>
        ))}
        <div className="flex gap-5">{commerceLinks}</div>
        <a
          onClick={() => setOpen(false)}
          href={whatsapp(messages.booking)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex min-h-12 items-center gap-3 rounded-full bg-forest px-6 font-semibold text-white"
        >
          Agendar consulta <ArrowUpRight aria-hidden="true" size={16} />
        </a>
      </nav>
    </header>
  );
}
