import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "../components/ui/LegalPage";
import { legalPages } from "../data/legal";
import { seo } from "../lib/seo";
export const Route = createFileRoute("/politica-de-trocas-e-devolucoes")({
  head: () =>
    seo(
      legalPages["politica-de-trocas-e-devolucoes"].title,
      legalPages["politica-de-trocas-e-devolucoes"].intro,
      "/politica-de-trocas-e-devolucoes",
    ),
  component: () => <LegalPage slug="politica-de-trocas-e-devolucoes" />,
});
