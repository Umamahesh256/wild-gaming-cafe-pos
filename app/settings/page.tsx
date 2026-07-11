"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { Moon, Sun, PlusCircle, Trash2, Edit2 } from "lucide-react";
import { initialItems } from "@/data/initialData";

export default function SettingsPage() {
  const { settings, updateSettings, items, addItem, deleteItem, extras, addExtra, updateExtra, deleteExtra } = useStore();
  const { theme, resolvedTheme, setTheme } = useTheme();
  
  const [formData, setFormData] = useState(settings);
  const [mounted, setMounted] = useState(false);
  const [newExtraForm, setNewExtraForm] = useState({ name: "", cafePrice: 0, kitchenCost: 0 });
  const [editingExtra, setEditingExtra] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    setFormData(settings);
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    alert("Settings saved successfully!");
  };

  const handleAddMissingItems = () => {
    let addedCount = 0;
    initialItems.forEach(initialItem => {
      // Check if item already exists by name
      if (!items.find(i => i.name.toLowerCase() === initialItem.name.toLowerCase())) {
        addItem({
          name: initialItem.name,
          category: initialItem.category,
          cafePrice: initialItem.cafePrice,
          kitchenCost: null as any,
          status: 'Available'
        });
        addedCount++;
      }
    });
    alert(`Successfully added ${addedCount} missing items (including combos) to your menu without touching your prices!`);
  };

  const handleRemoveDuplicates = () => {
    const seenNames = new Set<string>();
    const duplicateIds: string[] = [];
    
    items.forEach(item => {
      const nameKey = item.name.trim().toLowerCase();
      if (seenNames.has(nameKey)) {
        duplicateIds.push(item.id);
      } else {
        seenNames.add(nameKey);
      }
    });

    duplicateIds.forEach(id => deleteItem(id));
    alert(`Successfully removed ${duplicateIds.length} duplicate items!`);
  };

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="border-border shadow-sm bg-card">
            <CardHeader>
              <CardTitle>Cafe Details</CardTitle>
              <CardDescription>Update your basic cafe information.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label>Cafe Name</Label>
                  <Input value={formData.cafeName} onChange={e => setFormData({ ...formData, cafeName: e.target.value })} required className="h-12 md:h-10 border-border bg-background focus-visible:ring-primary" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required className="h-12 md:h-10 border-border bg-background focus-visible:ring-primary" />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required className="h-12 md:h-10 border-border bg-background focus-visible:ring-primary" />
                </div>
                <div className="space-y-2">
                  <Label>Cloud Kitchen Name</Label>
                  <Input value={formData.kitchenName} onChange={e => setFormData({ ...formData, kitchenName: e.target.value })} required className="h-12 md:h-10 border-border bg-background focus-visible:ring-primary" />
                </div>
                <Button type="submit" className="w-full h-12 md:h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Save Changes</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-border shadow-sm bg-card">
            <CardHeader>
              <CardTitle>Extras Management</CardTitle>
              <CardDescription>Configure reusable addons like Extra Cheese.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <Label>Extra Name</Label>
                  <Input placeholder="e.g. Extra Cheese" value={newExtraForm.name} onChange={e => setNewExtraForm({...newExtraForm, name: e.target.value})} className="h-12 md:h-10 border-border bg-background focus-visible:ring-primary" />
                </div>
                <div className="space-y-2">
                  <Label>Cafe Price (₹)</Label>
                  <Input type="number" placeholder="Cafe Price" value={newExtraForm.cafePrice || ''} onChange={e => setNewExtraForm({...newExtraForm, cafePrice: Number(e.target.value)})} className="h-12 md:h-10 border-border bg-background focus-visible:ring-primary" />
                </div>
                <div className="space-y-2">
                  <Label>Kitchen Cost (₹)</Label>
                  <Input type="number" placeholder="Kitchen Cost" value={newExtraForm.kitchenCost || ''} onChange={e => setNewExtraForm({...newExtraForm, kitchenCost: Number(e.target.value)})} className="h-12 md:h-10 border-border bg-background focus-visible:ring-primary" />
                </div>
                <Button className="w-full h-12 md:h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold" onClick={() => {
                  if (newExtraForm.name && newExtraForm.cafePrice > 0) {
                    addExtra({ name: newExtraForm.name, cafePrice: newExtraForm.cafePrice, kitchenCost: newExtraForm.kitchenCost, isActive: true });
                    setNewExtraForm({ name: "", cafePrice: 0, kitchenCost: 0 });
                  }
                }}>Add Extra</Button>
              </div>
              
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto max-h-[600px] w-full">
                  <Table className="min-w-[500px]">
                    <TableHeader className="bg-muted/30">
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="pl-4">Extra Name</TableHead>
                        <TableHead>Cafe Price</TableHead>
                        <TableHead>Kitchen Cost</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right pr-4">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {extras.map(extra => (
                        <TableRow key={extra.id} className="border-border hover:bg-muted/50 transition-colors">
                          <TableCell className="font-medium pl-4">{extra.name}</TableCell>
                          <TableCell>₹{extra.cafePrice || (extra as any).price || 0}</TableCell>
                          <TableCell>₹{extra.kitchenCost || 0}</TableCell>
                          <TableCell>
                            <Button variant={extra.isActive ? "default" : "secondary"} size="sm" className="h-8 md:h-7 text-xs font-bold" onClick={() => updateExtra(extra.id, { isActive: !extra.isActive })}>
                              {extra.isActive ? "Active" : "Inactive"}
                            </Button>
                          </TableCell>
                          <TableCell className="text-right pr-4 space-x-1 whitespace-nowrap">
                            <Button variant="ghost" size="icon" className="h-10 w-10 md:h-8 md:w-8 hover:bg-muted" onClick={() => setEditingExtra(extra)}>
                              <Edit2 className="h-5 w-5 md:h-4 md:w-4 text-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-10 w-10 md:h-8 md:w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteExtra(extra.id)}>
                              <Trash2 className="h-5 w-5 md:h-4 md:w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {extras.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">No extras configured.</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border shadow-sm bg-card">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Toggle between light and dark mode.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button 
                variant={resolvedTheme === 'light' ? 'default' : 'outline'} 
                onClick={() => setTheme('light')}
                className="w-full h-12 md:h-10"
              >
                <Sun className="mr-2 h-4 w-4" /> Light
              </Button>
              <Button 
                variant={resolvedTheme === 'dark' ? 'default' : 'outline'} 
                onClick={() => setTheme('dark')}
                className="w-full h-12 md:h-10"
              >
                <Moon className="mr-2 h-4 w-4" /> Dark
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm bg-card">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Backup, restore, and fix your local data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleAddMissingItems} className="w-full h-12 md:h-10 bg-green-600 hover:bg-green-700 text-white font-bold">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Missing Items / Combos
              </Button>
              <Button onClick={handleRemoveDuplicates} className="w-full h-12 md:h-10 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold">
                <Trash2 className="mr-2 h-4 w-4" /> Clean Duplicate Items
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!editingExtra} onOpenChange={(open) => !open && setEditingExtra(null)}>
        <DialogContent className="w-[90vw] max-w-sm rounded-xl z-[60]">
          <DialogHeader>
            <DialogTitle>Edit Extra</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Extra Name</Label>
              <Input 
                value={editingExtra?.name || ''} 
                onChange={e => setEditingExtra({...editingExtra, name: e.target.value})} 
                className="h-12 md:h-10 border-border bg-background focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label>Cafe Price (₹)</Label>
              <Input 
                type="number" 
                value={editingExtra?.cafePrice || ''} 
                onChange={e => setEditingExtra({...editingExtra, cafePrice: Number(e.target.value)})} 
                className="h-12 md:h-10 border-border bg-background focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label>Kitchen Cost (₹)</Label>
              <Input 
                type="number" 
                value={editingExtra?.kitchenCost || ''} 
                onChange={e => setEditingExtra({...editingExtra, kitchenCost: Number(e.target.value)})} 
                className="h-12 md:h-10 border-border bg-background focus-visible:ring-primary"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto h-12 md:h-10 border-border hover:bg-muted" onClick={() => setEditingExtra(null)}>Cancel</Button>
            <Button className="w-full sm:w-auto h-12 md:h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold" onClick={() => {
              if (editingExtra && editingExtra.name && editingExtra.cafePrice >= 0) {
                updateExtra(editingExtra.id, {
                  name: editingExtra.name,
                  cafePrice: editingExtra.cafePrice,
                  kitchenCost: editingExtra.kitchenCost || 0
                });
                setEditingExtra(null);
              }
            }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
