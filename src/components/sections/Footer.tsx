import {
  DEVELOPER_URL,
  INSTAGRAM,
  messages,
  navigation,
  whatsapp,
} from "../../data/site";
import { Brand } from "../ui/Brand";
export function Footer() {
  return (
    <footer className="bg-sand py-8">
      <div className="container-site flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <Brand />
        <nav
          aria-label="Navegação do rodapé"
          className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm"
        >
          {navigation
            .filter((item) => item.href !== "#inicio")
            .map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center"
              >
                {item.label}
              </a>
            ))}
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center"
          >
            Instagram
          </a>
          <a
            href={whatsapp(messages.general)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center"
          >
            WhatsApp
          </a>
        </nav>
        <p className="text-center text-sm leading-5 text-muted lg:text-right">
          © {new Date().getFullYear()} Iyá Marlene.
          <br />
          Todos os direitos reservados.
        </p>
      </div>
      <div className="container-site mt-6 border-t border-line pt-5 text-center text-sm leading-6 text-muted lg:text-right">
        <a
          href={DEVELOPER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded py-1 hover:text-forest"
        >
          Desenvolvido por Douglas Borges - Smart Local
        </a>
      </div>
    </footer>
  );
}
