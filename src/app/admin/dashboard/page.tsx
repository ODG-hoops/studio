
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore, useUser, useCollection } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Package, LogOut, Calendar as CalendarIcon, DollarSign, MapPin, Mail } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const ordersQuery = db ? query(collection(db, 'orders'), orderBy('createdAt', 'desc')) : null;
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
        toast({ title: "Status Updated", description: `Order status changed to ${newStatus}.` });
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

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/admin/login');
    }
  };

  const totalRevenue = (orders as any[])?.reduce((acc, order) => acc + (order.total || 0), 0) || 0;

  if (authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground animate-pulse font-medium">Authenticating Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Management Dashboard</h1>
            <p className="text-muted-foreground mt-1">Oversee Style Maverik INC. orders and logistics.</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="border-primary/20 hover:bg-primary/5">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="bg-card/50 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">GH₵{totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Gross sales to date</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(orders as any[])?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">All-time volume</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500/5 border-yellow-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-500">Active Tasks</CardTitle>
              <Loader2 className="h-4 w-4 text-yellow-500 animate-spin-slow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(orders as any[])?.filter(o => o.status === 'pending' || o.status === 'processing').length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Pending processing</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/5 border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-600 dark:text-green-500">Fulfilled</CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(orders as any[])?.filter(o => o.status === 'delivered').length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Orders delivered</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/10 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Live stream of incoming customer transactions.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Refreshing orders...</p>
              </div>
            ) : (
              <div className="rounded-md border bg-background/50 overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="w-[200px]">Customer</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(orders as any[])?.map((order) => (
                      <TableRow key={order.id} className="hover:bg-muted/10 transition-colors">
                        <TableCell>
                          <div className="flex flex-col">
                             <div className="font-semibold text-sm flex items-center gap-1.5">
                               <Mail className="h-3 w-3 text-muted-foreground" />
                               {order.customerEmail}
                             </div>
                             <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                               <CalendarIcon className="h-2.5 w-2.5" />
                               {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : 'Just now'}
                             </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm">
                            <MapPin className="h-3 w-3 text-primary/60" />
                            {order.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs space-y-1 py-1">
                            {order.items?.map((item: any, idx: number) => (
                              <div key={idx} className="flex gap-2">
                                <span className="font-medium text-foreground">{item.name}</span>
                                <span className="text-muted-foreground">({item.size}, {item.color}) x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold whitespace-nowrap">GH₵{order.total?.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={order.status === 'delivered' ? 'outline' : 'default'} 
                            className={`capitalize px-2 py-0 h-6 text-[10px] font-bold ${
                              order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' : 
                              order.status === 'processing' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                              order.status === 'delivered' ? 'bg-green-500/10 text-green-600 border-green-500/20' : ''
                            }`}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            defaultValue={order.status}
                            onValueChange={(val) => handleStatusChange(order.id, val)}
                          >
                            <SelectTrigger className="w-[110px] h-8 text-[10px] ml-auto border-primary/20">
                              <SelectValue placeholder="Status" />
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
                    {(orders as any[])?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-20">
                          <div className="flex flex-col items-center gap-2">
                            <Package className="h-10 w-10 text-muted-foreground/20" />
                            <p className="text-muted-foreground">No orders recorded yet.</p>
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
    </div>
  );
}
