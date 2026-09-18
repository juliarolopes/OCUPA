import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, ImagePlus, MapPin, Star, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";

import { useAuth } from "@/components/auth/auth-context";
import { SpaceMap } from "@/components/ocupa/SpaceMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSpaces } from "@/context/SpacesContext";
import { createAvailabilityFromSchedule, formatSpacePrice, type Space } from "@/data/ocupa";
import {
  NEW_SPACE_DRAFT_KEY,
  amenityOptions,
  emptyNewSpaceDraft,
  purposeOptions,
  spaceTypes,
  validateDraftStep,
  weekdays,
  type DraftErrors,
  type NewSpaceDraft,
} from "@/data/new-space";
import { cn } from "@/lib/utils";

const steps = ["O espaço", "Localização", "Características", "Fotos", "Preço", "Publicar"];
const MAX_IMAGES = 4;
const MAX_IMAGE_SIZE = 900_000;

type StoredDraft = {
  ownerId: string;
  step: number;
  draft: NewSpaceDraft;
};

function readImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.readAsDataURL(file);
  });
}

function toggleItem(items: string[], item: string) {
  return items.includes(item) ? items.filter((value) => value !== item) : [...items, item];
}

function firstInvalidStep(draft: NewSpaceDraft) {
  return (
    [0, 1, 2, 3, 4].find((step) => Object.keys(validateDraftStep(draft, step)).length > 0) ?? 5
  );
}

export function NewSpaceForm() {
  const { user } = useAuth();
  const { createSpace } = useSpaces();
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<NewSpaceDraft>(emptyNewSpaceDraft);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [imageError, setImageError] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!user) return;
    try {
      const stored = window.localStorage.getItem(NEW_SPACE_DRAFT_KEY);
      const parsed = stored ? (JSON.parse(stored) as Partial<StoredDraft>) : null;
      if (parsed?.ownerId === user.id && parsed.draft) {
        setDraft({
          ...emptyNewSpaceDraft,
          ...parsed.draft,
          availability: {
            ...emptyNewSpaceDraft.availability,
            ...parsed.draft.availability,
          },
        });
        setStep(Math.min(5, Math.max(0, Number(parsed.step) || 0)));
      }
    } catch {
      // Um rascunho inválido é ignorado e o fluxo começa em branco.
    } finally {
      setIsReady(true);
    }
  }, [user]);

  useEffect(() => {
    if (!user || !isReady) return;
    try {
      window.localStorage.setItem(
        NEW_SPACE_DRAFT_KEY,
        JSON.stringify({ ownerId: user.id, step, draft } satisfies StoredDraft),
      );
    } catch {
      // O formulário continua funcionando em memória se o navegador recusar o rascunho.
    }
  }, [draft, isReady, step, user]);

  useEffect(() => {
    if (isReady) headingRef.current?.focus();
  }, [isReady, step]);

  if (!user || !isReady) return null;

  const update = <Key extends keyof NewSpaceDraft>(key: Key, value: NewSpaceDraft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const goToStep = (nextStep: number) => {
    if (nextStep > step) {
      const nextErrors = validateDraftStep(draft, step);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;
    }
    setErrors({});
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    setImageError("");
    if (draft.images.length + files.length > MAX_IMAGES) {
      setImageError(`Adicione no máximo ${MAX_IMAGES} fotos.`);
      return;
    }
    const oversized = files.find((file) => file.size > MAX_IMAGE_SIZE);
    if (oversized) {
      setImageError("Cada foto deve ter no máximo 900 KB para este protótipo local.");
      return;
    }
    try {
      const images = await Promise.all(files.map(readImage));
      update("images", [...draft.images, ...images]);
    } catch {
      setImageError("Não foi possível adicionar uma das fotos.");
    }
  };

  const publish = () => {
    const validation = validateDraftStep(draft, 5);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      setStep(firstInvalidStep(draft));
      return;
    }

    const rules = draft.rulesText
      .split("\n")
      .map((rule) => rule.trim())
      .filter(Boolean);
    const latitude = Number(draft.latitude) || -23.5505;
    const longitude = Number(draft.longitude) || -46.6333;
    const created = createSpace({
      name: draft.name.trim(),
      type: draft.type,
      area: `${Number(draft.areaValue)} m²`,
      areaValue: Number(draft.areaValue),
      capacity: Number(draft.capacity),
      description: draft.description.trim(),
      neighborhood: draft.neighborhood.trim(),
      city: draft.city.trim(),
      priceValue: Number(draft.priceValue),
      priceUnit: draft.priceUnit,
      feature: draft.amenities[0] || draft.type,
      purposes: draft.purposes,
      amenities: draft.amenities,
      highlights: draft.amenities.slice(0, 4),
      rules,
      image: draft.images[0]!,
      images: draft.images,
      latitude,
      longitude,
      availability: createAvailabilityFromSchedule(draft.availability),
      publishingAvailability: draft.availability,
      address: {
        postalCode: draft.postalCode.trim(),
        street: draft.street.trim(),
        number: draft.number.trim(),
        ...(draft.complement.trim() ? { complement: draft.complement.trim() } : {}),
        neighborhood: draft.neighborhood.trim(),
        city: draft.city.trim(),
        state: draft.state.trim().toUpperCase(),
      },
      ownerId: user.id,
    });

    window.localStorage.removeItem(NEW_SPACE_DRAFT_KEY);
    window.sessionStorage.setItem("ocupa:published-space-confirmation", String(created.id));
    void navigate({ to: "/espacos/$id", params: { id: String(created.id) } });
  };

  return (
    <div>
      <nav aria-label="Etapas do cadastro" className="overflow-x-auto border-b border-border">
        <ol className="grid min-w-[44rem] grid-cols-6">
          {steps.map((label, index) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => index < step && goToStep(index)}
                disabled={index > step}
                aria-current={index === step ? "step" : undefined}
                className={cn(
                  "flex w-full items-center gap-2 border-b-2 px-2 pb-4 text-left text-[0.62rem] font-semibold uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  index === step
                    ? "border-primary text-primary"
                    : index < step
                      ? "border-light-green text-foreground"
                      : "border-transparent text-muted-foreground",
                )}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mx-auto max-w-3xl pt-10 md:pt-14">
        <section aria-labelledby="new-space-step-title">
          {step === 0 ? (
            <SpaceBasics draft={draft} errors={errors} update={update} headingRef={headingRef} />
          ) : null}
          {step === 1 ? (
            <SpaceLocation draft={draft} errors={errors} update={update} headingRef={headingRef} />
          ) : null}
          {step === 2 ? (
            <SpaceUses draft={draft} errors={errors} update={update} headingRef={headingRef} />
          ) : null}
          {step === 3 ? (
            <SpacePhotos
              draft={draft}
              errors={errors}
              imageError={imageError}
              update={update}
              onImages={handleImages}
              headingRef={headingRef}
            />
          ) : null}
          {step === 4 ? (
            <SpacePrice draft={draft} errors={errors} update={update} headingRef={headingRef} />
          ) : null}
          {step === 5 ? (
            <SpaceReview draft={draft} onEdit={goToStep} headingRef={headingRef} />
          ) : null}
        </section>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => goToStep(step - 1)}
            disabled={step === 0}
          >
            <ArrowLeft /> Voltar
          </Button>
          {step < 5 ? (
            <Button type="button" variant="editorial" onClick={() => goToStep(step + 1)}>
              Continuar <ArrowRight />
            </Button>
          ) : (
            <Button type="button" variant="editorial" onClick={publish}>
              Publicar espaço <Check />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

type StepProps = {
  draft: NewSpaceDraft;
  errors: DraftErrors;
  update: <Key extends keyof NewSpaceDraft>(key: Key, value: NewSpaceDraft[Key]) => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
};

function StepHeading({
  title,
  description,
  headingRef,
}: {
  title: string;
  description: string;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <header>
      <h2
        id="new-space-step-title"
        ref={headingRef}
        tabIndex={-1}
        className="font-serif text-3xl leading-tight text-primary outline-none sm:text-4xl"
      >
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
    </header>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold text-foreground">
        {label}
      </label>
      {hint ? <p className="mt-1 text-[0.65rem] text-muted-foreground">{hint}</p> : null}
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SpaceBasics({ draft, errors, update, headingRef }: StepProps) {
  return (
    <>
      <StepHeading
        headingRef={headingRef}
        title="Vamos começar pelo espaço"
        description="Conte um pouco sobre o lugar que você quer disponibilizar."
      />
      <div className="mt-9 space-y-6">
        <Field id="space-name" label="Nome do espaço" error={errors.name}>
          <Input
            id="space-name"
            value={draft.name}
            maxLength={80}
            placeholder="Ateliê iluminado na Vila Madalena"
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "space-name-error" : undefined}
          />
        </Field>
        <div className="grid gap-6 sm:grid-cols-3">
          <Field id="space-type" label="Tipo de espaço" error={errors.type}>
            <select
              id="space-type"
              value={draft.type}
              onChange={(event) => update("type", event.target.value)}
              aria-invalid={Boolean(errors.type)}
              aria-describedby={errors.type ? "space-type-error" : undefined}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Selecione</option>
              {spaceTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </Field>
          <Field id="space-area" label="Área (m²)" error={errors.areaValue}>
            <Input
              id="space-area"
              type="number"
              min="1"
              value={draft.areaValue}
              onChange={(event) => update("areaValue", event.target.value)}
              aria-invalid={Boolean(errors.areaValue)}
              aria-describedby={errors.areaValue ? "space-area-error" : undefined}
            />
          </Field>
          <Field id="space-capacity" label="Capacidade" error={errors.capacity}>
            <Input
              id="space-capacity"
              type="number"
              min="1"
              value={draft.capacity}
              onChange={(event) => update("capacity", event.target.value)}
              aria-invalid={Boolean(errors.capacity)}
              aria-describedby={errors.capacity ? "space-capacity-error" : undefined}
            />
          </Field>
        </div>
        <Field id="space-description" label="Conte sobre o espaço" error={errors.description}>
          <Textarea
            id="space-description"
            value={draft.description}
            maxLength={800}
            rows={7}
            placeholder="Descreva o ambiente, seus diferenciais e as possibilidades de uso."
            onChange={(event) => update("description", event.target.value)}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? "space-description-error" : "description-count"}
          />
          <p
            id="description-count"
            className="mt-1 text-right text-[0.65rem] text-muted-foreground"
          >
            {draft.description.length}/800
          </p>
        </Field>
      </div>
    </>
  );
}

function SpaceLocation({ draft, errors, update, headingRef }: StepProps) {
  const latitude = Number(draft.latitude) || -23.5505;
  const longitude = Number(draft.longitude) || -46.6333;
  const mappedSpace = {
    id: 0,
    name: draft.name || "Seu espaço",
    latitude,
    longitude,
    priceValue: Number(draft.priceValue) || 0,
    priceUnit: draft.priceUnit,
  };

  return (
    <>
      <StepHeading
        headingRef={headingRef}
        title="Onde fica o espaço?"
        description="O endereço completo fica preparado para a reserva; a apresentação pública usa a localização aproximada."
      />
      <div className="mt-9 grid gap-6 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <Field id="postal-code" label="CEP" error={errors.postalCode}>
            <Input
              id="postal-code"
              value={draft.postalCode}
              inputMode="numeric"
              placeholder="00000-000"
              onChange={(event) => update("postalCode", event.target.value)}
              aria-invalid={Boolean(errors.postalCode)}
              aria-describedby={errors.postalCode ? "postal-code-error" : undefined}
            />
          </Field>
        </div>
        <div className="sm:col-span-4">
          <Field id="street" label="Endereço" error={errors.street}>
            <Input
              id="street"
              value={draft.street}
              onChange={(event) => update("street", event.target.value)}
              aria-invalid={Boolean(errors.street)}
              aria-describedby={errors.street ? "street-error" : undefined}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="number" label="Número" error={errors.number}>
            <Input
              id="number"
              value={draft.number}
              onChange={(event) => update("number", event.target.value)}
              aria-invalid={Boolean(errors.number)}
              aria-describedby={errors.number ? "number-error" : undefined}
            />
          </Field>
        </div>
        <div className="sm:col-span-4">
          <Field id="complement" label="Complemento">
            <Input
              id="complement"
              value={draft.complement}
              onChange={(event) => update("complement", event.target.value)}
            />
          </Field>
        </div>
        <div className="sm:col-span-3">
          <Field id="neighborhood" label="Bairro" error={errors.neighborhood}>
            <Input
              id="neighborhood"
              value={draft.neighborhood}
              onChange={(event) => update("neighborhood", event.target.value)}
              aria-invalid={Boolean(errors.neighborhood)}
              aria-describedby={errors.neighborhood ? "neighborhood-error" : undefined}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="city" label="Cidade" error={errors.city}>
            <Input
              id="city"
              value={draft.city}
              onChange={(event) => update("city", event.target.value)}
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? "city-error" : undefined}
            />
          </Field>
        </div>
        <div className="sm:col-span-1">
          <Field id="state" label="Estado" error={errors.state}>
            <Input
              id="state"
              value={draft.state}
              maxLength={2}
              className="uppercase"
              onChange={(event) => update("state", event.target.value.toUpperCase())}
              aria-invalid={Boolean(errors.state)}
              aria-describedby={errors.state ? "state-error" : undefined}
            />
          </Field>
        </div>
        <div className="sm:col-span-3">
          <Field
            id="latitude"
            label="Latitude"
            hint="Opcional, preparada para geocodificação futura."
          >
            <Input
              id="latitude"
              type="number"
              step="any"
              value={draft.latitude}
              onChange={(event) => update("latitude", event.target.value)}
            />
          </Field>
        </div>
        <div className="sm:col-span-3">
          <Field
            id="longitude"
            label="Longitude"
            hint="Opcional, preparada para geocodificação futura."
          >
            <Input
              id="longitude"
              type="number"
              step="any"
              value={draft.longitude}
              onChange={(event) => update("longitude", event.target.value)}
            />
          </Field>
        </div>
      </div>
      <div
        className="mt-8 h-72 overflow-hidden border border-border"
        aria-label="Prévia da localização"
      >
        <SpaceMap spaces={[mappedSpace]} activeSpaceId={0} onSpaceSelect={() => undefined} />
      </div>
    </>
  );
}

function SpaceUses({ draft, errors, update, headingRef }: StepProps) {
  return (
    <>
      <StepHeading
        headingRef={headingRef}
        title="Para que este espaço pode servir?"
        description="Escolha as atividades que combinam com o espaço. Isso ajuda as pessoas a encontrarem seu anúncio."
      />
      <ChoiceGroup
        legend="Finalidades"
        options={purposeOptions}
        selected={draft.purposes}
        onToggle={(item) => update("purposes", toggleItem(draft.purposes, item))}
        error={errors.purposes}
      />
      <ChoiceGroup
        legend="Características e comodidades"
        options={amenityOptions}
        selected={draft.amenities}
        onToggle={(item) => update("amenities", toggleItem(draft.amenities, item))}
      />
      <div className="mt-9">
        <Field
          id="space-rules"
          label="Há alguma regra importante?"
          hint="Escreva uma regra por linha."
        >
          <Textarea
            id="space-rules"
            rows={6}
            value={draft.rulesText}
            placeholder={"Não fumar\nMáximo de 6 pessoas\nDevolver o espaço organizado"}
            onChange={(event) => update("rulesText", event.target.value)}
          />
        </Field>
      </div>
    </>
  );
}

function ChoiceGroup({
  legend,
  options,
  selected,
  onToggle,
  error,
}: {
  legend: string;
  options: readonly string[];
  selected: string[];
  onToggle: (item: string) => void;
  error?: string | undefined;
}) {
  return (
    <fieldset className="mt-9">
      <legend className="text-xs font-semibold">{legend}</legend>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(option)}
              className={cn(
                "flex min-h-12 items-center justify-between border px-4 py-3 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "border-primary bg-light-green text-primary" : "border-border bg-card",
              )}
            >
              {option}
              {active ? <Check className="size-4" /> : null}
            </button>
          );
        })}
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

function SpacePhotos({
  draft,
  errors,
  imageError,
  update,
  onImages,
  headingRef,
}: StepProps & {
  imageError: string;
  onImages: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <StepHeading
        headingRef={headingRef}
        title="Mostre seu espaço"
        description="Boas fotos ajudam as pessoas a imaginar como podem usar o lugar."
      />
      <label className="mt-9 flex min-h-40 cursor-pointer flex-col items-center justify-center border border-dashed border-primary/45 bg-light-green/30 px-6 text-center focus-within:ring-2 focus-within:ring-ring">
        <ImagePlus className="size-7 text-primary" />
        <span className="mt-3 text-sm font-semibold">Adicionar fotos</span>
        <span className="mt-1 text-xs text-muted-foreground">
          JPG, PNG ou WebP · até {MAX_IMAGES} imagens de 900 KB
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          onChange={onImages}
        />
      </label>
      {imageError || errors.images ? (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {imageError || errors.images}
        </p>
      ) : null}
      {draft.images.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {draft.images.map((image, index) => (
            <figure
              key={`${image.slice(0, 30)}-${index}`}
              className="border border-border bg-card p-2"
            >
              <img
                src={image}
                alt={`Prévia ${index + 1} do espaço`}
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="mt-2 flex items-center justify-between gap-2">
                {index === 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    <Star className="size-3.5 fill-primary" /> Principal
                  </span>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      update("images", [
                        image,
                        ...draft.images.filter((_, itemIndex) => itemIndex !== index),
                      ])
                    }
                  >
                    Definir como principal
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remover foto ${index + 1}`}
                  onClick={() =>
                    update(
                      "images",
                      draft.images.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                >
                  <Trash2 />
                </Button>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
    </>
  );
}

function SpacePrice({ draft, errors, update, headingRef }: StepProps) {
  const updateAvailability = (value: Partial<NewSpaceDraft["availability"]>) =>
    update("availability", { ...draft.availability, ...value });

  return (
    <>
      <StepHeading
        headingRef={headingRef}
        title="Quanto custa usar o espaço?"
        description="Defina o valor e os horários em que o espaço costuma estar disponível."
      />
      <div className="mt-9 grid gap-6 sm:grid-cols-2">
        <Field id="price-value" label="Preço (R$)" error={errors.priceValue}>
          <Input
            id="price-value"
            type="number"
            min="1"
            step="1"
            value={draft.priceValue}
            onChange={(event) => update("priceValue", event.target.value)}
            aria-invalid={Boolean(errors.priceValue)}
            aria-describedby={errors.priceValue ? "price-value-error" : undefined}
          />
        </Field>
        <Field id="price-unit" label="Cobrança" error={errors.priceUnit}>
          <select
            id="price-unit"
            value={draft.priceUnit}
            onChange={(event) => update("priceUnit", event.target.value as "hora" | "dia")}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="hora">Por hora</option>
            <option value="dia">Por dia</option>
          </select>
        </Field>
      </div>

      <fieldset className="mt-10">
        <legend className="font-serif text-2xl text-primary">
          Quando o espaço está disponível?
        </legend>
        <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-7">
          {weekdays.map((day) => {
            const active = draft.availability.weekdays.includes(day.value);
            return (
              <button
                key={day.value}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  updateAvailability({
                    weekdays: active
                      ? draft.availability.weekdays.filter((value) => value !== day.value)
                      : [...draft.availability.weekdays, day.value],
                  })
                }
                className={cn(
                  "min-h-11 border px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active ? "border-primary bg-light-green text-primary" : "border-border bg-card",
                )}
              >
                {day.label}
              </button>
            );
          })}
        </div>
        {errors.availability ? (
          <p role="alert" className="mt-2 text-xs text-destructive">
            {errors.availability}
          </p>
        ) : null}
      </fieldset>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Field id="start-time" label="Horário inicial">
          <Input
            id="start-time"
            type="time"
            value={draft.availability.startTime}
            onChange={(event) => updateAvailability({ startTime: event.target.value })}
          />
        </Field>
        <Field id="end-time" label="Horário final" error={errors.availabilityTimes}>
          <Input
            id="end-time"
            type="time"
            value={draft.availability.endTime}
            onChange={(event) => updateAvailability({ endTime: event.target.value })}
            aria-invalid={Boolean(errors.availabilityTimes)}
            aria-describedby={errors.availabilityTimes ? "end-time-error" : undefined}
          />
        </Field>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Datas bloqueadas já fazem parte do modelo e poderão ser gerenciadas quando a agenda completa
        for conectada.
      </p>
    </>
  );
}

function SpaceReview({
  draft,
  onEdit,
  headingRef,
}: {
  draft: NewSpaceDraft;
  onEdit: (step: number) => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const rules = draft.rulesText
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  const preview = {
    priceValue: Number(draft.priceValue),
    priceUnit: draft.priceUnit,
  };

  return (
    <>
      <StepHeading
        headingRef={headingRef}
        title="Confira seu espaço"
        description="Revise as informações antes de salvar o anúncio neste navegador."
      />
      <div className="mt-9 overflow-hidden border border-border bg-card">
        <img src={draft.images[0]} alt={draft.name} className="aspect-[16/8] w-full object-cover" />
        <div className="p-6 sm:p-8">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-terracotta">
            {draft.type}
          </p>
          <h3 className="mt-2 font-serif text-3xl text-primary">{draft.name}</h3>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="size-4 text-primary" /> {draft.neighborhood}, {draft.city} ·{" "}
            {draft.areaValue} m² · até {draft.capacity} pessoas
          </p>
          <p className="mt-6 text-sm leading-7 text-muted-foreground">{draft.description}</p>
          <p className="mt-6 text-lg font-semibold text-primary">{formatSpacePrice(preview)}</p>
        </div>
      </div>

      <ReviewSection title="O espaço" onEdit={() => onEdit(0)}>
        <p>
          {draft.type} · {draft.areaValue} m² · capacidade para {draft.capacity}
        </p>
      </ReviewSection>
      <ReviewSection title="Localização" onEdit={() => onEdit(1)}>
        <p>
          {draft.street}, {draft.number} · {draft.neighborhood}, {draft.city}/{draft.state}
        </p>
      </ReviewSection>
      <ReviewSection title="Finalidades e comodidades" onEdit={() => onEdit(2)}>
        <TagList items={draft.purposes} />
        <TagList items={draft.amenities} muted />
      </ReviewSection>
      <ReviewSection title="Regras" onEdit={() => onEdit(2)}>
        {rules.length ? (
          <ul className="list-disc space-y-1 pl-5">
            {rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma regra informada.</p>
        )}
      </ReviewSection>
      <ReviewSection title="Fotos" onEdit={() => onEdit(3)}>
        <p>
          {draft.images.length}{" "}
          {draft.images.length === 1 ? "foto adicionada" : "fotos adicionadas"}
        </p>
      </ReviewSection>
      <ReviewSection title="Preço e disponibilidade" onEdit={() => onEdit(4)}>
        <p>{formatSpacePrice(preview)}</p>
        <p>
          {draft.availability.weekdays.length} dias por semana · {draft.availability.startTime}–
          {draft.availability.endTime}
        </p>
      </ReviewSection>
    </>
  );
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <section className="mt-8 border-t border-border pt-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-serif text-xl text-primary">{title}</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
          Editar
        </Button>
      </div>
      <div className="mt-3 space-y-2 text-xs leading-5 text-muted-foreground">{children}</div>
    </section>
  );
}

function TagList({ items, muted = false }: { items: string[]; muted?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className={cn(
            "border px-3 py-1",
            muted ? "border-border" : "border-primary/30 bg-light-green/60 text-primary",
          )}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
