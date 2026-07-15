"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Printer, Download, Trash2, Undo2, AlertCircle, FileText } from "lucide-react";
import { isToday, isYesterday, format } from "date-fns";
import { SettlementPaymentMethod } from "@/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DailyReport() {
  const { sales, items, settlements, addSettlement, deleteSettlement, undoLastSettlement } = useStore();
  const [dateFilter, setDateFilter] = useState("Today");

  // Filter sales
  const filteredSales = (sales || []).filter(sale => {
    const d = new Date(sale.timestamp);
    if (dateFilter === "Today") return isToday(d);
    if (dateFilter === "Yesterday") return isYesterday(d);
    return true;
  });

  // Calculate Summaries
  const totalRevenue = filteredSales.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalKitchenAmount = filteredSales.reduce((acc, curr) => acc + curr.totalKitchenCost, 0);
  const totalProfit = filteredSales.reduce((acc, curr) => acc + curr.totalProfit, 0);
  const totalOrders = filteredSales.length;
  const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Item Wise Aggregation
  const itemWise = filteredSales.reduce((acc, curr) => {
    (curr.items || []).forEach(cartItem => {
      if (!acc[cartItem.itemId]) {
        acc[cartItem.itemId] = { quantity: 0, revenue: 0, kitchenCost: 0, profit: 0 };
      }
      const extrasCost = (cartItem.extras || []).reduce((sum, e) => sum + (e.cafePrice || 0), 0);
      const extrasKitchen = (cartItem.extras || []).reduce((sum, e) => sum + (e.kitchenCost || 0), 0);
      const revenue = (cartItem.cafePrice + extrasCost) * cartItem.quantity;
      const kCost = (cartItem.kitchenCost + extrasKitchen) * cartItem.quantity;
      
      acc[cartItem.itemId].quantity += cartItem.quantity;
      acc[cartItem.itemId].revenue += revenue;
      acc[cartItem.itemId].kitchenCost += kCost;
      acc[cartItem.itemId].profit += (revenue - kCost);
    });
    return acc;
  }, {} as Record<string, any>);

  const bestItem = Object.entries(itemWise).sort((a, b) => b[1].quantity - a[1].quantity)[0];
  const lowestItem = Object.entries(itemWise).sort((a, b) => a[1].quantity - b[1].quantity)[0];

  const highestSellingItemName = bestItem ? items.find(i => i.id === bestItem[0])?.name : "N/A";
  const lowestSellingItemName = lowestItem ? items.find(i => i.id === lowestItem[0])?.name : "N/A";

  // Category Wise Aggregation
  const categoryWise = filteredSales.reduce((acc, curr) => {
    (curr.items || []).forEach(cartItem => {
      const item = items.find(i => i.id === cartItem.itemId);
      const cat = item ? item.category : "Unknown";
      if (!acc[cat]) {
        acc[cat] = { quantity: 0, revenue: 0, profit: 0 };
      }
      const extrasCost = (cartItem.extras || []).reduce((sum, e) => sum + (e.cafePrice || 0), 0);
      const extrasKitchen = (cartItem.extras || []).reduce((sum, e) => sum + (e.kitchenCost || 0), 0);
      const revenue = (cartItem.cafePrice + extrasCost) * cartItem.quantity;
      const profit = revenue - ((cartItem.kitchenCost + extrasKitchen) * cartItem.quantity);

      acc[cat].quantity += cartItem.quantity;
      acc[cat].revenue += revenue;
      acc[cat].profit += profit;
    });
    return acc;
  }, {} as Record<string, any>);

  // Payment Breakdown
  const paymentBreakdown = filteredSales.reduce((acc, curr) => {
    acc[curr.paymentType] = (acc[curr.paymentType] || 0) + curr.totalAmount;
    return acc;
  }, { Cash: 0, UPI: 0, Card: 0 } as Record<string, number>);

  // Settlement Logic
  const totalKitchenCostEver = (sales || []).reduce((acc, curr) => acc + (curr.totalKitchenCost || 0), 0);
  const totalSettledEver = (settlements || []).reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
  const pendingSettlement = totalKitchenCostEver - totalSettledEver;
  
  const [partialAmount, setPartialAmount] = useState<string>("");
  const [settlementMethod, setSettlementMethod] = useState<SettlementPaymentMethod>("Cash");
  const [settlementNotes, setSettlementNotes] = useState<string>("");

  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; type: 'Partial' | 'Full' | 'Undo' | 'Delete' | null; id?: string }>({ isOpen: false, type: null });

  const handleConfirmAction = () => {
    if (confirmDialog.type === 'Full') {
      addSettlement({
        kitchenPayable: pendingSettlement,
        amountPaid: pendingSettlement,
        remainingAmount: 0,
        status: 'Paid',
        paymentMethod: settlementMethod,
        notes: settlementNotes
      });
      setPartialAmount("");
      setSettlementNotes("");
    } else if (confirmDialog.type === 'Partial') {
      const amt = Number(partialAmount);
      addSettlement({
        kitchenPayable: pendingSettlement,
        amountPaid: amt,
        remainingAmount: pendingSettlement - amt,
        status: pendingSettlement - amt <= 0 ? 'Paid' : 'Partially Paid',
        paymentMethod: settlementMethod,
        notes: settlementNotes
      });
      setPartialAmount("");
      setSettlementNotes("");
    } else if (confirmDialog.type === 'Undo') {
      undoLastSettlement();
    } else if (confirmDialog.type === 'Delete' && confirmDialog.id) {
      deleteSettlement(confirmDialog.id);
    }
    setConfirmDialog({ isOpen: false, type: null });
  };

  const downloadCSV = () => {
    let csv = "Item,Quantity,Revenue,Kitchen Cost,Profit\n";
    Object.entries(itemWise).forEach(([id, data]) => {
      const name = items.find(i => i.id === id)?.name || "Unknown";
      csv += `${name},${data.quantity},${data.revenue},${data.kitchenCost},${data.profit}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Report_${dateFilter}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const generatePDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const dateStr = dateFilter === 'Today' ? format(new Date(), 'dd MMM yyyy') : (dateFilter === 'Yesterday' ? format(new Date(Date.now() - 86400000), 'dd MMM yyyy') : 'All Time');
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(255, 122, 0); // Primary Orange
    doc.text('Wild Gaming Cafe', 14, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text('Daily Report', 14, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Report Date: ${dateStr}`, 14, 38);
    doc.text(`Generated on: ${format(new Date(), 'dd MMM yyyy, hh:mm a')}`, 14, 43);

    // KPI Summary Table
    autoTable(doc, {
      startY: 50,
      head: [['KPI Metric', 'Value']],
      body: [
        ['Total Revenue', `Rs. ${totalRevenue}`],
        ['Kitchen Payable', `Rs. ${totalKitchenAmount}`],
        ['Gross Profit', `Rs. ${totalProfit}`],
        ['Total Orders', `${totalOrders}`],
        ['Avg Order Value', `Rs. ${averageOrder.toFixed(2)}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [255, 122, 0] },
      styles: { fontSize: 11, cellPadding: 4 }
    });

    // Payment Summary Table
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Payment Method', 'Amount Received']],
      body: [
        ['Cash', `Rs. ${paymentBreakdown.Cash}`],
        ['UPI', `Rs. ${paymentBreakdown.UPI}`],
        ['Card', `Rs. ${paymentBreakdown.Card}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [40, 40, 40] }
    });

    // Settlement Summary Table
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Kitchen Settlement Status', 'Amount']],
      body: [
        ['Total Pending Settlement', `Rs. ${pendingSettlement}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38] }, // Red for pending
      styles: { fontStyle: 'bold' }
    });

    // Item Wise Table
    const itemBody = Object.entries(itemWise)
      .sort((a, b) => (b[1] as any).quantity - (a[1] as any).quantity) // Sort by quantity
      .map(([id, data]) => {
        const name = items.find(i => i.id === id)?.name || "Unknown";
        return [name, data.quantity, `Rs. ${data.revenue}`, `Rs. ${data.kitchenCost}`, `Rs. ${data.profit}`];
      });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 15,
      head: [['Item Name', 'Qty Sold', 'Revenue', 'Kitchen Cost', 'Profit']],
      body: itemBody,
      theme: 'grid',
      headStyles: { fillColor: [255, 122, 0] }
    });

    // Category Wise Table
    const catBody = Object.entries(categoryWise).map(([cat, data]) => {
      return [cat, data.quantity, `Rs. ${data.revenue}`, `Rs. ${data.profit}`];
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 15,
      head: [['Category', 'Items Sold', 'Revenue', 'Profit']],
      body: catBody,
      theme: 'grid',
      headStyles: { fillColor: [40, 40, 40] }
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        'Generated by Wild Gaming Cafe Management System',
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`WildGaming_Report_${dateStr.replace(/ /g, '_')}.pdf`);
  };

  // Sort settlements for history table (newest first)
  const sortedSettlements = [...settlements].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="p-4 md:p-6 space-y-6 pb-20" id="printable-report">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Daily CRM Report</h2>
        <div className="flex flex-wrap items-center gap-2 no-print w-full sm:w-auto">
          <Select value={dateFilter} onValueChange={(v) => v && setDateFilter(v)}>
            <SelectTrigger className="w-full sm:w-[150px] h-12 md:h-10 border-border bg-card shadow-sm font-semibold"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="Yesterday">Yesterday</SelectItem>
              <SelectItem value="All Time">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex-1 sm:flex-none h-12 md:h-10 border-border hover:bg-muted font-bold" onClick={generatePDF}>
            <FileText className="mr-2 h-5 w-5 md:h-4 md:w-4" /> PDF
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none h-12 md:h-10 border-border hover:bg-muted font-bold" onClick={downloadCSV}>
            <Download className="mr-2 h-5 w-5 md:h-4 md:w-4" /> CSV
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none h-12 md:h-10 border-border hover:bg-muted hidden md:flex font-bold" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-border shadow-sm bg-card border-t-2 border-t-primary"><CardHeader className="p-4 md:pb-2"><CardTitle className="text-xs md:text-sm text-muted-foreground truncate">Total Revenue</CardTitle></CardHeader><CardContent className="p-4 pt-0 text-xl md:text-2xl font-bold">₹{totalRevenue}</CardContent></Card>
        <Card className="border-border shadow-sm bg-card"><CardHeader className="p-4 md:pb-2"><CardTitle className="text-xs md:text-sm text-muted-foreground truncate">Kitchen Amount</CardTitle></CardHeader><CardContent className="p-4 pt-0 text-xl md:text-2xl font-bold">₹{totalKitchenAmount}</CardContent></Card>
        <Card className="border-border shadow-sm bg-card border-t-2 border-t-primary"><CardHeader className="p-4 md:pb-2"><CardTitle className="text-xs md:text-sm text-muted-foreground truncate">Gross Profit</CardTitle></CardHeader><CardContent className="p-4 pt-0 text-xl md:text-2xl font-bold text-primary">₹{totalProfit}</CardContent></Card>
        <Card className="border-border shadow-sm bg-card"><CardHeader className="p-4 md:pb-2"><CardTitle className="text-xs md:text-sm text-muted-foreground truncate">Total Orders</CardTitle></CardHeader><CardContent className="p-4 pt-0 text-xl md:text-2xl font-bold">{totalOrders}</CardContent></Card>
        <Card className="border-border shadow-sm bg-card"><CardHeader className="p-4 md:pb-2"><CardTitle className="text-xs md:text-sm text-muted-foreground truncate">Avg Order Value</CardTitle></CardHeader><CardContent className="p-4 pt-0 text-lg md:text-2xl font-bold">₹{averageOrder.toFixed(2)}</CardContent></Card>
        <Card className="border-border shadow-sm bg-card"><CardHeader className="p-4 md:pb-2"><CardTitle className="text-xs md:text-sm text-muted-foreground truncate">Best Selling</CardTitle></CardHeader><CardContent className="p-4 pt-0 text-sm md:text-xl font-bold truncate" title={highestSellingItemName}>{highestSellingItemName}</CardContent></Card>
        <Card className="border-border shadow-sm bg-card"><CardHeader className="p-4 md:pb-2"><CardTitle className="text-xs md:text-sm text-muted-foreground truncate">Lowest Selling</CardTitle></CardHeader><CardContent className="p-4 pt-0 text-sm md:text-xl font-bold truncate" title={lowestSellingItemName}>{lowestSellingItemName}</CardContent></Card>
      </div>

      <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <Card className="border-border shadow-sm bg-card">
            <CardHeader><CardTitle>Item Wise Sales</CardTitle></CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto w-full">
                <Table className="min-w-[500px]">
                  <TableHeader className="bg-muted/30">
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="pl-4 sm:pl-2">Item</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Kitchen Cost</TableHead>
                      <TableHead className="pr-4 sm:pr-2">Profit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(itemWise).map(([id, data]) => (
                      <TableRow key={id} className="border-border hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium pl-4 sm:pl-2">{items.find(i => i.id === id)?.name}</TableCell>
                        <TableCell>{data.quantity}</TableCell>
                        <TableCell>₹{data.revenue}</TableCell>
                        <TableCell>₹{data.kitchenCost}</TableCell>
                        <TableCell className="text-primary font-bold pr-4 sm:pr-2">₹{data.profit}</TableCell>
                      </TableRow>
                    ))}
                    {Object.keys(itemWise).length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-6">No data</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm bg-card">
            <CardHeader><CardTitle>Category Wise Sales</CardTitle></CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto w-full">
                <Table className="min-w-[400px]">
                  <TableHeader className="bg-muted/30">
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="pl-4 sm:pl-2">Category</TableHead>
                      <TableHead>Items Sold</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead className="pr-4 sm:pr-2">Profit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(categoryWise).map(([cat, data]) => (
                      <TableRow key={cat} className="border-border hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium pl-4 sm:pl-2">{cat}</TableCell>
                        <TableCell>{data.quantity}</TableCell>
                        <TableCell>₹{data.revenue}</TableCell>
                        <TableCell className="text-primary font-bold pr-4 sm:pr-2">₹{data.profit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 space-y-6">
          <Card className="border-border shadow-sm bg-card">
            <CardHeader><CardTitle>Payment Breakdown</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Cash</span><span className="font-bold text-lg">₹{paymentBreakdown.Cash}</span></div>
              <div className="flex justify-between items-center"><span className="text-muted-foreground">UPI</span><span className="font-bold text-lg">₹{paymentBreakdown.UPI}</span></div>
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Card</span><span className="font-bold text-lg">₹{paymentBreakdown.Card}</span></div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm bg-card border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle>Kitchen Settlement</CardTitle>
              <CardDescription>Manage payments to cloud kitchen.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center py-2 border-b border-primary/20">
                <span className="text-muted-foreground font-medium">Total Pending:</span>
                <span className={`text-2xl font-bold ${pendingSettlement > 0 ? 'text-primary' : 'text-green-500'}`}>
                  ₹{pendingSettlement}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={settlementMethod} onValueChange={(v) => v && setSettlementMethod(v as SettlementPaymentMethod)}>
                    <SelectTrigger className="h-12 md:h-10 border-border bg-background focus:ring-primary"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Input placeholder="e.g. Paid through PhonePe" value={settlementNotes} onChange={e => setSettlementNotes(e.target.value)} className="h-12 md:h-10 border-border bg-background focus-visible:ring-primary" />
                </div>

                <div className="space-y-2">
                  <Label>Partial Payment (₹)</Label>
                  <Input type="number" placeholder="Amount" value={partialAmount} onChange={e => setPartialAmount(e.target.value)} disabled={pendingSettlement <= 0} className="h-12 md:h-10 border-border bg-background focus-visible:ring-primary" />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full sm:flex-1 h-12 md:h-10 border-border hover:bg-muted font-bold"
                    disabled={pendingSettlement <= 0 || !partialAmount || Number(partialAmount) <= 0} 
                    onClick={() => setConfirmDialog({ isOpen: true, type: 'Partial' })}
                  >
                    Pay Partial
                  </Button>
                  <Button 
                    className="w-full sm:flex-1 h-12 md:h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                    disabled={pendingSettlement <= 0} 
                    onClick={() => setConfirmDialog({ isOpen: true, type: 'Full' })}
                  >
                    Mark Fully Paid
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <Card className="border-border shadow-sm bg-card">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Settlement History</CardTitle>
              <CardDescription>Track payments made to the cloud kitchen.</CardDescription>
            </div>
            {sortedSettlements.length > 0 && (
              <Button variant="outline" className="w-full sm:w-auto h-12 md:h-10 text-destructive border-destructive/20 hover:bg-destructive/10 font-bold" onClick={() => setConfirmDialog({ isOpen: true, type: 'Undo' })}>
                <Undo2 className="mr-2 h-4 w-4" /> Undo Last Action
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto w-full border-y sm:border sm:rounded-xl border-border max-h-[400px] overflow-y-auto">
              <Table className="min-w-[700px]">
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="pl-4 sm:pl-2">Date & Time</TableHead>
                    <TableHead>Payable at time</TableHead>
                    <TableHead>Paid Amount</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right pr-4 sm:pr-2">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedSettlements.map((s) => (
                    <TableRow key={s.id} className="border-border hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium pl-4 sm:pl-2">
                        <div className="whitespace-nowrap">{format(new Date(s.timestamp), 'dd MMM yyyy')}</div>
                        <div className="text-xs text-muted-foreground">{format(new Date(s.timestamp), 'hh:mm a')}</div>
                      </TableCell>
                      <TableCell>₹{s.kitchenPayable}</TableCell>
                      <TableCell className="font-bold text-primary">₹{s.amountPaid}</TableCell>
                      <TableCell>₹{s.remainingAmount}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1.5 md:py-1 rounded-full text-xs font-bold md:font-medium ${s.status === 'Paid' ? 'bg-green-500/15 text-green-600 dark:text-green-400' : 'bg-orange-500/15 text-orange-600 dark:text-orange-400'}`}>
                          {s.status}
                        </span>
                      </TableCell>
                      <TableCell>{s.paymentMethod}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate" title={s.notes}>{s.notes || '-'}</TableCell>
                      <TableCell className="text-right pr-4 sm:pr-2">
                        <Button variant="ghost" size="icon" onClick={() => setConfirmDialog({ isOpen: true, type: 'Delete', id: s.id })} className="h-10 w-10 md:h-8 md:w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-5 w-5 md:h-4 md:w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {sortedSettlements.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-6">No settlement history found.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => !open && setConfirmDialog({ isOpen: false, type: null })}>
        <DialogContent className="w-[90vw] max-w-md rounded-xl z-[60]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" /> Confirm Action
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm md:text-base">
            {confirmDialog.type === 'Full' && "Are you sure you want to mark the entire pending settlement as fully paid?"}
            {confirmDialog.type === 'Partial' && `Are you sure you want to record a partial payment of ₹${partialAmount}?`}
            {confirmDialog.type === 'Undo' && "Are you sure you want to undo the last settlement action? This will restore the settlement state to before the last action was taken."}
            {confirmDialog.type === 'Delete' && "Are you sure you want to delete this specific settlement record? This will adjust your total pending amount accordingly."}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto h-12 md:h-10 border-border" onClick={() => setConfirmDialog({ isOpen: false, type: null })}>Cancel</Button>
            <Button variant="default" className="w-full sm:w-auto h-12 md:h-10 font-bold" onClick={handleConfirmAction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
