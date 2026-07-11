"use client";

import { forwardRef } from "react";
import { format } from "date-fns";
import { Sale } from "@/types";
import { useStore } from "@/store/useStore";

interface ReceiptProps {
  sale: Sale | null;
}

export const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(({ sale }, ref) => {
  const { items } = useStore();
  
  if (!sale) return null;

  return (
    <div ref={ref} className="p-6 bg-white text-black w-full max-w-[300px] font-mono text-sm mx-auto flex flex-col">
      <div className="text-center mb-6">
        <h2 className="font-bold text-xl mb-1 uppercase">Wild Gaming Cafe</h2>
        <p className="text-xs text-gray-600">Receipt / Bill</p>
        <p className="text-xs text-gray-600 mt-1">{format(new Date(sale.timestamp), "dd MMM yyyy, hh:mm a")}</p>
        <p className="text-xs text-gray-600">Order #: {sale.id.slice(0, 8).toUpperCase()}</p>
      </div>

      <div className="border-t border-b border-dashed border-gray-400 py-3 mb-4 space-y-3">
        <div className="flex justify-between font-bold text-xs uppercase mb-1">
          <span>Item</span>
          <span>Amt</span>
        </div>
        {sale.items.map((cartItem, idx) => {
          const itemData = items.find(i => i.id === cartItem.itemId);
          const name = itemData?.name || "Unknown Item";
          const itemExtrasCost = cartItem.extras.reduce((acc, curr) => acc + curr.cafePrice, 0);
          const totalLinePrice = (cartItem.cafePrice + itemExtrasCost) * cartItem.quantity;
          
          return (
            <div key={idx} className="flex flex-col text-xs leading-tight gap-1">
              <div className="flex justify-between items-start gap-2">
                <span className="flex-1 pr-2">{cartItem.quantity}x {name}</span>
                <span className="font-semibold shrink-0">Rs. {totalLinePrice}</span>
              </div>
              {cartItem.extras.length > 0 && (
                <div className="text-[10px] text-gray-500 pl-4 italic">
                  + {cartItem.extras.map(e => e.name).join(', ')}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="space-y-2 mt-auto">
        <div className="flex justify-between font-bold text-base border-b border-dashed border-gray-400 pb-2 mb-2">
          <span>TOTAL</span>
          <span>Rs. {sale.totalAmount}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Payment Mode:</span>
          <span className="uppercase font-semibold">{sale.paymentType}</span>
        </div>
      </div>

      <div className="text-center mt-8 text-xs text-gray-500 space-y-1">
        <p>Thank you for visiting!</p>
        <p className="font-bold text-black uppercase">Wild Gaming Cafe</p>
      </div>
    </div>
  );
});
Receipt.displayName = "Receipt";
