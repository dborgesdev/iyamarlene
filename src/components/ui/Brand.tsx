export function Brand({ variant = 'header' }: { variant?: 'header' | 'footer' }) {
  return (
    <a
      href="/#inicio"
      aria-label="Iyá Marlene, início"
      className={`brand brand-${variant} inline-flex shrink-0 items-center`}
    >
      <img src="/logo-iya-marlene.webp" alt="Iyá Marlene" width={533} height={315} decoding="async" />
    </a>
  );
}
