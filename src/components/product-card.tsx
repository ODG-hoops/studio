
import type { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = (product.stock || 0) <= 0;

  return (
    <Card className="group relative w-full overflow-hidden rounded-lg border-0 shadow-lg transition-all duration-300 hover:shadow-primary/20">
      <Link href={`/products/${product.id}`} className="block">
        <CardContent className="p-0">
          <div className="aspect-[3/4] overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              data-ai-hint={product.imageHint}
              width={600}
              height={800}
              className={`object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
            />
          </div>
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <Badge variant="destructive" className="text-sm px-4 py-1 uppercase tracking-widest font-bold shadow-xl">Out of Stock</Badge>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-semibold truncate">{product.name}</h3>
            <p className="text-sm text-primary font-bold">GH₵{product.price.toFixed(2)}</p>
          </div>
           {!isOutOfStock && (
             <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <Button size="icon" variant="secondary" aria-label="View Details">
                  <ShoppingCart className="h-5 w-5"/>
              </Button>
            </div>
           )}
        </CardContent>
      </Link>
    </Card>
  );
}
