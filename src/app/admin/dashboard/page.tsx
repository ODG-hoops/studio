'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore, useUser, useCollection } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Package, LogOut, Calendar as CalendarIcon, DollarSign, MapPin, Mail, RefreshCw, Trash2, ExternalLink, Search, Plus, PlusCircle, Edit3, Image as ImageIcon } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { products as initialProducts } from '@/lib/data';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  
  // Product Form State
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    imageHint: '',
    colors: 'White, Black, Blue',
    sizes: 'S, M, L, XL, XXL'
  });

  // Stabilize the queries
  const ordersQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  }, [db]);

  const productsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('name', 'asc'));
  }, [db]);

  const { data: orders, loading: ordersLoading } = useCollection(ordersQuery);
  const { data: firestoreProducts, loading: productsLoading } = useCollection(productsQuery);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    if (!db) return;
    const orderRef = doc(db, 'orders', orderId);
    updateDoc(orderRef, { status: newStatus }).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: orderRef.path, operation: 'update' }));
    });
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    const productData = {
      name: productForm.name,
      price: parseFloat(productForm.price),
      category: productForm.category,
      description: productForm.description,
      image: productForm.image,
      imageHint: productForm.imageHint,
      colors: productForm.colors.split(',').map(s => s.trim()).filter(Boolean),
      sizes: productForm.sizes.split(',').map(s => s.trim()).filter(Boolean),
      updatedAt: serverTimestamp()
    };

    if (editingProduct) {
      const prodRef = doc(db, 'products', editingProduct.id);
      setDoc(prodRef, productData, { merge: true }).catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: prodRef.path, operation: 'update', requestResourceData: productData }));
      });
      toast({ title: "Product Updated", description: "Changes saved successfully." });
    } else {
      addDoc(collection(db, 'products'), productData).catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: 'products', operation: 'create', requestResourceData: productData }));
      });
      toast({ title: "Product Created", description: "The new item has been added to inventory." });
    }

    setIsProductDialogOpen(false);
    setEditingProduct(null);
    setProductForm({ name: '', price: '', category: '', description: '', image: '', imageHint: '', colors: 'White, Black, Blue', sizes: 'S, M, L, XL, XXL' });
  };

  const seedInventory = () => {
    if (!db || firestoreProducts?.length) return;
    initialProducts.forEach(prod => {
      addDoc(collection(db, 'products'), { ...prod, updatedAt: serverTimestamp() });
    });
    toast({ title: "Inventory Initialized", description: "Seeded the database with default products." });
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/admin/login');
    }
  };

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return (orders as any[]).filter(order => 
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  const filteredProducts = useMemo(() => {
    if (!firestoreProducts) return [];
    return (firestoreProducts as any[]).filter(p => 
      p.name?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(productSearchTerm.toLowerCase())
    );
  }, [firestoreProducts, productSearchTerm]);

  if (authLoading || !user) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-primary/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary font-serif">Management Portal</h1>
            <p className="text-muted-foreground mt-1 text-sm">Style Maverik INC. Internal Operations</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="border-primary/20">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-card border border-primary/10">
            <TabsTrigger value="orders">Orders Feed</TabsTrigger>
            <TabsTrigger value="products">Inventory Goods</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card/50 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(orders as any[])?.length || 0}</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    GH₵{(orders as any[])?.reduce((acc, o) => acc + (o.total || 0), 0).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/10 bg-card/30">
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="font-serif">Live Order Feed</CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input placeholder="Search orders..." className="pl-9 h-9 text-xs" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {ordersLoading ? (
                  <div className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto opacity-20" /></div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-primary/5">
                          <TableHead className="text-[10px] uppercase">Customer</TableHead>
                          <TableHead className="text-[10px] uppercase">Location</TableHead>
                          <TableHead className="text-[10px] uppercase">Total</TableHead>
                          <TableHead className="text-[10px] uppercase">Status</TableHead>
                          <TableHead className="text-right text-[10px] uppercase">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow key={order.id} className="border-primary/5">
                            <TableCell className="font-medium text-sm">{order.customerEmail}</TableCell>
                            <TableCell className="text-sm">{order.location}</TableCell>
                            <TableCell className="font-bold">GH₵{order.total?.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="capitalize text-[10px]">{order.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Select defaultValue={order.status} onValueChange={(val) => handleStatusChange(order.id, val)}>
                                <SelectTrigger className="w-[120px] h-8 text-[10px] ml-auto">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search products..." className="pl-9 h-9 text-xs" value={productSearchTerm} onChange={(e) => setProductSearchTerm(e.target.value)} />
              </div>
              <div className="flex gap-2">
                {!firestoreProducts?.length && !productsLoading && (
                  <Button variant="outline" size="sm" onClick={seedInventory}>Initialize Defaults</Button>
                )}
                <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => { setEditingProduct(null); setProductForm({ name: '', price: '', category: '', description: '', image: '', imageHint: '', colors: 'White, Black, Blue', sizes: 'S, M, L, XL, XXL' }); }}>
                      <Plus className="h-4 w-4 mr-2" /> Add Goods
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-card border-primary/20">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl">{editingProduct ? 'Edit Goods' : 'Add New Goods'}</DialogTitle>
                      <DialogDescription>Fill in the details for the Style Maverik collection item.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleProductSubmit} className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Item Name</Label>
                          <Input id="name" required value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} placeholder="e.g., 21st SM Hoodie" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">Price (GH₵)</Label>
                          <Input id="price" type="number" step="0.01" required value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} placeholder="350" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Input id="category" required value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} placeholder="e.g., Hoodies" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="image">Image URL</Label>
                          <Input id="image" required value={productForm.image} onChange={(e) => setProductForm({...productForm, image: e.target.value})} placeholder="https://..." />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" required value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} rows={3} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="colors">Available Colors (comma separated)</Label>
                          <Input id="colors" value={productForm.colors} onChange={(e) => setProductForm({...productForm, colors: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sizes">Available Sizes (comma separated)</Label>
                          <Input id="sizes" value={productForm.sizes} onChange={(e) => setProductForm({...productForm, sizes: e.target.value})} />
                        </div>
                      </div>
                      <DialogFooter className="pt-4">
                        <Button type="submit" className="w-full sm:w-auto">{editingProduct ? 'Save Changes' : 'Create Item'}</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsLoading ? (
                <div className="col-span-full py-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto opacity-20" /></div>
              ) : filteredProducts.map((product) => (
                <Card key={product.id} className="bg-card/50 border-primary/10 group overflow-hidden">
                  <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="object-cover w-full h-full transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="flex items-center justify-center h-full"><ImageIcon className="h-10 w-10 text-muted-foreground/20" /></div>
                    )}
                    <Badge className="absolute top-2 left-2 bg-black/60 backdrop-blur-md">{product.category}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <p className="text-primary font-bold">GH₵{product.price?.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { 
                          setEditingProduct(product); 
                          setProductForm({
                            name: product.name,
                            price: product.price.toString(),
                            category: product.category,
                            description: product.description,
                            image: product.image,
                            imageHint: product.imageHint || '',
                            colors: product.colors.join(', '),
                            sizes: product.sizes.join(', ')
                          });
                          setIsProductDialogOpen(true);
                        }}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => { if(confirm("Delete this product?")) deleteDoc(doc(db, 'products', product.id)); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
