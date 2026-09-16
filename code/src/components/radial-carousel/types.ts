export interface JewelryItem {
  id: string;
  title: string;
  category: string;
  tag: string;
  purity: '10K' | '14K' | '18K' | 'Plata 925';
  weight?: string;
  price: number;
  imageUrl: string;
  description: string;
}

export interface EditorialContact {
  phone: string;
  displayPhone: string;
  email: string;
  brandName: string;
  locationLine1: string;
  locationLine2: string;
}

export interface RadialEditorialCollection {
  id: string;
  monogram: string; // e.g. "LB" for La Bonita
  year: string | number; // e.g. "2026"
  collectionTitle: string; // e.g. "COLECCIÓN ORO 10K & 14K"
  tagline?: string;
  contact: EditorialContact;
  items: JewelryItem[];
}

export interface RadialSectorProps {
  key?: any;
  item: JewelryItem;
  index: number;
  total: number;
  startAngleDeg: number;
  endAngleDeg: number;
  innerRadius: number;
  outerRadius: number;
  cx: number;
  cy: number;
  isActive: boolean;
  onSelect: (index: number) => void;
}

export interface PneumaRadialCarouselProps {
  data?: RadialEditorialCollection;
  className?: string;
  onItemChange?: (item: JewelryItem, index: number) => void;
}
