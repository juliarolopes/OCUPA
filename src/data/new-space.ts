import type { SpacePublishingAvailability } from "@/data/ocupa";

export const NEW_SPACE_DRAFT_KEY = "ocupa:new-space-draft";

export const spaceTypes = [
  "Sala",
  "Quarto",
  "Garagem",
  "Estúdio",
  "Loja",
  "Oficina",
  "Depósito",
  "Quintal",
  "Sala comercial",
  "Galpão",
  "Terreno",
  "Outro",
] as const;

export const purposeOptions = [
  "Armazenar",
  "Trabalhar",
  "Fotografar",
  "Criar",
  "Guardar",
  "Produzir",
  "Ensinar",
  "Reunir",
  "Outros",
] as const;

export const amenityOptions = [
  "Wi-Fi",
  "Tomadas",
  "Banheiro",
  "Estacionamento",
  "Iluminação natural",
  "Ar-condicionado",
  "Mesa",
  "Cadeiras",
  "Acesso independente",
  "Elevador",
  "Cozinha",
  "Área externa",
] as const;

export const weekdays = [
  { value: 1, label: "Seg" },
  { value: 2, label: "Ter" },
  { value: 3, label: "Qua" },
  { value: 4, label: "Qui" },
  { value: 5, label: "Sex" },
  { value: 6, label: "Sáb" },
  { value: 0, label: "Dom" },
] as const;

export type NewSpaceDraft = {
  name: string;
  type: string;
  areaValue: string;
  capacity: string;
  description: string;
  postalCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude: string;
  longitude: string;
  purposes: string[];
  amenities: string[];
  rulesText: string;
  images: string[];
  priceValue: string;
  priceUnit: "hora" | "dia";
  availability: SpacePublishingAvailability;
};

export type DraftErrors = Partial<Record<keyof NewSpaceDraft | "availabilityTimes", string>>;

export const emptyNewSpaceDraft: NewSpaceDraft = {
  name: "",
  type: "",
  areaValue: "",
  capacity: "",
  description: "",
  postalCode: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  latitude: "",
  longitude: "",
  purposes: [],
  amenities: [],
  rulesText: "",
  images: [],
  priceValue: "",
  priceUnit: "hora",
  availability: {
    weekdays: [1, 2, 3, 4, 5],
    startTime: "09:00",
    endTime: "18:00",
    blockedDates: [],
  },
};

export function validateDraftStep(draft: NewSpaceDraft, step: number): DraftErrors {
  const errors: DraftErrors = {};

  if (step === 0 || step === 5) {
    if (!draft.name.trim()) errors.name = "Informe o nome do espaço.";
    if (!draft.type) errors.type = "Escolha o tipo de espaço.";
    if (!(Number(draft.areaValue) > 0)) errors.areaValue = "Informe uma área válida.";
    if (!(Number(draft.capacity) > 0)) errors.capacity = "Informe uma capacidade válida.";
    if (!draft.description.trim()) errors.description = "Conte um pouco sobre o espaço.";
  }

  if (step === 1 || step === 5) {
    if (!draft.postalCode.trim()) errors.postalCode = "Informe o CEP.";
    if (!draft.street.trim()) errors.street = "Informe o endereço.";
    if (!draft.number.trim()) errors.number = "Informe o número.";
    if (!draft.neighborhood.trim()) errors.neighborhood = "Informe o bairro.";
    if (!draft.city.trim()) errors.city = "Informe a cidade.";
    if (draft.state.trim().length !== 2) errors.state = "Use a sigla do estado com 2 letras.";
  }

  if ((step === 2 || step === 5) && draft.purposes.length === 0) {
    errors.purposes = "Escolha pelo menos uma finalidade.";
  }

  if ((step === 3 || step === 5) && draft.images.length === 0) {
    errors.images = "Adicione pelo menos uma foto.";
  }

  if (step === 4 || step === 5) {
    if (!(Number(draft.priceValue) > 0)) errors.priceValue = "Informe um preço maior que zero.";
    if (!draft.priceUnit) errors.priceUnit = "Escolha a unidade do preço.";
    if (draft.availability.weekdays.length === 0) {
      errors.availability = "Escolha pelo menos um dia da semana.";
    }
    if (
      !draft.availability.startTime ||
      !draft.availability.endTime ||
      draft.availability.startTime >= draft.availability.endTime
    ) {
      errors.availabilityTimes = "O horário final deve ser posterior ao inicial.";
    }
  }

  return errors;
}
