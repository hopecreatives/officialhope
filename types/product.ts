export type ProductCategory =
  | "Cameras"
  | "Lenses"
  | "Gimbals"
  | "Lights"
  | "Tripods"
  | "Recorders"
  | "Laptop"
  | "MacBook"
  | "iPhone";

export type ProductCondition = "New" | "Used";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  createdAt?: string;
  category: ProductCategory;
  brand: string;
  condition: ProductCondition;
  priceRWF: number;
  inStock: boolean;
  shortDesc: string;
  description: string;
  specs: ProductSpec[];
  images: string[];
  featured: boolean;
}
