import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "../components/ui/LegalPage";
import { legalPages } from "../data/legal";
import { seo } from "../lib/seo";
export const Route = createFileRoute("/termos-de-uso")({
  head: () =>
    seo(
      legalPages["termos-de-uso"].title,
      legalPages["termos-de-uso"].intro,
      "/termos-de-uso",
    ),
  component: () => <LegalPage slug="termos-de-uso" />,
});
