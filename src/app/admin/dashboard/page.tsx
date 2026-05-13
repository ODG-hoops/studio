'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore, useUser, useCollection } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Package, LogOut, Calendar as CalendarIcon, DollarSign, MapPin, Mail, RefreshCw, Trash2, ExternalLink, Search } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Stabilize the query to prevent infinite re-renders
  const ordersQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: orders, loading: ordersLoading } = useCollection(ordersQuery);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    if (!db) return;
    const orderRef = doc(db, 'orders', orderId);
    
    updateDoc(orderRef, { status: newStatus })
      .then(() => {
        toast({ title: "Status Updated", description: `Order ${orderId.slice(-6)} is now ${newStatus}.` });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: orderRef.path,
          operation: 'update',
          requestResourceData: { status: newStatus },
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleDeleteOrder = (orderId: string) => {
    if (!db || !window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;
    
    const orderRef = doc(db, 'orders', orderId);
    deleteDoc(orderRef)
      .then(() => {
        toast({ title: "Order Deleted", description: "The order has been removed from the records." });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: orderRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
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
      order.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.paymentReference?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  const totalRevenue = (orders as any[])?.reduce((acc, order) => acc + (order.total || 0), 0) || 0;

  if (authLoading || !user) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground animate-pulse tracking-widest uppercase text-xs">Authenticating Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-primary/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary font-serif">Management Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm">Style Maverik INC. Internal Logistics</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <Button variant="ghost" size="sm" onClick={() => window.location.reload()} className="text-muted-foreground hover:text-primary hidden sm:flex">
               <RefreshCw className="h-4 w-4 mr-2" /> Refresh
             </Button>
             <Button variant="outline" size="sm" onClick={handleLogout} className="border-primary/20 hover:bg-primary/5 ml-auto md:ml-0">
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="bg-card/50 border-primary/20 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">GH₵{totalRevenue.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</div>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter opacity-70">Gross sales to date</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-primary/20 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(orders as any[])?.length || 0}</div>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter opacity-70">All-time volume</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500/5 border-yellow-500/10 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] uppercase tracking-widest text-yellow-600/70 dark:text-yellow-500/70">Awaiting Fulfilment</CardTitle>
              <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin-slow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(orders as any[])?.filter(o => o.status === 'pending' || o.status === 'processing').length || 0}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter opacity-70">Active tasks</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/5 border-green-500/10 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] uppercase tracking-widest text-green-600/70 dark:text-green-500/70">Fulfilled</CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(orders as any[])?.filter(o => o.status === 'delivered').length || 0}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter opacity-70">Successfully delivered</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/10 shadow-xl overflow-hidden bg-card/30 backdrop-blur-sm">
          <CardHeader className="bg-muted/30 border-b border-primary/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="font-serif">Live Order Feed</CardTitle>
              <CardDescription>Real-time purchase stream and logistics management.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input 
                placeholder="Search orders..." 
                className="pl-9 h-9 text-xs bg-background/50 border-primary/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {ordersLoading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Syncing Database...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/10">
                    <TableRow className="hover:bg-transparent border-primary/5">
                      <TableHead className="text-[10px] uppercase tracking-widest py-4">Customer Details</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest">Location</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest">Items</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest">Total</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest">Status</TableHead>
                      <TableHead className="text-right text-[10px] uppercase tracking-widest pr-6">Management</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-muted/20 transition-colors border-primary/5">
                        <TableCell className="py-5">
                          <div className="flex flex-col">
                             <div className="font-semibold text-sm flex items-center gap-2">
                               <Mail className="h-3.5 w-3.5 text-primary/60" />
                               {order.customerEmail}
                             </div>
                             <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 font-medium">
                               <CalendarIcon className="h-3 w-3" />
                               {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : 'Syncing...'}
                             </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <MapPin className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                            {order.location}
                          </div>
                        </TableCell>
                        <TableCell>
                           <Dialog>
                             <DialogTrigger asChild>
                               <Button variant="link" className="p-0 h-auto text-xs text-primary font-bold flex items-center gap-1">
                                 {order.items?.length || 0} item(s) <ExternalLink className="h-2.5 w-2.5" />
                               </Button>
                             </DialogTrigger>
                             <DialogContent className="bg-card border-primary/20">
                               <DialogHeader>
                                 <DialogTitle className="font-serif">Order Details</DialogTitle>
                                 <DialogDescription>Ordered items for {order.customerEmail}</DialogDescription>
                               </DialogHeader>
                               <div className="space-y-4 mt-4">
                                 {order.items?.map((item: any, idx: number) => (
                                   <div key={idx} className="flex justify-between items-center p-3 border border-primary/5 rounded bg-muted/20">
                                     <div>
                                       <p className="font-bold text-sm">{item.name}</p>
                                       <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Size: {item.size} | Color: {item.color}</p>
                                     </div>
                                     <div className="text-right">
                                       <p className="text-sm font-bold">x{item.quantity}</p>
                                       <p className="text-xs text-primary font-mono">GH₵{(item.price * item.quantity).toFixed(2)}</p>
                                     </div>
                                   </div>
                                 ))}
                                 <div className="pt-4 border-t border-primary/10 flex justify-between items-center">
                                   <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground opacity-60">Payment Reference: {order.paymentReference || 'N/A'}</span>
                                   <span className="text-lg font-bold">Total: GH₵{order.total?.toFixed(2)}</span>
                                 </div>
                               </div>
                             </DialogContent>
                           </Dialog>
                        </TableCell>
                        <TableCell>
                           <div className="flex flex-col">
                              <span className="font-bold text-sm">GH₵{order.total?.toFixed(2)}</span>
                              <span className="text-[9px] text-muted-foreground font-mono uppercase opacity-60">REF: {order.paymentReference?.slice(-8) || 'N/A'}</span>
                           </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={`capitalize px-2 py-0.5 h-6 text-[10px] font-bold shadow-none ${
                              order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' : 
                              order.status === 'processing' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                              order.status === 'shipped' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' :
                              order.status === 'delivered' ? 'bg-green-500/10 text-green-600 border-green-500/20' : ''
                            }`}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <Select
                              defaultValue={order.status}
                              onValueChange={(val) => handleStatusChange(order.id, val)}
                            >
                              <SelectTrigger className="w-[120px] h-8 text-[10px] border-primary/20 bg-background/50 hover:bg-background">
                                <SelectValue placeholder="Action" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Mark Pending</SelectItem>
                                <SelectItem value="processing">Start Processing</SelectItem>
                                <SelectItem value="shipped">Mark Shipped</SelectItem>
                                <SelectItem value="delivered">Mark Delivered</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredOrders.length === 0 && !ordersLoading && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-32">
                          <div className="flex flex-col items-center gap-3 opacity-30">
                            <Package className="h-12 w-12 text-primary" />
                            <p className="text-xs uppercase tracking-widest font-medium">
                              {searchTerm ? "No matching orders found." : "No sales recorded yet."}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="text-center">
         <p className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.4em] font-medium">
           Style Maverik INC. Internal Access Only
         </p>
      </div>
    </div>
  );
}
