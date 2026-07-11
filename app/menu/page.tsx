"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { CafeItem, Category } from "@/types";

const categories: Category[] = [
  "Veg Starters", "Non Veg Starters", "Veg Fried Rice", "Non Veg Fried Rice",
  "Veg Noodles", "Non Veg Noodles", "Biryani", "Beverages", "Veg Combos", "Non Veg Combos"
];

export default function CafeMenu() {
  const { items, addItem, updateItem, deleteItem } = useStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "All">("All");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CafeItem | null>(null);

  const [formData, setFormData] = useState<Partial<CafeItem>>({
    name: "",
    category: "Veg Starters",
    cafePrice: 0,
    kitchenCost: 0,
    status: "Available"
  });

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Group filtered items by category
  const groupedItems = categories.reduce((acc, cat) => {
    const itemsInCat = filteredItems.filter(i => i.category === cat);
    if (itemsInCat.length > 0) {
      acc[cat] = itemsInCat;
    }
    return acc;
  }, {} as Record<Category, CafeItem[]>);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addItem({
      name: formData.name || "",
      category: formData.category as Category || "Veg Starters",
      cafePrice: Number(formData.cafePrice) || 0,
      kitchenCost: formData.kitchenCost === undefined ? null : formData.kitchenCost,
      status: formData.status as 'Available' | 'Out of Stock' || 'Available'
    });
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      updateItem(selectedItem.id, {
        name: formData.name,
        category: formData.category as Category,
        cafePrice: Number(formData.cafePrice),
        kitchenCost: formData.kitchenCost === undefined ? null : formData.kitchenCost,
        status: formData.status as 'Available' | 'Out of Stock'
      });
      setIsEditOpen(false);
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      deleteItem(selectedItem.id);
      setIsDeleteOpen(false);
    }
  };

  const openEdit = (item: CafeItem) => {
    setSelectedItem(item);
    setFormData(item);
    setIsEditOpen(true);
  };

  const openDelete = (item: CafeItem) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Cafe Menu</h2>
        <Button 
          className="w-full sm:w-auto h-12 md:h-10 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => {
            setFormData({ name: "", category: "Veg Starters", cafePrice: 0, kitchenCost: null as any, status: "Available" });
            setIsAddOpen(true);
          }}
        >
          <Plus className="mr-2 h-5 w-5 md:h-4 md:w-4" /> Add Item
        </Button>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="w-[90vw] max-w-lg rounded-xl z-[60]">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input required className="h-12 md:h-10 focus-visible:ring-primary" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(v) => v && setFormData({ ...formData, category: v as Category })}>
                  <SelectTrigger className="h-12 md:h-10 focus:ring-primary"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cafe Price (₹)</Label>
                <Input required type="number" min="0" className="h-12 md:h-10 focus-visible:ring-primary" value={formData.cafePrice} onChange={e => setFormData({ ...formData, cafePrice: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Kitchen Cost (₹)</Label>
                <Input type="number" min="0" placeholder="Optional" className="h-12 md:h-10 focus-visible:ring-primary" value={formData.kitchenCost ?? ''} onChange={e => setFormData({ ...formData, kitchenCost: e.target.value ? Number(e.target.value) : null })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => v && setFormData({ ...formData, status: v as any })}>
                  <SelectTrigger className="h-12 md:h-10 focus:ring-primary"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full h-12 md:h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Save Item</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-3 md:top-2.5 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search items..." className="pl-10 h-12 md:h-10 w-full border-border bg-card shadow-sm focus-visible:ring-primary text-base" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={categoryFilter} onValueChange={(v) => v && setCategoryFilter(v as Category | "All")}>
          <SelectTrigger className="w-full sm:w-[180px] h-12 md:h-10 border-border bg-card shadow-sm focus:ring-primary">
            <SelectValue placeholder="Filter Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedItems).length === 0 ? (
          <div className="text-center p-8 border rounded-md text-muted-foreground bg-card">No items found.</div>
        ) : (
          Object.entries(groupedItems).map(([category, catItems]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-lg md:text-xl font-bold border-b border-border pb-2 text-foreground">{category}</h3>
              <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <Table className="min-w-[600px]">
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent border-border">
                        <TableHead className="pl-4">Item Name</TableHead>
                        <TableHead>Cafe Price</TableHead>
                        <TableHead>Kitchen Cost</TableHead>
                        <TableHead>Profit</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right pr-4">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {catItems.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/50 border-border transition-colors">
                          <TableCell className="font-medium pl-4">{item.name}</TableCell>
                          <TableCell className="font-semibold">₹{item.cafePrice}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.kitchenCost !== null ? `₹${item.kitchenCost}` : 'Not Set'}
                          </TableCell>
                          <TableCell className={item.kitchenCost !== null && (item.cafePrice - item.kitchenCost) > 0 ? "text-primary font-bold" : ""}>
                            {item.kitchenCost !== null ? `₹${item.cafePrice - item.kitchenCost}` : '-'}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1.5 md:py-1 rounded-full text-xs font-bold md:font-medium ${item.status === 'Available' ? 'bg-green-500/15 text-green-600 dark:text-green-400' : 'bg-red-500/15 text-red-600 dark:text-red-400'}`}>
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right space-x-1 pr-4 whitespace-nowrap">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(item)} className="h-10 w-10 md:h-8 md:w-8 hover:bg-muted">
                              <Edit className="h-5 w-5 md:h-4 md:w-4 text-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openDelete(item)} className="h-10 w-10 md:h-8 md:w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-5 w-5 md:h-4 md:w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="w-[90vw] max-w-lg rounded-xl z-[60]">
          <DialogHeader><DialogTitle>Edit Item</DialogTitle></DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
            <div className="space-y-2">
              <Label>Item Name</Label>
              <Input required className="h-12 md:h-10 focus-visible:ring-primary" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(v) => v && setFormData({ ...formData, category: v as Category })}>
                <SelectTrigger className="h-12 md:h-10 focus:ring-primary"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cafe Price (₹)</Label>
              <Input required type="number" min="0" className="h-12 md:h-10 focus-visible:ring-primary" value={formData.cafePrice} onChange={e => setFormData({ ...formData, cafePrice: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Kitchen Cost (₹)</Label>
              <Input type="number" min="0" placeholder="Optional" className="h-12 md:h-10 focus-visible:ring-primary" value={formData.kitchenCost ?? ''} onChange={e => setFormData({ ...formData, kitchenCost: e.target.value ? Number(e.target.value) : null })} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => v && setFormData({ ...formData, status: v as any })}>
                <SelectTrigger className="h-12 md:h-10 focus:ring-primary"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full h-12 md:h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Update Item</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="w-[90vw] max-w-md rounded-xl z-[60]">
          <DialogHeader><DialogTitle>Confirm Deletion</DialogTitle></DialogHeader>
          <div className="py-4 text-sm md:text-base">
            Are you sure you want to delete <strong>{selectedItem?.name}</strong>? This action cannot be undone.
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2">
            <Button variant="outline" className="h-12 sm:h-10 w-full sm:w-auto" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="h-12 sm:h-10 w-full sm:w-auto" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
