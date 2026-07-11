import { CafeItem, Settings, Extra } from '../types';

export const initialItems: CafeItem[] = [
  // Veg Starters
  { id: 'v-s-1', name: 'Veg Manchuria', category: 'Veg Starters', cafePrice: 160, kitchenCost: null, status: 'Available' },
  { id: 'v-s-2', name: 'Crispy Veg', category: 'Veg Starters', cafePrice: 160, kitchenCost: null, status: 'Available' },
  { id: 'v-s-3', name: 'Paneer 65', category: 'Veg Starters', cafePrice: 175, kitchenCost: null, status: 'Available' },

  // Veg Fried Rice
  { id: 'v-f-1', name: 'Veg Fried Rice', category: 'Veg Fried Rice', cafePrice: 130, kitchenCost: null, status: 'Available' },
  { id: 'v-f-2', name: 'Veg Manchurian Fried Rice', category: 'Veg Fried Rice', cafePrice: 160, kitchenCost: null, status: 'Available' },
  { id: 'v-f-3', name: 'Paneer Rice', category: 'Veg Fried Rice', cafePrice: 175, kitchenCost: null, status: 'Available' },
  { id: 'v-f-4', name: 'Veg Schezwan Fried Rice', category: 'Veg Fried Rice', cafePrice: 170, kitchenCost: null, status: 'Available' },
  { id: 'v-f-5', name: 'Veg Soft Fried Rice', category: 'Veg Fried Rice', cafePrice: 130, kitchenCost: null, status: 'Available' },
  { id: 'v-f-6', name: 'Veg Manchurian Soft Fried Rice', category: 'Veg Fried Rice', cafePrice: 160, kitchenCost: null, status: 'Available' },

  // Veg Noodles
  { id: 'v-n-1', name: 'Veg Noodles', category: 'Veg Noodles', cafePrice: 130, kitchenCost: null, status: 'Available' },

  // Non-Veg Starters (Prices were cut off in image, using placeholders)
  { id: 'nv-s-1', name: 'Chicken 65', category: 'Non Veg Starters', cafePrice: 200, kitchenCost: null, status: 'Available' },
  { id: 'nv-s-2', name: 'Chilly Chicken', category: 'Non Veg Starters', cafePrice: 200, kitchenCost: null, status: 'Available' },
  { id: 'nv-s-3', name: 'Chicken Manchuria', category: 'Non Veg Starters', cafePrice: 200, kitchenCost: null, status: 'Available' },
  { id: 'nv-s-4', name: 'Chicken Pakodi', category: 'Non Veg Starters', cafePrice: 200, kitchenCost: null, status: 'Available' },

  // Non-Veg Fried Rice (Prices were cut off in image, using placeholders)
  { id: 'nv-f-1', name: 'Double Egg Fried Rice', category: 'Non Veg Fried Rice', cafePrice: 150, kitchenCost: null, status: 'Available' },
  { id: 'nv-f-2', name: 'Chicken Fried Rice', category: 'Non Veg Fried Rice', cafePrice: 180, kitchenCost: null, status: 'Available' },
  { id: 'nv-f-3', name: 'Egg Schezwan Fried Rice', category: 'Non Veg Fried Rice', cafePrice: 160, kitchenCost: null, status: 'Available' },
  { id: 'nv-f-4', name: 'Chicken Schezwan Fried Rice', category: 'Non Veg Fried Rice', cafePrice: 190, kitchenCost: null, status: 'Available' },
  { id: 'nv-f-5', name: 'Double Egg Soft Fried Rice', category: 'Non Veg Fried Rice', cafePrice: 150, kitchenCost: null, status: 'Available' },
  { id: 'nv-f-6', name: 'Chicken Soft Fried Rice', category: 'Non Veg Fried Rice', cafePrice: 180, kitchenCost: null, status: 'Available' },

  // Non-Veg Noodles (Prices were cut off in image, using placeholders)
  { id: 'nv-n-1', name: 'Double Egg Noodles', category: 'Non Veg Noodles', cafePrice: 150, kitchenCost: null, status: 'Available' },

  // Biryani
  { id: 'b-1', name: 'Veg Biryani', category: 'Biryani', cafePrice: 200, kitchenCost: null, status: 'Available' },
  { id: 'b-2', name: 'Chicken Dum Biryani', category: 'Biryani', cafePrice: 250, kitchenCost: null, status: 'Available' },
  { id: 'b-3', name: 'Mutton Biryani', category: 'Biryani', cafePrice: 320, kitchenCost: null, status: 'Available' },

  // Beverages
  { id: 'bev-1', name: 'Coke (250ml)', category: 'Beverages', cafePrice: 40, kitchenCost: null, status: 'Available' },
  { id: 'bev-2', name: 'Thumbs Up (250ml)', category: 'Beverages', cafePrice: 40, kitchenCost: null, status: 'Available' },
  { id: 'bev-3', name: 'Cold Coffee', category: 'Beverages', cafePrice: 120, kitchenCost: null, status: 'Available' },

  // Veg Combos
  { id: 'vc-1', name: 'Veg Fried Rice + Manchurian', category: 'Veg Combos', cafePrice: 220, kitchenCost: null, status: 'Available' },
  { id: 'vc-2', name: 'Veg Noodles + Chilli Paneer', category: 'Veg Combos', cafePrice: 240, kitchenCost: null, status: 'Available' },

  // Non Veg Combos
  { id: 'nvc-1', name: 'Chicken Fried Rice + Chilli Chicken', category: 'Non Veg Combos', cafePrice: 280, kitchenCost: null, status: 'Available' },
  { id: 'nvc-2', name: 'Chicken Noodles + Chicken Manchuria', category: 'Non Veg Combos', cafePrice: 280, kitchenCost: null, status: 'Available' },
];

export const initialSettings: Settings = {
  cafeName: 'My Awesome Cafe',
  phone: '+91 9876543210',
  address: '123 Coffee Street, Food City',
  kitchenName: 'Cloud Kitchen Hub',
};

export const initialExtras: Extra[] = [
  { id: 'ext-1', name: 'Extra Chicken', cafePrice: 50, kitchenCost: 0, isActive: true },
  { id: 'ext-2', name: 'Extra Egg', cafePrice: 20, kitchenCost: 0, isActive: true },
  { id: 'ext-3', name: 'Extra Cheese', cafePrice: 30, kitchenCost: 0, isActive: true },
  { id: 'ext-4', name: 'Extra Paneer', cafePrice: 40, kitchenCost: 0, isActive: true },
  { id: 'ext-5', name: 'Extra Butter', cafePrice: 15, kitchenCost: 0, isActive: true },
  { id: 'ext-6', name: 'Extra Sauce', cafePrice: 10, kitchenCost: 0, isActive: true },
  { id: 'ext-7', name: 'Extra Mayo', cafePrice: 15, kitchenCost: 0, isActive: true },
  { id: 'ext-8', name: 'Extra Rice', cafePrice: 40, kitchenCost: 0, isActive: true },
];
