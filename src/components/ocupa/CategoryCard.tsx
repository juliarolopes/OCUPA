import type { Category } from "@/data/ocupa";

export function CategoryCard({ category }: { category: Category }) {
  const Icon = category.icon;
  return <button type="button" className="group flex min-h-28 flex-col justify-between border border-border bg-card p-4 text-left transition-colors hover:border-primary hover:bg-light-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Icon className="size-6 text-primary transition-transform group-hover:-translate-y-0.5" strokeWidth={1.6} /><span className="text-sm font-medium">{category.label}</span></button>;
}