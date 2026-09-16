export function SectionHeader({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return <div className="mb-8 md:mb-10">{eyebrow && <p className="mb-3 text-xs font-semibold uppercase text-terracotta">{eyebrow}</p>}<h2 className="max-w-3xl font-serif text-4xl leading-tight text-foreground md:text-5xl">{title}</h2></div>;
}