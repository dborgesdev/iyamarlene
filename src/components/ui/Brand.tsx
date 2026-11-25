export function Brand({ variant = 'header' }: { variant?: 'header' | 'footer' }) {
  return (
    <a
      href="/#inicio"
      aria-label="Saboaria Afinjolè, início"
      className={`brand brand-${variant} inline-flex shrink-0 items-center`}
    >
      <img src="/logo-saboaria-afinjole.webp" alt="Saboaria Afinjolè" width={1086} height={362} decoding="async" />
    </a>
  );
}
