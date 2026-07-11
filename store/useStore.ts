import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CafeItem, Sale, Settings, KitchenSettlement, Extra } from '../types';
import { initialItems, initialSettings, initialExtras, initialSales, initialSettlements } from '../data/initialData';

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
      sales: initialSales,
      extras: initialExtras,
      settings: initialSettings,
      settlements: initialSettlements,
      
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
      version: 6,
      migrate: (persistedState: any, version) => {
        // Version 6 completely resets the local storage to use the newly baked initialData.ts
        // This ensures the Vercel deployment instantly reflects the user's custom JSON data
        return undefined as any;
      },
    }
  )
);
