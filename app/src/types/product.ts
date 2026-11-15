export type Brand = "NVIDIA" | "AMD";

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string; // ISO date
}

export interface Product {
  id: string;
  brand: Brand;
  manufacturer: string; // ASUS, MSI, Gigabyte, Sapphire, etc.
  name: string; // full product name
  series: string; // e.g. "RTX 4070", "RX 7800 XT"
  vramGb: number;
  cudaOrStreamCores: number;
  boostClockMhz: number;
  tdpWatts: number;
  price: number; // KRW
  stock: number;
  imageColor: string; // placeholder color for card art
  releaseYear: number;
  reviews: Review[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface WishlistState {
  productIds: string[];
}

export interface ShippingInfo {
  name: string;
  phone: string;
  address: string;
  addressDetail: string;
}

export interface Order {
  orderNumber: string;
  items: { product: Product; quantity: number }[];
  shipping: ShippingInfo;
  totalPrice: number;
  createdAt: string;
}
