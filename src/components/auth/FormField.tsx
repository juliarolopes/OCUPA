import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";

type FormFieldProps = {
  children: ReactNode;
  error?: string | undefined;
  htmlFor: string;
  label: string;
  labelAction?: ReactNode;
};

export function FormField({ children, error, htmlFor, label, labelAction }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor={htmlFor} className="text-[0.78rem] font-medium text-foreground">
          {label}
        </Label>
        {labelAction}
      </div>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}