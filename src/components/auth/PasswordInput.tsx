import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState, type ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const PasswordInput = forwardRef<HTMLInputElement, ComponentProps<typeof Input>>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn("h-12 rounded-md border-border bg-card pr-12 shadow-none", className)}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1.5 top-1/2 size-9 -translate-y-1/2 text-muted-foreground hover:bg-light-green hover:text-primary"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={visible}
        >
          {visible ? <EyeOff strokeWidth={1.7} /> : <Eye strokeWidth={1.7} />}
        </Button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";