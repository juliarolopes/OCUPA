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

import garagemCentral from "@/assets/garagem-central.jpg";
import salaCriativa from "@/assets/sala-criativa.jpg";
import deposito42 from "@/assets/deposito-42.jpg";
import estudioLuz from "@/assets/estudio-luz.jpg";
import oficinaVerde from "@/assets/oficina-verde.jpg";
import quintalArvores from "@/assets/quintal-arvores.jpg";

export type Category = {
  label: string;
  icon: LucideIcon;
};

export type Space = {
  id: number;
  name: string;
  neighborhood: string;
  city: string;
  area: string;
  areaValue: number;
  priceValue: number;
  priceUnit: "hora" | "dia";
  rating: number;
  reviews: number;
  feature: string;
  image: string;
  type: string;
  purposes: string[];
  amenities: string[];
  latitude: number;
  longitude: number;
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

export const spaces: Space[] = [
  {
    id: 1,
    name: "Garagem Central",
    neighborhood: "Vila Mariana",
    city: "São Paulo",
    area: "18 m²",
    areaValue: 18,
    priceValue: 15,
    priceUnit: "dia",
    rating: 4.9,
    reviews: 18,
    feature: "Coberta",
    image: garagemCentral,
    type: "Garagem",
    purposes: ["Armazenar", "Guardar", "Produzir"],
    amenities: ["Coberta", "Acesso fácil", "Energia"],
    latitude: -23.5897,
    longitude: -46.6348,
  },
  {
    id: 2,
    name: "Sala Criativa",
    neighborhood: "Pinheiros",
    city: "São Paulo",
    area: "24 m²",
    areaValue: 24,
    priceValue: 20,
    priceUnit: "hora",
    rating: 4.8,
    reviews: 24,
    feature: "Com Wi-Fi",
    image: salaCriativa,
    type: "Sala",
    purposes: ["Trabalhar", "Fotografar", "Criar", "Ensinar"],
    amenities: ["Wi-Fi", "Energia", "Mesa de trabalho"],
    latitude: -23.5675,
    longitude: -46.6917,
  },
  {
    id: 3,
    name: "Depósito 42",
    neighborhood: "Mooca",
    city: "São Paulo",
    area: "12 m²",
    areaValue: 12,
    priceValue: 12,
    priceUnit: "dia",
    rating: 4.7,
    reviews: 12,
    feature: "Com energia",
    image: deposito42,
    type: "Depósito",
    purposes: ["Armazenar", "Guardar"],
    amenities: ["Energia", "Acesso fácil", "Fechado"],
    latitude: -23.5608,
    longitude: -46.5905,
  },
  {
    id: 4,
    name: "Estúdio Luz",
    neighborhood: "Liberdade",
    city: "São Paulo",
    area: "35 m²",
    areaValue: 35,
    priceValue: 35,
    priceUnit: "hora",
    rating: 4.9,
    reviews: 31,
    feature: "Com Wi-Fi",
    image: estudioLuz,
    type: "Estúdio",
    purposes: ["Fotografar", "Criar", "Produzir"],
    amenities: ["Wi-Fi", "Iluminação", "Energia", "Fundo fotográfico"],
    latitude: -23.5613,
    longitude: -46.6358,
  },
  {
    id: 5,
    name: "Oficina Verde",
    neighborhood: "Saúde",
    city: "São Paulo",
    area: "28 m²",
    areaValue: 28,
    priceValue: 25,
    priceUnit: "hora",
    rating: 4.6,
    reviews: 17,
    feature: "Com energia",
    image: oficinaVerde,
    type: "Oficina",
    purposes: ["Criar", "Produzir", "Trabalhar"],
    amenities: ["Energia", "Bancada", "Ferramentas", "Ventilação"],
    latitude: -23.6126,
    longitude: -46.6297,
  },
  {
    id: 6,
    name: "Quintal das Árvores",
    neighborhood: "Lapa",
    city: "São Paulo",
    area: "45 m²",
    areaValue: 45,
    priceValue: 30,
    priceUnit: "dia",
    rating: 4.8,
    reviews: 22,
    feature: "Coberta",
    image: quintalArvores,
    type: "Quintal",
    purposes: ["Fotografar", "Criar", "Ensinar", "Produzir"],
    amenities: ["Coberta", "Área externa", "Energia"],
    latitude: -23.5275,
    longitude: -46.7057,
  },
];