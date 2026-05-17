'use client';

import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';
import { ProductCard } from '@/components/product-card';
import { products as fallbackProducts } from '@/lib/data';
import { Loader2 } from 'lucide-react';

export default function CollectionsPage() {
  const db = useFirestore();

  const productsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('name', 'asc'));
  }, [db]);

  const { data: firestoreProducts, loading } = useCollection(productsQuery);

  const isLive = firestoreProducts && firestoreProducts.length > 0;

  // Use Firestore data if available, otherwise fallback to local data if loading is done and nothing was found
  const displayProducts = isLive 
    ? firestoreProducts 
    : (loading ? [] : fallbackProducts);

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Our Collections</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto uppercase text-[10px] tracking-[0.2em] font-bold opacity-60">
          Curated Essentials
        </p>
      </div>

      {loading && displayProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground uppercase tracking-widest text-xs font-medium">Curating Collection...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {displayProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
