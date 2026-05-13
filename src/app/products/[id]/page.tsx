
'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { colorNameToHex } from '@/lib/colors';
import { products as fallbackProducts } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

type CartItem = Product & { quantity: number; size: string; color: string; };

export default function ProductDetailPage() {
  const { toast } = useToast();
  const params = useParams();
  const productId = params.id as string;
  const db = useFirestore();

  const productRef = useMemo(() => {
    if (!db || !productId) return null;
    return doc(db, 'products', productId);
  }, [db, productId]);

  const { data: firestoreProduct, loading } = useDoc(productRef);

  // Determine which product to show. If Firestore loading is done and nothing found, check fallback.
  const product: any = useMemo(() => {
    if (firestoreProduct) return firestoreProduct;
    if (!loading) return fallbackProducts.find(p => p.id === productId);
    return null;
  }, [firestoreProduct, loading, productId]);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const isOutOfStock = product && (product.stock || 0) <= 0;

  useEffect(() => {
    if (product) {
      const storedHistory = localStorage.getItem('browsingHistory');
      let history = storedHistory ? JSON.parse(storedHistory) : [];
      history = [product.id, ...history.filter((id: string) => id !== product.id)];
      if (history.length > 10) history.pop();
      localStorage.setItem('browsingHistory', JSON.stringify(history));
    }
  }, [product]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!product && !loading) {
    notFound();
  }
  
  const handleAddToCart = () => {
    if (isOutOfStock) return;
    
    if (!selectedSize || !selectedColor) {
      toast({ title: "Selection required", description: "Please select a size and color.", variant: "destructive" });
      return;
    }

    const cartData = localStorage.getItem('cart');
    const cart = cartData ? JSON.parse(cartData) : { items: [] };

    const existingItemIndex = cart.items.findIndex(
      (item: CartItem) => item.id === product.id && item.size === selectedSize && item.color === selectedColor
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += 1;
    } else {
      cart.items.push({ ...product, quantity: 1, size: selectedSize, color: selectedColor });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    toast({ title: "Added to Cart", description: `${product.name} (${selectedColor}, ${selectedSize}) added.` });
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="aspect-square w-full relative">
          <Image
            src={product.image || 'https://placehold.co/600x600/png?text=Product'}
            alt={product.name}
            data-ai-hint={product.imageHint || 'clothing item'}
            fill
            className={cn("rounded-lg shadow-lg object-cover", isOutOfStock && "grayscale opacity-70")}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Badge variant="destructive" className="text-xl px-8 py-3 uppercase tracking-[0.2em] font-black shadow-2xl">Out of Stock</Badge>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="text-[10px] uppercase tracking-widest">{product.category}</Badge>
              {product.stock > 0 && product.stock <= 5 && (
                <Badge variant="secondary" className="text-[10px] bg-orange-500/20 text-orange-500 border-orange-500/20">Only {product.stock} left</Badge>
              )}
            </div>
            <h1 className="text-4xl font-bold tracking-tight font-serif">{product.name}</h1>
            <p className="text-2xl text-primary mt-2 font-bold">GH₵{product.price?.toFixed(2)}</p>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-primary/10">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-3">Color</h3>
              <RadioGroup onValueChange={setSelectedColor} className="flex flex-wrap gap-3" disabled={isOutOfStock}>
                {product.colors?.map((color: string) => (
                  <div key={color}>
                    <RadioGroupItem value={color} id={`color-${color}`} className="sr-only" />
                    <Label
                      htmlFor={`color-${color}`}
                      className={cn(
                        "cursor-pointer rounded-full h-8 w-8 flex items-center justify-center transition-all",
                        selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-background ring-primary scale-110' : 'ring-1 ring-border opacity-70',
                        isOutOfStock && "cursor-not-allowed opacity-30"
                      )}
                      style={{ backgroundColor: colorNameToHex[color] || '#ccc' }}
                      title={color}
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-3">Size</h3>
              <RadioGroup onValueChange={setSelectedSize} className="flex flex-wrap gap-2" disabled={isOutOfStock}>
                {product.sizes?.map((size: string) => (
                   <div key={size}>
                    <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                    <Label
                      htmlFor={`size-${size}`}
                      className={cn(
                        "cursor-pointer rounded-md border-2 px-4 py-2 text-xs font-bold transition-all",
                        selectedSize === size ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40",
                        isOutOfStock && "cursor-not-allowed opacity-30"
                      )}
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="w-full mt-8 h-14 text-lg font-bold shadow-xl" 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? (
              <>
                <AlertCircle className="mr-2 h-5 w-5" /> Out of Stock
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Order
              </>
            )}
          </Button>
          
          {isOutOfStock && (
            <p className="text-xs text-center text-muted-foreground font-medium uppercase tracking-widest opacity-50">
              This item is currently unavailable for purchase.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
