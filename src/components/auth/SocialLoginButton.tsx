import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SocialLoginButtonProps = ComponentProps<typeof Button>;

export function SocialLoginButton({ className, children, ...props }: SocialLoginButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "h-12 w-full rounded-md border-border bg-background font-medium shadow-none transition-[background-color,border-color,transform] hover:border-primary/40 hover:bg-light-green/50 active:scale-[0.99]",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="grid size-5 place-items-center rounded-full border border-border bg-card font-serif text-xs text-primary">
        G
      </span>
      {children}
    </Button>
  );
}