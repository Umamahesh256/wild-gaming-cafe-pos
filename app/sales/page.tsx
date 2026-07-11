"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Minus, Search, ShoppingCart, X } from "lucide-react";
import { format } from "date-fns";
import { CartItem, Category, Extra, PaymentType, CafeItem } from "@/types";

const vegCategories: Category[] = ["Veg Starters", "Veg Fried Rice", "Veg Noodles", "Veg Combos"];
const nonVegCategories: Category[] = ["Non Veg Starters", "Non Veg Fried Rice", "Non Veg Noodles", "Non Veg Combos"];
const biryaniCategories: Category[] = ["Biryani"];

export default function SalesEntry() {
  const { items, extras, addSale } = useStore();
  
  // States
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentType, setPaymentType] = useState<PaymentType>("Cash");
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Modals
  const [activeCartIndex, setActiveCartIndex] = useState<number | null>(null);

  // Filtering items by search
  const filteredItems = items.filter(i => i.status === 'Available' && i.name.toLowerCase().includes(search.toLowerCase()));

  // Cart Actions
  const addToCart = (item: CafeItem) => {
    setCart(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        itemId: item.id,
        quantity: 1,
        extras: [],
        cafePrice: item.cafePrice,
        kitchenCost: item.kitchenCost || 0
      }
    ]);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const newCart = [...prev];
      newCart[index].quantity += delta;
      if (newCart[index].quantity <= 0) {
        newCart.splice(index, 1);
      }
      if (newCart.length === 0) {
        setIsMobileCartOpen(false);
      }
      return newCart;
    });
  };

  const toggleExtra = (extra: Extra) => {
    if (activeCartIndex === null) return;
    setCart(prev => {
      const newCart = [...prev];
      const item = { ...newCart[activeCartIndex] };
      
      const hasExtra = item.extras.some(e => e.id === extra.id);
      if (hasExtra) {
        item.extras = item.extras.filter(e => e.id !== extra.id);
      } else {
        item.extras = [...item.extras, extra];
      }
      
      newCart[activeCartIndex] = item;
      return newCart;
    });
  };

  // Calculations
  const getCartTotals = () => {
    let itemsTotal = 0;
    let extrasTotal = 0;
    let kitchenTotal = 0;
    
    cart.forEach(item => {
      const itemBase = item.cafePrice * item.quantity;
      const extraCost = item.extras.reduce((acc, curr) => acc + curr.cafePrice, 0) * item.quantity;
      const extraKitchen = item.extras.reduce((acc, curr) => acc + curr.kitchenCost, 0) * item.quantity;
      
      itemsTotal += itemBase;
      extrasTotal += extraCost;
      kitchenTotal += (item.kitchenCost * item.quantity) + extraKitchen;
    });

    const grandTotal = itemsTotal + extrasTotal;
    const profit = grandTotal - kitchenTotal;

    return { itemsTotal, extrasTotal, grandTotal, kitchenTotal, profit };
  };

  const totals = getCartTotals();
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCompleteOrder = () => {
    if (cart.length === 0) return;
    
    addSale({
      timestamp: new Date().toISOString(),
      items: cart,
      totalAmount: totals.grandTotal,
      totalKitchenCost: totals.kitchenTotal,
      totalProfit: totals.profit,
      paymentType
    });

    setCart([]);
    setPaymentType("Cash");
    setIsMobileCartOpen(false);
    
    // Show quick toast
    setToastMessage("Order Completed successfully!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Render Category Grids
  const renderCategoryGroup = (categories: Category[]) => {
    const presentCategories = categories.filter(cat => filteredItems.some(i => i.category === cat) || search === "");
    
    return presentCategories.map(cat => {
      const catItems = filteredItems.filter(i => i.category === cat);
      if (catItems.length === 0 && search !== "") return null;

      return (
        <div key={cat} id={`category-${cat}`} className="mb-8 pt-2">
          <h3 className="text-lg md:text-xl font-bold tracking-tight uppercase text-primary mb-3">{cat}</h3>
          <div className="flex flex-col gap-2 md:gap-3">
            {catItems.map(item => (
              <Button 
                key={item.id} 
                variant="outline" 
                className="w-full min-h-[48px] md:min-h-[56px] h-auto py-2 px-4 flex justify-between items-center text-left bg-card border-border hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm group rounded-md"
                onClick={() => addToCart(item)}
              >
                <span className="font-semibold leading-tight whitespace-normal max-w-[70%] text-foreground group-hover:text-primary-foreground">{item.name}</span>
                <span className="font-bold text-primary group-hover:text-primary-foreground transition-colors shrink-0">₹{item.cafePrice}</span>
              </Button>
            ))}
            {catItems.length === 0 && <div className="text-sm text-muted-foreground py-2">No items found.</div>}
          </div>
        </div>
      );
    });
  };

  const CartUI = () => (
    <div className="flex-1 flex flex-col h-full bg-card">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cart.length === 0 ? (
          <div className="h-full min-h-[150px] flex flex-col items-center justify-center text-muted-foreground opacity-50">
            <ShoppingCart className="h-12 w-12 mb-2" />
            <p>Cart is empty</p>
          </div>
        ) : (
          cart.map((cartItem, index) => {
            const itemData = items.find(i => i.id === cartItem.itemId);
            const itemExtrasCost = cartItem.extras.reduce((acc, curr) => acc + curr.cafePrice, 0);
            return (
              <div key={cartItem.id} className="flex flex-col gap-2 p-3 bg-background rounded-md border border-border">
                <div className="flex justify-between items-start">
                  <div className="font-semibold">{itemData?.name || "Deleted"}</div>
                  <div className="font-bold text-primary">₹{(cartItem.cafePrice + itemExtrasCost) * cartItem.quantity}</div>
                </div>
                
                {cartItem.extras.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Extras: {cartItem.extras.map(e => `${e.name} (₹${e.cafePrice})`).join(', ')}
                  </div>
                )}

                <div className="flex items-center justify-between mt-2">
                  <Button variant="link" size="sm" className="h-8 px-0 text-xs md:text-sm text-primary" onClick={() => setActiveCartIndex(index)}>
                    + Add Extras
                  </Button>
                  <div className="flex items-center gap-2 bg-background border rounded-md">
                    <Button variant="ghost" size="icon" className="h-8 w-8 md:h-7 md:w-7 rounded-none" onClick={() => updateQuantity(index, -1)}><Minus className="h-4 w-4 md:h-3 md:w-3" /></Button>
                    <span className="text-sm md:text-base font-bold w-8 md:w-6 text-center">{cartItem.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 md:h-7 md:w-7 rounded-none border-l" onClick={() => updateQuantity(index, 1)}><Plus className="h-4 w-4 md:h-3 md:w-3" /></Button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
      
      <div className="bg-muted/30 p-4 border-t border-border space-y-3">
        <div className="flex justify-between text-sm md:text-base"><span className="text-muted-foreground">Items Total</span><span>₹{totals.itemsTotal}</span></div>
        <div className="flex justify-between text-sm md:text-base"><span className="text-muted-foreground">Extras Total</span><span>₹{totals.extrasTotal}</span></div>
        <div className="flex justify-between text-xl md:text-2xl font-black text-primary border-t border-border pt-3"><span>Grand Total</span><span>₹{totals.grandTotal}</span></div>
        
        <Select value={paymentType} onValueChange={(v) => v && setPaymentType(v as PaymentType)}>
          <SelectTrigger className="w-full h-12 md:h-10 bg-background border-border focus:ring-primary"><SelectValue placeholder="Payment Method" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="UPI">UPI</SelectItem>
            <SelectItem value="Card">Card</SelectItem>
          </SelectContent>
        </Select>
        
        <Button className="w-full font-bold h-14 md:h-12 text-lg bg-primary hover:bg-primary/90 text-primary-foreground" disabled={cart.length === 0} onClick={handleCompleteOrder}>
          Complete Order
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 min-h-screen flex flex-col gap-6 pb-24 md:pb-6 relative">
      {/* SUCCESS TOAST */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm animate-in fade-in slide-in-from-top-4">
          {toastMessage}
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="hidden md:block text-2xl font-bold tracking-tight">Sales Entry</h2>
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-2.5 md:top-2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Quick Search Menu..." 
            className="pl-10 h-12 md:h-10 w-full bg-card border-border shadow-sm focus-visible:ring-primary text-base" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        
        {/* LEFT PANEL: MENU (Full width on Mobile/Tablet, 8 cols on Desktop) */}
        <div className="col-span-1 lg:col-span-8 bg-card rounded-xl border border-border overflow-hidden shadow-sm flex flex-col lg:max-h-[calc(100vh-140px)]">
          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6 pt-4 relative scroll-smooth">
            
            {/* DESKTOP LAYOUT (2 Columns inside) */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-8">
                <div>{renderCategoryGroup(vegCategories)}</div>
                <div>{renderCategoryGroup(nonVegCategories)}</div>
              </div>
              <div className="mt-4 border-t border-border pt-6">
                 {renderCategoryGroup(biryaniCategories)}
              </div>
            </div>

            {/* MOBILE & TABLET LAYOUT (1 Column continuous scroll) */}
            <div className="block lg:hidden">
              {renderCategoryGroup(vegCategories)}
              {renderCategoryGroup(nonVegCategories)}
              {renderCategoryGroup(biryaniCategories)}
            </div>

          </div>
        </div>

        {/* RIGHT PANEL: CART */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6 lg:max-h-[calc(100vh-140px)] overflow-hidden lg:sticky lg:top-0">
          <Card className="hidden md:flex flex-1 flex-col shadow-sm border-border bg-card w-full">
            <CardHeader className="border-b border-border bg-muted/30 pb-4">
              <CardTitle>Current Order</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col min-h-[300px]">
              <CartUI />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MOBILE FLOATING BOTTOM BAR */}
      {cartItemsCount > 0 && !isMobileCartOpen && (
        <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-card border-t border-border shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.5)] p-4 animate-in slide-in-from-bottom">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 font-semibold text-lg">
              <div className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-1.5 rounded-full">
                <ShoppingCart className="h-5 w-5" />
                <span>{cartItemsCount}</span>
              </div>
              <span className="text-primary font-bold ml-2">₹{totals.grandTotal}</span>
            </div>
            <Button onClick={() => setIsMobileCartOpen(true)} className="font-bold h-12 px-6 shadow-md text-base">
              View Order →
            </Button>
          </div>
        </div>
      )}

      {/* MOBILE CART BOTTOM SHEET DRAWER */}
      {isMobileCartOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileCartOpen(false)}
          />
          <div className="relative w-full h-[85vh] bg-card border-t border-border rounded-t-2xl flex flex-col shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="w-full flex justify-center pt-3 pb-1" onClick={() => setIsMobileCartOpen(false)}>
              <div className="w-12 h-1.5 bg-muted rounded-full"></div>
            </div>
            
            <div className="flex items-center justify-between px-6 pb-4 border-b border-border">
              <h2 className="text-xl font-bold tracking-tight">Current Order</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileCartOpen(false)} className="rounded-full bg-muted/50 h-10 w-10">
                 <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col">
               <CartUI />
            </div>
          </div>
        </div>
      )}

      {/* EXTRAS MODAL */}
      <Dialog open={activeCartIndex !== null} onOpenChange={(open) => !open && setActiveCartIndex(null)}>
        <DialogContent className="w-[90vw] max-w-lg rounded-xl z-[60]">
          <DialogHeader>
            <DialogTitle>Add Extras</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4 max-h-[60vh] overflow-y-auto">
            {extras.filter(e => e.isActive).map(extra => {
              const isSelected = activeCartIndex !== null && cart[activeCartIndex]?.extras.some(e => e.id === extra.id);
              return (
                <Button
                  key={extra.id}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => toggleExtra(extra)}
                  className={`flex justify-between w-full min-h-[48px] h-auto p-3 ${isSelected ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "border-border hover:bg-muted"}`}
                >
                  <span className="text-left whitespace-normal leading-tight">{extra.name}</span>
                  <span className="shrink-0 font-bold ml-2">+₹{extra.cafePrice}</span>
                </Button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
