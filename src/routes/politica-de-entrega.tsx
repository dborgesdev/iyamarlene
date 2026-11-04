import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "../components/ui/LegalPage";
import { legalPages } from "../data/legal";
import { seo } from "../lib/seo";
export const Route = createFileRoute("/politica-de-entrega")({
  head: () =>
    seo(
      legalPages["politica-de-entrega"].title,
      legalPages["politica-de-entrega"].intro,
      "/politica-de-entrega",
    ),
  component: () => <LegalPage slug="politica-de-entrega" />,
});
