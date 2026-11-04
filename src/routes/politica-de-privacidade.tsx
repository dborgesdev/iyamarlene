import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "../components/ui/LegalPage";
import { legalPages } from "../data/legal";
import { seo } from "../lib/seo";
export const Route = createFileRoute("/politica-de-privacidade")({
  head: () =>
    seo(
      legalPages["politica-de-privacidade"].title,
      legalPages["politica-de-privacidade"].intro,
      "/politica-de-privacidade",
    ),
  component: () => <LegalPage slug="politica-de-privacidade" />,
});
