export function Introduction({
  paragraphs,
}: {
  paragraphs: readonly string[];
}) {
  return (
    <div className="mt-6 max-w-128 space-y-5 text-base leading-7 text-[#e4e5d9]">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}
