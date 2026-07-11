export type Category = 
  | 'Veg Starters'
  | 'Non Veg Starters'
  | 'Veg Fried Rice'
  | 'Non Veg Fried Rice'
  | 'Veg Noodles'
  | 'Non Veg Noodles'
  | 'Biryani'
  | 'Beverages'
  | 'Veg Combos'
  | 'Non Veg Combos';

export interface CafeItem {
  id: string;
  name: string;
  category: Category;
  cafePrice: number;
  kitchenCost: number | null;
  status: 'Available' | 'Out of Stock';
}

export type PaymentType = 'Cash' | 'UPI' | 'Card';

export interface Extra {
  id: string;
  name: string;
  cafePrice: number;
  kitchenCost: number;
  isActive: boolean;
}

export interface CartItem {
  id: string; // unique for the cart entry
  itemId: string;
  quantity: number;
  extras: Extra[]; // snapshot of extras applied
  cafePrice: number; // base price at time of sale
  kitchenCost: number; // kitchen cost at time of sale
}

export interface Sale {
  id: string;
  timestamp: string;
  items: CartItem[];
  totalAmount: number;
  totalKitchenCost: number;
  totalProfit: number;
  paymentType: PaymentType;
}

export interface Settings {
  cafeName: string;
  phone: string;
  address: string;
  kitchenName: string;
}

export type SettlementPaymentMethod = 'Cash' | 'UPI' | 'Bank Transfer' | 'Other';
export type SettlementStatus = 'Pending' | 'Partially Paid' | 'Paid';

export interface KitchenSettlement {
  id: string;
  timestamp: string;
  kitchenPayable: number;
  amountPaid: number;
  remainingAmount: number;
  status: SettlementStatus;
  paymentMethod: SettlementPaymentMethod;
  notes?: string;
}
