import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { LoginForm } from "@/components/auth/LoginForm";
import { RegistrationForm } from "@/components/auth/RegistrationForm";
import { authCopy, useAuthModal } from "@/components/auth/auth-modal";

export function AuthModal() {
  const { state, closeAuth, setOpen } = useAuthModal();
  const [mode, setMode] = useState<"login" | "register">("login");

  useEffect(() => {
    if (state.open) setMode("login");
  }, [state.open]);

  const copy = authCopy[state.intent];

  const handleSuccess = async () => {
    const callback = state.onSuccess;
    closeAuth();
    if (callback) await callback();
  };

  return (
    <DialogPrimitive.Root open={state.open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/45 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed inset-x-0 bottom-0 top-8 z-50 flex flex-col overflow-y-auto border-t border-border bg-background px-6 pb-10 pt-8 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:max-h-[90vh] sm:w-[min(29rem,calc(100vw-2.5rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:border sm:px-9 sm:py-9 sm:shadow-lg sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95"
        >
          <DialogPrimitive.Close
            className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-light-green hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Fechar"
          >
            <X className="size-5" strokeWidth={1.7} />
          </DialogPrimitive.Close>

          <p className="font-serif text-[1.45rem] text-primary">OCUPA</p>
          <div className="mt-6">
            <p className="mb-3 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary">Sua conta</p>
            <DialogPrimitive.Title className="font-serif text-[2rem] leading-none text-primary sm:text-[2.25rem]">
              {mode === "login" ? copy.headline : "Criar sua conta"}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="mt-3 text-sm text-muted-foreground">
              {mode === "login" ? copy.support : "Crie sua conta OCUPA para continuar."}
            </DialogPrimitive.Description>
          </div>

          <div className="mt-7">
            {mode === "login" ? (
              <LoginForm
                idPrefix="modal-login"
                showBrand={false}
                showHeading={false}
                onSuccess={handleSuccess}
                onSwitchToRegister={() => setMode("register")}
              />
            ) : (
              <RegistrationForm
                idPrefix="modal-signup"
                onSuccess={handleSuccess}
                onSwitchToLogin={() => setMode("login")}
              />
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
