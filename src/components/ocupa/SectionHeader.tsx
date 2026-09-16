export function SectionHeader({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return <div className="mb-6">{eyebrow && <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}<h2 className="max-w-3xl font-serif text-3xl leading-tight text-primary md:text-[2rem]">{title}</h2></div>;
}