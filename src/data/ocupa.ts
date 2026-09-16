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
  area: string;
  price: string;
  rating: number;
  reviews: number;
  feature: string;
  image: string;
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
  { id: 1, name: "Garagem Central", neighborhood: "Vila Mariana", area: "18 m²", price: "R$ 15/dia", rating: 4.9, reviews: 18, feature: "Coberta", image: garagemCentral },
  { id: 2, name: "Sala Criativa", neighborhood: "Pinheiros", area: "24 m²", price: "R$ 20/h", rating: 4.8, reviews: 24, feature: "Com Wi-Fi", image: salaCriativa },
  { id: 3, name: "Depósito 42", neighborhood: "Mooca", area: "12 m²", price: "R$ 12/dia", rating: 4.7, reviews: 12, feature: "Com energia", image: deposito42 },
  { id: 4, name: "Estúdio Luz", neighborhood: "Liberdade", area: "35 m²", price: "R$ 35/h", rating: 4.9, reviews: 31, feature: "Com Wi-Fi", image: estudioLuz },
  { id: 5, name: "Oficina Verde", neighborhood: "Saúde", area: "28 m²", price: "R$ 25/h", rating: 4.6, reviews: 17, feature: "Com energia", image: oficinaVerde },
  { id: 6, name: "Quintal das Árvores", neighborhood: "Lapa", area: "45 m²", price: "R$ 30/dia", rating: 4.8, reviews: 22, feature: "Coberta", image: quintalArvores },
];