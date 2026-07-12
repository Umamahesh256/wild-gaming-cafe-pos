"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { format, isToday } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Trash2, Edit, Printer, Plus, Minus, Undo } from "lucide-react";
import { Sale, PaymentType, CartItem } from "@/types";
import { Receipt } from "@/components/Receipt";

export default function OrdersPage() {
  const { sales, items, deleteSale, updateSale, addSale } = useStore();
  const [dateFilter, setDateFilter] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  const filteredSales = (sales || []).filter((sale) => {
    if (!sale?.timestamp) return false;
    try {
      return format(new Date(sale.timestamp), 'yyyy-MM-dd') === dateFilter;
    } catch {
      return false;
    }
  });
  
  // Undo Logic State
  const [deletedQueue, setDeletedQueue] = useState<{sale: Sale, timer: NodeJS.Timeout}[]>([]);

  // Print Logic
  const [printSale, setPrintSale] = useState<Sale | null>(null);

  // Edit Logic
  const [editSale, setEditSale] = useState<Sale | null>(null);
  const [editCart, setEditCart] = useState<CartItem[]>([]);
  const [editPayment, setEditPayment] = useState<PaymentType>("Cash");

  const handlePrint = (sale: Sale) => {
    setPrintSale(sale);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleDelete = (sale: Sale) => {
    if (confirm("Are you sure you want to delete this order? Revenue and profit will recalculate.")) {
      deleteSale(sale.id);
      
      const timer = setTimeout(() => {
        setDeletedQueue(prev => prev.filter(q => q.sale.id !== sale.id));
      }, 7000); // 7 second undo window

      setDeletedQueue(prev => [...prev, { sale, timer }]);
    }
  };

  const handleUndo = (queueItem: {sale: Sale, timer: NodeJS.Timeout}) => {
    clearTimeout(queueItem.timer);
    addSale(queueItem.sale); // re-adds exactly as it was
    setDeletedQueue(prev => prev.filter(q => q.sale.id !== queueItem.sale.id));
  };

  const openEdit = (sale: Sale) => {
    setEditSale(sale);
    setEditCart([...(sale.items || [])]);
    setEditPayment(sale.paymentType);
  };

  const updateEditQuantity = (index: number, delta: number) => {
    setEditCart(prev => {
      const newCart = [...prev];
      newCart[index].quantity += delta;
      if (newCart[index].quantity <= 0) {
        newCart.splice(index, 1);
      }
      return newCart;
    });
  };
  
  const handleSaveEdit = () => {
    if (!editSale || editCart.length === 0) return;

    let itemsTotal = 0;
    let kitchenTotal = 0;
    let extrasTotal = 0;

    editCart.forEach(item => {
      const itemBase = item.cafePrice * item.quantity;
      const extraCost = (item.extras || []).reduce((acc, curr) => acc + (curr.cafePrice || 0), 0) * item.quantity;
      const extraKitchen = (item.extras || []).reduce((acc, curr) => acc + (curr.kitchenCost || 0), 0) * item.quantity;
      
      itemsTotal += itemBase;
      extrasTotal += extraCost;
      kitchenTotal += (item.kitchenCost * item.quantity) + extraKitchen;
    });

    const grandTotal = itemsTotal + extrasTotal;
    const profit = grandTotal - kitchenTotal;

    updateSale(editSale.id, {
      items: editCart,
      paymentType: editPayment,
      totalAmount: grandTotal,
      totalKitchenCost: kitchenTotal,
      totalProfit: profit
    });

    setEditSale(null);
  };

  if (!mounted) return null;

  return (
    <>
      <div className="print:hidden p-4 md:p-6 min-h-screen flex flex-col gap-6 pb-24 md:pb-6 relative overflow-x-hidden">
        
        {/* UNDO TOASTS */}
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2">
          {deletedQueue.map((q) => (
            <div key={q.sale.id} className="bg-zinc-900 text-white p-4 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] border border-zinc-800 animate-in slide-in-from-right">
              <div>
                <p className="font-bold text-sm">Order Deleted</p>
                <p className="text-xs text-zinc-400">ID: {q.sale.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleUndo(q)} className="h-8 border-zinc-600 text-white hover:bg-zinc-800 font-bold">
                 <Undo className="w-4 h-4 mr-2" /> Undo
              </Button>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Orders</h2>
          <Input 
            type="date" 
            value={dateFilter} 
            max={format(new Date(), 'yyyy-MM-dd')}
            onChange={e => setDateFilter(e.target.value)}
            className="w-full sm:w-48 h-12 md:h-10 bg-card border-border focus-visible:ring-primary font-semibold"
          />
        </div>

        <Card className="shadow-sm border-border bg-card flex-1">
          <CardContent className="p-0 sm:p-6">
            <div className="w-full overflow-hidden">
              <Table className="w-full text-xs sm:text-sm">
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="px-1 sm:pl-2 w-[60px] sm:w-auto">Order</TableHead>
                    <TableHead className="px-1">Time</TableHead>
                    <TableHead className="px-1">Items</TableHead>
                    <TableHead className="px-1">Total</TableHead>
                    <TableHead className="hidden sm:table-cell px-1">Payment</TableHead>
                    <TableHead className="text-right pr-2 sm:pr-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No orders found for this date.</TableCell></TableRow>
                  ) : (
                    filteredSales.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(sale => (
                      <TableRow key={sale.id} className="border-border hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-[10px] sm:text-xs text-muted-foreground px-1 sm:pl-2">{sale.id.slice(0, 6).toUpperCase()}</TableCell>
                        <TableCell className="font-medium whitespace-nowrap px-1">{format(new Date(sale.timestamp), 'hh:mm a')}</TableCell>
                        <TableCell className="max-w-[120px] sm:max-w-[250px] px-1">
                          {(sale.items || []).map((i, idx) => {
                            const name = items.find(it => it.id === i.itemId)?.name || 'Unknown';
                            return <div key={idx} className="truncate">{i.quantity}x {name} {(i.extras || []).length > 0 && <span className="text-[10px] text-muted-foreground italic">(+{(i.extras || []).length})</span>}</div>
                          })}
                        </TableCell>
                        <TableCell className="font-bold sm:text-base text-primary px-1">₹{sale.totalAmount}</TableCell>
                        <TableCell className="hidden sm:table-cell font-medium px-1">{sale.paymentType}</TableCell>
                        <TableCell className="text-right pr-2 sm:pr-4">
                          <div className="flex justify-end gap-0 sm:gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handlePrint(sale)} className="h-8 w-8 md:h-8 md:w-8 hover:bg-muted" title="Print Receipt">
                              <Printer className="h-4 w-4 md:h-4 md:w-4 text-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEdit(sale)} className="h-8 w-8 md:h-8 md:w-8 hover:bg-muted" title="Edit Order">
                              <Edit className="h-4 w-4 md:h-4 md:w-4 text-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(sale)} className="h-8 w-8 md:h-8 md:w-8 text-destructive hover:bg-destructive/10" title="Delete Order">
                              <Trash2 className="h-4 w-4 md:h-4 md:w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* EDIT MODAL */}
        <Dialog open={!!editSale} onOpenChange={(open) => !open && setEditSale(null)}>
          <DialogContent className="w-[90vw] max-w-lg rounded-xl z-[60]">
            <DialogHeader>
              <DialogTitle>Edit Order {editSale?.id.slice(0,8).toUpperCase()}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
              {editCart.map((cartItem, index) => {
                const itemData = items.find(i => i.id === cartItem.itemId);
                const itemExtrasCost = (cartItem.extras || []).reduce((acc, curr) => acc + (curr.cafePrice || 0), 0);
                return (
                  <div key={cartItem.id} className="flex flex-col gap-2 p-3 bg-background rounded-md border border-border">
                    <div className="flex justify-between items-start">
                      <div className="font-semibold">{itemData?.name || "Deleted Item"}</div>
                      <div className="font-bold text-primary">₹{(cartItem.cafePrice + itemExtrasCost) * cartItem.quantity}</div>
                    </div>
                    
                    {(cartItem.extras || []).length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Extras: {(cartItem.extras || []).map(e => e.name).join(', ')}
                      </div>
                    )}

                    <div className="flex justify-end mt-2">
                      <div className="flex items-center gap-2 bg-background border rounded-md">
                        <Button variant="ghost" size="icon" className="h-8 w-8 md:h-7 md:w-7 rounded-none" onClick={() => updateEditQuantity(index, -1)}><Minus className="h-4 w-4 md:h-3 md:w-3" /></Button>
                        <span className="text-sm md:text-base font-bold w-8 md:w-6 text-center">{cartItem.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 md:h-7 md:w-7 rounded-none border-l" onClick={() => updateEditQuantity(index, 1)}><Plus className="h-4 w-4 md:h-3 md:w-3" /></Button>
                      </div>
                    </div>
                  </div>
                )
              })}
              
              <div className="mt-4 space-y-2">
                <label className="text-sm font-semibold">Payment Method</label>
                <Select value={editPayment} onValueChange={(v) => v && setEditPayment(v as PaymentType)}>
                  <SelectTrigger className="w-full h-12 md:h-10 bg-background border-border focus:ring-primary"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" className="w-full sm:w-auto h-12 md:h-10" onClick={() => setEditSale(null)}>Cancel</Button>
              <Button className="w-full sm:w-auto h-12 md:h-10 font-bold bg-primary text-primary-foreground" onClick={handleSaveEdit} disabled={editCart.length === 0}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* PRINT ONLY RECEIPT (Hidden on Screen, Visible on Print) */}
      {printSale && (
        <div className="hidden print:flex w-full absolute top-0 left-0 bg-white z-[9999] justify-center p-8 m-0">
          <Receipt sale={printSale} />
        </div>
      )}
    </>
  );
}
