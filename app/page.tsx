"use client";

import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { DollarSign, ShoppingBag, Utensils, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const { sales, settlements } = useStore();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Dashboard Stats (Selected Date)
  const filterDate = new Date(selectedDate);
  const filteredSales = sales.filter((sale) => isSameDay(new Date(sale.timestamp), filterDate));
  const todayRevenue = filteredSales.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const todayKitchenCost = filteredSales.reduce((acc, curr) => acc + curr.totalKitchenCost, 0);
  const todayProfit = filteredSales.reduce((acc, curr) => acc + curr.totalProfit, 0);
  const todayOrders = filteredSales.length;

  const totalKitchenCostEver = sales.reduce((acc, curr) => acc + curr.totalKitchenCost, 0);
  const totalSettledEver = settlements.reduce((acc, curr) => acc + curr.amountPaid, 0);
  const pendingSettlement = totalKitchenCostEver - totalSettledEver;

  // Recent 5 Orders
  const recentOrders = [...sales].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

  return (
    <div className="p-4 md:p-6 min-h-screen flex flex-col gap-6 pb-24 md:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <div className="flex items-center gap-2 bg-card border border-border rounded-md px-3 py-1 shadow-sm w-full sm:w-auto">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <Input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 h-8 p-0 px-2 w-full sm:w-[130px] bg-transparent"
          />
        </div>
      </div>
      
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <Card className="border-border border-t-2 border-t-primary bg-card shadow-sm">
          <CardHeader className="p-4 pb-0 flex flex-row justify-between items-center">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-2 text-2xl md:text-3xl font-bold">₹{todayRevenue}</CardContent>
        </Card>
        <Card className="border-border border-t-2 border-t-primary bg-card shadow-sm">
          <CardHeader className="p-4 pb-0 flex flex-row justify-between items-center">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="p-4 pt-2 text-2xl md:text-3xl font-bold text-primary">₹{todayProfit}</CardContent>
        </Card>
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="p-4 pb-0 flex flex-row justify-between items-center">
            <CardTitle className="text-sm font-medium text-muted-foreground">Kitchen Payable</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-2 text-2xl md:text-3xl font-bold">₹{todayKitchenCost}</CardContent>
        </Card>
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="p-4 pb-0 flex flex-row justify-between items-center">
            <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-2 text-2xl md:text-3xl font-bold">{todayOrders}</CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border shadow-sm bg-card border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle>Total Pending Settlement</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl md:text-4xl font-black text-red-500">₹{pendingSettlement}</div>
             <p className="text-sm text-muted-foreground mt-2">Unpaid balance to the kitchen for all time. Settle this from the Daily Reports page.</p>
          </CardContent>
        </Card>
      </div>

      {/* RECENT ORDERS COMPACT VIEW */}
      <Card className="shadow-sm border-border bg-card mt-2">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/30 pb-4">
          <CardTitle className="text-xl">Recent Orders</CardTitle>
          <Link href="/orders">
            <Button variant="outline" className="h-10 md:h-9">
              View All →
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[600px]">
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="pl-4 sm:pl-2">Date & Time</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead>Payment Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No orders yet.</TableCell></TableRow>
                ) : (
                  recentOrders.map(sale => (
                    <TableRow key={sale.id} className="border-border hover:bg-muted/50 transition-colors">
                      <TableCell className="text-sm whitespace-nowrap pl-4 sm:pl-2">{format(new Date(sale.timestamp), 'dd MMM yyyy, hh:mm a')}</TableCell>
                      <TableCell className="font-bold text-base">₹{sale.totalAmount}</TableCell>
                      <TableCell className="text-primary font-bold text-base">₹{sale.totalProfit}</TableCell>
                      <TableCell>{sale.paymentType}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
