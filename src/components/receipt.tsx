// src/components/receipt.tsx
import type { Product } from '@/lib/types';
import { Separator } from './ui/separator';

type CartItem = Product & { quantity: number };

interface ReceiptProps {
  items: CartItem[];
  total: number;
  location: string;
}

export function Receipt({ items, total, location }: ReceiptProps) {
  return (
    <div className="border rounded-lg p-6 bg-muted/20">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <ul className="space-y-3">
        {items.map(item => (
          <li key={item.id} className="flex justify-between items-center text-sm">
            <span>{item.name} (x{item.quantity})</span>
            <span>GH₵{(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <Separator className="my-4" />
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery Location</span>
          <span>{location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span className="font-medium">To be determined</span>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between font-bold text-lg">
        <span>Total (excluding delivery)</span>
        <span>GH₵{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
