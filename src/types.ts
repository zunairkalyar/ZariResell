export interface Brand {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  hidden: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface ProductVariant {
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  id: string;
  brandId: string;
  brandName: string; // snapshot for speed/persistence
  categoryId: string;
  title: string;
  code: string; // SKU
  fabric: string;
  pieces: string; // e.g. "3-Piece", "2-Piece", "Kurti"
  description: string;
  careInstructions: string;
  images: string[]; // multi-image support
  featured: boolean;
  newArrival: boolean;
  hidden: boolean;
  variants: ProductVariant[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  brandName: string;
  code: string;
  size: string;
  color: string;
  quantity: number;
  price: number; // Unit price applied at order time
  imageUrl?: string;
}

export interface Order {
  id: string; // Order number like ZARI-10042
  orderDate: string;
  customerName: string;
  customerMobile: string;
  customerWhatsApp: string;
  customerEmail?: string;
  province: string;
  city: string;
  address: string;
  landmark?: string;
  notes?: string;
  items: OrderItem[];
  totalItems: number;
  ratePerPiece: number;
  subtotal: number;
  shippingCost: number;
  finalTotal: number;
  paymentMethod: string; // "COD" | "Bank Transfer" | "JazzCash" | "EasyPaisa"
  paymentScreenshot?: string; // base64 or path
  status: 'Pending' | 'Payment Pending' | 'Payment Confirmed' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned' | 'Exchanged';
}

export interface PaymentAccount {
  method: string; // "Bank Transfer" | "JazzCash" | "EasyPaisa"
  title: string;
  number: string;
  instructions: string;
}

export interface PricingTier {
  id: string;
  name: string;
  minQty: number;
  maxQty: number | null; // null means no upper limit (e.g. 10+)
  rate: number;
}

export interface StoreSettings {
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  flatShippingFee: number;
  freeShippingThreshold: number;
  shippingTimeEstimate: string;
  codAvailable: boolean;
  paymentAccounts: PaymentAccount[];
  tiers: PricingTier[];
  pages: {
    aboutUs: string;
    contactUs: string;
    shipPolicy: string;
    returnPolicy: string;
    privacyPolicy: string;
    terms: string;
    paymentPolicy: string;
  };
}

export interface DatabaseSchema {
  brands: Brand[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  settings: StoreSettings;
}
