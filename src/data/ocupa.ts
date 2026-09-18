import {
  Archive,
  BriefcaseBusiness,
  Camera,
  Car,
  Hammer,
  MoreHorizontal,
  Package,
  Presentation,
  type LucideIcon,
} from "lucide-react";

import deposito42 from "@/assets/deposito-42.jpg";
import estudioLuz from "@/assets/estudio-luz.jpg";
import garagemCentral from "@/assets/garagem-central.jpg";
import oficinaVerde from "@/assets/oficina-verde.jpg";
import quintalArvores from "@/assets/quintal-arvores.jpg";
import salaCriativa from "@/assets/sala-criativa.jpg";

export type Category = {
  label: string;
  icon: LucideIcon;
};

export type AvailabilitySlot = {
  time: string;
  available: boolean;
};

export type SpaceAvailability = {
  date: string;
  available: boolean;
  slots: AvailabilitySlot[];
};

export type SpaceAddress = {
  postalCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
};

export type SpacePublishingAvailability = {
  weekdays: number[];
  startTime: string;
  endTime: string;
  blockedDates: string[];
};

export type Space = {
  id: number;
  name: string;
  neighborhood: string;
  city: string;
  area: string;
  areaValue: number;
  capacity?: number;
  priceValue: number;
  priceUnit: "hora" | "dia";
  rating: number;
  reviews: number;
  feature: string;
  type: string;
  purposes: string[];
  amenities: string[];
  description: string;
  highlights: string[];
  rules: string[];
  image: string;
  images: string[];
  latitude: number;
  longitude: number;
  availability: SpaceAvailability[];
  address?: SpaceAddress;
  publishingAvailability?: SpacePublishingAvailability;
  ownerId?: string;
};

export const categories: Category[] = [
  { label: "Armazenar", icon: Archive },
  { label: "Trabalhar", icon: BriefcaseBusiness },
  { label: "Fotografar", icon: Camera },
  { label: "Criar", icon: Hammer },
  { label: "Guardar", icon: Package },
  { label: "Produzir", icon: Car },
  { label: "Ensinar", icon: Presentation },
  { label: "Outros", icon: MoreHorizontal },
];

const images = {
  garagem: [garagemCentral, deposito42, oficinaVerde],
  sala: [salaCriativa, estudioLuz, quintalArvores],
  deposito: [deposito42, garagemCentral, oficinaVerde],
  estudio: [estudioLuz, salaCriativa, oficinaVerde],
  oficina: [oficinaVerde, deposito42, salaCriativa],
  quintal: [quintalArvores, oficinaVerde, salaCriativa],
};

export function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createAvailability(seed: number): SpaceAvailability[] {
  const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
  return Array.from({ length: 45 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + index + 1);
    const available = (index + seed) % 6 !== 0 && date.getDay() !== 0;
    return {
      date: toLocalDateKey(date),
      available,
      slots: times.map((time, slotIndex) => ({
        time,
        available: available && (slotIndex + index + seed) % 4 !== 0,
      })),
    };
  });
}

export function createAvailabilityFromSchedule(
  schedule: SpacePublishingAvailability,
): SpaceAvailability[] {
  const blockedDates = new Set(schedule.blockedDates);
  const startHour = Number(schedule.startTime.slice(0, 2));
  const endHour = Number(schedule.endTime.slice(0, 2));
  const times = Array.from(
    { length: Math.max(0, endHour - startHour) },
    (_, index) => `${String(startHour + index).padStart(2, "0")}:00`,
  );

  return Array.from({ length: 45 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + index + 1);
    const dateKey = toLocalDateKey(date);
    const available = schedule.weekdays.includes(date.getDay()) && !blockedDates.has(dateKey);
    return {
      date: dateKey,
      available,
      slots: times.map((time) => ({ time, available })),
    };
  });
}

export const spaces: Space[] = [
  {
    id: 1,
    name: "Garagem Central",
    neighborhood: "Vila Mariana",
    city: "São Paulo",
    area: "18 m²",
    areaValue: 18,
    capacity: 4,
    priceValue: 15,
    priceUnit: "dia",
    rating: 4.9,
    reviews: 18,
    feature: "Coberta",
    type: "Garagem",
    purposes: ["Armazenar", "Guardar", "Produzir"],
    amenities: ["Coberta", "Acesso fácil", "Energia"],
    description:
      "Garagem seca, segura e de acesso simples, ideal para guardar móveis, equipamentos ou estacionar por períodos curtos. O espaço tem entrada independente e boa circulação para carga e descarga leve.",
    highlights: [
      "Acesso independente",
      "Ambiente coberto",
      "Entrada no nível da rua",
      "Monitoramento",
    ],
    rules: [
      "Não é permitido armazenar materiais inflamáveis",
      "Acesso mediante agendamento",
      "O espaço deve ser devolvido organizado",
    ],
    image: garagemCentral,
    images: images.garagem,
    latitude: -23.5897,
    longitude: -46.6348,
    availability: createAvailability(1),
  },
  {
    id: 2,
    name: "Sala Criativa",
    neighborhood: "Pinheiros",
    city: "São Paulo",
    area: "24 m²",
    areaValue: 24,
    capacity: 6,
    priceValue: 20,
    priceUnit: "hora",
    rating: 4.8,
    reviews: 24,
    feature: "Com Wi-Fi",
    type: "Sala",
    purposes: ["Trabalhar", "Fotografar", "Criar", "Ensinar"],
    amenities: ["Wi-Fi", "Energia", "Mesa de trabalho"],
    description:
      "Ambiente versátil e iluminado, com grandes janelas e mobiliário flexível. Ideal para pequenos ensaios, produção de conteúdo, reuniões, aulas e trabalhos criativos.",
    highlights: [
      "Iluminação natural",
      "Acesso independente",
      "Mobiliário flexível",
      "Wi-Fi disponível",
    ],
    rules: [
      "Não é permitido fumar",
      "Máximo de 6 pessoas",
      "Animais somente com autorização",
      "O espaço deve ser devolvido organizado",
    ],
    image: salaCriativa,
    images: images.sala,
    latitude: -23.5675,
    longitude: -46.6917,
    availability: createAvailability(2),
  },
  {
    id: 3,
    name: "Depósito 42",
    neighborhood: "Mooca",
    city: "São Paulo",
    area: "12 m²",
    areaValue: 12,
    capacity: 3,
    priceValue: 12,
    priceUnit: "dia",
    rating: 4.7,
    reviews: 12,
    feature: "Com energia",
    type: "Depósito",
    purposes: ["Armazenar", "Guardar"],
    amenities: ["Energia", "Acesso fácil", "Fechado"],
    description:
      "Depósito compacto no térreo, com acesso direto e prateleiras modulares. Uma solução prática para estoque temporário, arquivos e equipamentos de pequeno porte.",
    highlights: ["Acesso térreo", "Prateleiras modulares", "Local seco", "Entrada independente"],
    rules: [
      "Não armazenar alimentos perecíveis",
      "Não são permitidos produtos perigosos",
      "Acesso entre 8h e 20h",
    ],
    image: deposito42,
    images: images.deposito,
    latitude: -23.5608,
    longitude: -46.5905,
    availability: createAvailability(3),
  },
  {
    id: 4,
    name: "Estúdio Luz",
    neighborhood: "Liberdade",
    city: "São Paulo",
    area: "35 m²",
    areaValue: 35,
    capacity: 8,
    priceValue: 35,
    priceUnit: "hora",
    rating: 4.9,
    reviews: 31,
    feature: "Com Wi-Fi",
    type: "Estúdio",
    purposes: ["Fotografar", "Criar", "Produzir"],
    amenities: ["Wi-Fi", "Iluminação", "Energia", "Fundo fotográfico"],
    description:
      "Estúdio de pé-direito alto com luz natural controlável, fundo infinito e apoio para pequenas produções. Funciona bem para retratos, produtos e conteúdo audiovisual.",
    highlights: ["Fundo infinito", "Pé-direito alto", "Luz controlável", "Camarim compacto"],
    rules: [
      "Máximo de 8 pessoas",
      "Equipamentos devem ser operados com cuidado",
      "Não é permitido fumar",
    ],
    image: estudioLuz,
    images: images.estudio,
    latitude: -23.5613,
    longitude: -46.6358,
    availability: createAvailability(4),
  },
  {
    id: 5,
    name: "Oficina Verde",
    neighborhood: "Saúde",
    city: "São Paulo",
    area: "28 m²",
    areaValue: 28,
    capacity: 5,
    priceValue: 25,
    priceUnit: "hora",
    rating: 4.6,
    reviews: 17,
    feature: "Com energia",
    type: "Oficina",
    purposes: ["Criar", "Produzir", "Trabalhar"],
    amenities: ["Energia", "Bancada", "Ferramentas", "Ventilação"],
    description:
      "Oficina arejada, com bancada robusta e pontos de energia para protótipos, reparos, marcenaria leve e aulas práticas em pequenos grupos.",
    highlights: ["Bancada ampla", "Ventilação cruzada", "Piso resistente", "Acesso pelo térreo"],
    rules: [
      "Uso de proteção individual quando necessário",
      "Máximo de 5 pessoas",
      "Limpar a bancada após o uso",
    ],
    image: oficinaVerde,
    images: images.oficina,
    latitude: -23.6126,
    longitude: -46.6297,
    availability: createAvailability(5),
  },
  {
    id: 6,
    name: "Quintal das Árvores",
    neighborhood: "Lapa",
    city: "São Paulo",
    area: "45 m²",
    areaValue: 45,
    capacity: 20,
    priceValue: 30,
    priceUnit: "dia",
    rating: 4.8,
    reviews: 22,
    feature: "Coberta",
    type: "Quintal",
    purposes: ["Fotografar", "Criar", "Ensinar", "Produzir"],
    amenities: ["Coberta", "Área externa", "Energia"],
    description:
      "Quintal arborizado e reservado para encontros, aulas ao ar livre, pequenas celebrações e produções. Uma parte coberta permite usar o espaço mesmo com tempo instável.",
    highlights: [
      "Árvores e sombra",
      "Área parcialmente coberta",
      "Entrada independente",
      "Copa de apoio",
    ],
    rules: [
      "Som ambiente até 21h",
      "Máximo de 20 pessoas",
      "Animais sob responsabilidade do responsável",
      "Recolher resíduos ao final",
    ],
    image: quintalArvores,
    images: images.quintal,
    latitude: -23.5275,
    longitude: -46.7057,
    availability: createAvailability(6),
  },
];

export function getSpaceById(id: string | number) {
  // Futuramente, esta função pode ser substituída por GET /api/spaces/:id/.
  return spaces.find((space) => String(space.id) === String(id));
}

export function formatSpacePrice(space: Pick<Space, "priceValue" | "priceUnit">) {
  const value = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(space.priceValue);
  return `${value} / ${space.priceUnit}`;
}
