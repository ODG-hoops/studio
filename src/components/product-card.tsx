import type { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group relative w-full overflow-hidden rounded-lg border-0 shadow-lg transition-all duration-300 hover:shadow-primary/20">
      <Link href="#">
        <CardContent className="p-0">
          <div className="aspect-[3/4] overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              data-ai-hint={product.imageHint}
              width={600}
              height={800}
              className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-semibold truncate">{product.name}</h3>
            <p className="text-sm text-primary">${product.price.toFixed(2)}</p>
          </div>
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="secondary" aria-label="Add to cart">
              <ShoppingCart className="h-5 w-5"/>
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
