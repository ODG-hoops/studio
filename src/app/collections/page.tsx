
'use client';

import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';
import { ProductCard } from '@/components/product-card';
import { products as fallbackProducts } from '@/lib/data';
import { Loader2, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
        <div className="flex flex-col items-center justify-center gap-2 mb-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Our Collections</h1>
            {isLive && (
                <Badge variant="outline" className="text-[8px] uppercase tracking-[0.2em] h-5 gap-1 opacity-50">
                    <Database className="h-2 w-2" /> Live Database
                </Badge>
            )}
        </div>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Explore our curated selection of timeless pieces and modern essentials.
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
