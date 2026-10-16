import { Header } from "./components/sections/Header";
import { Hero } from "./components/sections/Hero";
import { Services } from "./components/sections/Services";
import { Products } from "./components/sections/Products";
import { About } from "./components/sections/About";
import { Availability } from "./components/sections/Availability";
import { FinalCTA } from "./components/sections/FinalCTA";
import { Footer } from "./components/sections/Footer";

import { WhatsAppFloat } from "./components/ui/WhatsAppFloat";

export default function App() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only fixed left-5 top-4 z-50 rounded bg-forest px-5 py-3 text-white focus:not-sr-only"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <Services />
        <Products />
        <About />
        <Availability />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
