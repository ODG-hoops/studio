// src/app/products/[id]/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { products } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

type CartItem = Product & { quantity: number; size: string; color: string; };

export default function ProductDetailPage() {
  const { toast } = useToast();
  const params = useParams();
  const productId = params.id as string;
  const product = products.find(p => p.id === productId);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  if (!product) {
    notFound();
  }
  
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: "Selection required",
        description: "Please select a size and color.",
        variant: "destructive",
      });
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
    // Dispatch a storage event to update the header
    window.dispatchEvent(new Event('storage'));

    toast({
      title: "Added to Cart",
      description: `${product.name} (${selectedColor}, ${selectedSize}) has been added to your cart.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="aspect-square w-full relative">
          <Image
            src={product.image}
            alt={product.name}
            data-ai-hint={product.imageHint}
            fill
            className="rounded-lg shadow-lg object-cover"
          />
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-2xl text-primary mt-2">GH₵{product.price.toFixed(2)}</p>
          </div>
          
          <p className="text-muted-foreground">{product.description}</p>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Color</h3>
              <RadioGroup onValueChange={setSelectedColor} className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <div key={color}>
                    <RadioGroupItem value={color} id={`color-${color}`} className="sr-only" />
                    <Label
                      htmlFor={`color-${color}`}
                      className={cn(
                        "cursor-pointer rounded-md border-2 px-4 py-2 transition-colors",
                        selectedColor === color ? "border-primary bg-primary/10" : "border-border"
                      )}
                    >
                      {color}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Size</h3>
              <RadioGroup onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                   <div key={size}>
                    <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                    <Label
                      htmlFor={`size-${size}`}
                      className={cn(
                        "cursor-pointer rounded-md border-2 px-4 py-2 transition-colors",
                        selectedSize === size ? "border-primary bg-primary/10" : "border-border"
                      )}
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          
          <Button size="lg" className="w-full mt-8" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
