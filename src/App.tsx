import { Hero } from "./components/sections/Hero";
import { Services } from "./components/sections/Services";
import { Products } from "./components/sections/Products";
import { About } from "./components/sections/About";
import { Availability } from "./components/sections/Availability";
import { FinalCTA } from "./components/sections/FinalCTA";

export default function App() {
  return (
    <>
      <Hero />
      <Services />
      <Products />
      <About />
      <Availability />
      <FinalCTA />
    </>
  );
}
