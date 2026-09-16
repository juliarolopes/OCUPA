import type { Category } from "@/data/ocupa";
import { Button } from "@/components/ui/button";

export function CategoryCard({ category }: { category: Category }) {
  const Icon = category.icon;
  return <Button type="button" variant="outline" className="group h-24 w-full flex-col gap-4 rounded-lg border-border bg-card px-2 py-4 shadow-[0_6px_16px_-14px_var(--foreground)] hover:border-primary hover:bg-light-green"><Icon className="size-6 text-primary transition-transform group-hover:-translate-y-0.5" strokeWidth={1.6} /><span className="text-[0.68rem] font-semibold">{category.label}</span></Button>;
}