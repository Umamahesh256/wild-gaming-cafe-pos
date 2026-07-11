import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CafeItem, Sale, Settings, KitchenSettlement, Extra } from '../types';
import { initialItems, initialSettings, initialExtras } from '../data/initialData';

interface AppState {
  items: CafeItem[];
  sales: Sale[];
  extras: Extra[];
  settings: Settings;
  settlements: KitchenSettlement[];
  
  // Actions
  addItem: (item: Omit<CafeItem, 'id'>) => void;
  updateItem: (id: string, data: Partial<CafeItem>) => void;
  deleteItem: (id: string) => void;
  
  addExtra: (extra: Omit<Extra, 'id'>) => void;
  updateExtra: (id: string, data: Partial<Extra>) => void;
  deleteExtra: (id: string) => void;
  
  addSale: (sale: Omit<Sale, 'id'>) => void;
  updateSale: (id: string, data: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
  
  updateSettings: (settings: Settings) => void;
  
  addSettlement: (settlement: Omit<KitchenSettlement, 'id' | 'timestamp'>) => void;
  deleteSettlement: (id: string) => void;
  undoLastSettlement: () => void;
  
  importData: (data: Partial<AppState>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      items: initialItems,
      // Clear legacy sales during this update so the app doesn't crash on old schema
      sales: [],
      extras: initialExtras,
      settings: initialSettings,
      settlements: [],
      
      addItem: (item) => set((state) => ({
        items: [...state.items, { ...item, id: crypto.randomUUID() }]
      })),
      
      updateItem: (id, data) => set((state) => ({
        items: state.items.map(item => item.id === id ? { ...item, ...data } : item)
      })),
      
      deleteItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      
      addExtra: (extra) => set((state) => ({
        extras: [...state.extras, { ...extra, id: crypto.randomUUID() }]
      })),
      
      updateExtra: (id, data) => set((state) => ({
        extras: state.extras.map(e => e.id === id ? { ...e, ...data } : e)
      })),
      
      deleteExtra: (id) => set((state) => ({
        extras: state.extras.filter(e => e.id !== id)
      })),
      
      addSale: (sale) => set((state) => ({
        sales: [...state.sales, { ...sale, id: crypto.randomUUID() }]
      })),
      
      updateSale: (id, data) => set((state) => ({
        sales: state.sales.map(sale => sale.id === id ? { ...sale, ...data } : sale)
      })),
      
      deleteSale: (id) => set((state) => ({
        sales: state.sales.filter(sale => sale.id !== id)
      })),
      
      updateSettings: (settings) => set({ settings }),
      
      addSettlement: (settlement) => set((state) => ({
        settlements: [...state.settlements, { ...settlement, id: crypto.randomUUID(), timestamp: new Date().toISOString() }]
      })),
      
      deleteSettlement: (id) => set((state) => ({
        settlements: state.settlements.filter(s => s.id !== id)
      })),
      
      undoLastSettlement: () => set((state) => {
        if (state.settlements.length === 0) return state;
        const newSettlements = [...state.settlements];
        newSettlements.pop(); // Remove the last one added
        return { settlements: newSettlements };
      }),
      
      importData: (data) => set((state) => ({ ...state, ...data })),
    }),
    {
      name: 'cafe-dashboard-storage',
      version: 5,
      migrate: (persistedState: any, version) => {
        // If coming from v1 without extras, inject initialExtras
        if (!persistedState.extras) {
          persistedState.extras = initialExtras;
        } else {
          // Migrate old extras that had 'price' instead of 'cafePrice'
          persistedState.extras = persistedState.extras.map((e: any) => {
            if (e.price !== undefined && e.cafePrice === undefined) {
              return { ...e, cafePrice: e.price, kitchenCost: 0 };
            }
            return e;
          });
        }
        
        // Deduplicate items
        if (persistedState.items) {
          const uniqueItems = new Map();
          persistedState.items.forEach((item: any) => {
            if (!uniqueItems.has(item.name)) {
              uniqueItems.set(item.name, item);
            }
          });
          persistedState.items = Array.from(uniqueItems.values());
        }

        // Migrate settlements to new schema
        if (persistedState.settlements) {
          persistedState.settlements = persistedState.settlements.map((s: any) => {
            if (s.kitchenPayable === undefined) {
              return {
                ...s,
                kitchenPayable: s.amountPaid,
                remainingAmount: 0,
                status: 'Paid',
                paymentMethod: 'Cash',
                notes: 'Migrated legacy settlement'
              };
            }
            return s;
          });
        }

        // If sales have the old schema (e.g. they have itemId directly on the sale instead of an items array)
        if (persistedState.sales && persistedState.sales.length > 0) {
          if (persistedState.sales[0].itemId !== undefined) {
             persistedState.sales = []; // wipe legacy sales to prevent crash
          }
        }
        return persistedState;
      },
    }
  )
);
