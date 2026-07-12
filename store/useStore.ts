import { create } from 'zustand';
import { CafeItem, Sale, Settings, KitchenSettlement, Extra } from '../types';
import { initialItems, initialSettings, initialExtras, initialSales, initialSettlements } from '../data/initialData';
import { ref, onValue, set as firebaseSet, get, child } from "firebase/database";
import { db } from "../lib/firebase";

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

export const useStore = create<AppState>((setStore, getStore) => ({
  items: initialItems,
  sales: initialSales,
  extras: initialExtras,
  settings: initialSettings,
  settlements: initialSettlements,
  
  addItem: (item) => {
    const newItem = { ...item, id: crypto.randomUUID() };
    const state = getStore();
    firebaseSet(ref(db, 'items'), [...state.items, newItem]);
  },
  
  updateItem: (id, data) => {
    const state = getStore();
    firebaseSet(ref(db, 'items'), state.items.map(item => item.id === id ? { ...item, ...data } : item));
  },
  
  deleteItem: (id) => {
    const state = getStore();
    firebaseSet(ref(db, 'items'), state.items.filter(item => item.id !== id));
  },
  
  addExtra: (extra) => {
    const newExtra = { ...extra, id: crypto.randomUUID() };
    const state = getStore();
    firebaseSet(ref(db, 'extras'), [...state.extras, newExtra]);
  },
  
  updateExtra: (id, data) => {
    const state = getStore();
    firebaseSet(ref(db, 'extras'), state.extras.map(e => e.id === id ? { ...e, ...data } : e));
  },
  
  deleteExtra: (id) => {
    const state = getStore();
    firebaseSet(ref(db, 'extras'), state.extras.filter(e => e.id !== id));
  },
  
  addSale: (sale) => {
    const newSale = { ...sale, id: crypto.randomUUID() };
    const state = getStore();
    firebaseSet(ref(db, 'sales'), [...state.sales, newSale]);
  },
  
  updateSale: (id, data) => {
    const state = getStore();
    firebaseSet(ref(db, 'sales'), state.sales.map(sale => sale.id === id ? { ...sale, ...data } : sale));
  },
  
  deleteSale: (id) => {
    const state = getStore();
    firebaseSet(ref(db, 'sales'), state.sales.filter(sale => sale.id !== id));
  },
  
  updateSettings: (settings) => {
    firebaseSet(ref(db, 'settings'), settings);
  },
  
  addSettlement: (settlement) => {
    const newSettlement = { ...settlement, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
    const state = getStore();
    firebaseSet(ref(db, 'settlements'), [...state.settlements, newSettlement]);
  },
  
  deleteSettlement: (id) => {
    const state = getStore();
    firebaseSet(ref(db, 'settlements'), state.settlements.filter(s => s.id !== id));
  },
  
  undoLastSettlement: () => {
    const state = getStore();
    if (state.settlements.length === 0) return;
    const newSettlements = [...state.settlements];
    newSettlements.pop();
    firebaseSet(ref(db, 'settlements'), newSettlements);
  },
  
  importData: (data) => {
    if (data.items) firebaseSet(ref(db, 'items'), data.items);
    if (data.sales) firebaseSet(ref(db, 'sales'), data.sales);
    if (data.extras) firebaseSet(ref(db, 'extras'), data.extras);
    if (data.settings) firebaseSet(ref(db, 'settings'), data.settings);
    if (data.settlements) firebaseSet(ref(db, 'settlements'), data.settlements);
  },
}));

let isInitialized = false;

export const initFirebase = async () => {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, '/'));
  
  if (!snapshot.exists() || !snapshot.val().items) {
    console.log("Seeding Firebase with initial backup data...");
    await firebaseSet(ref(db, '/'), {
      items: initialItems,
      sales: initialSales,
      extras: initialExtras,
      settings: initialSettings,
      settlements: initialSettlements
    });
  }

  // Set up real-time listeners
  onValue(ref(db, 'items'), (snapshot) => {
    if (snapshot.exists()) useStore.setState({ items: snapshot.val() || [] });
  });
  
  onValue(ref(db, 'sales'), (snapshot) => {
    if (snapshot.exists()) useStore.setState({ sales: Object.values(snapshot.val() || {}) });
  });
  
  onValue(ref(db, 'extras'), (snapshot) => {
    if (snapshot.exists()) useStore.setState({ extras: snapshot.val() || [] });
  });
  
  onValue(ref(db, 'settings'), (snapshot) => {
    if (snapshot.exists()) useStore.setState({ settings: snapshot.val() || initialSettings });
  });
  
  onValue(ref(db, 'settlements'), (snapshot) => {
    if (snapshot.exists()) useStore.setState({ settlements: snapshot.val() || [] });
  });
};
