
'use client';

import { useState, useEffect, useMemo } from 'react';
import { fetchRecommendations } from '@/app/actions';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where, documentId } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { ProductCard } from './product-card';
import { Skeleton } from './ui/skeleton';

export default function PersonalizedRecommendations() {
  const db = useFirestore();
  const [recommendationIds, setRecommendationsIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyExists, setHistoryExists] = useState(false);

  useEffect(() => {
    async function getRecs() {
      setLoading(true);
      const storedHistory = localStorage.getItem('browsingHistory');
      const browsingHistory = storedHistory ? JSON.parse(storedHistory) : [];
      
      if (browsingHistory.length === 0) {
        setLoading(false);
        setHistoryExists(false);
        return;
      }
      setHistoryExists(true);

      try {
        const result = await fetchRecommendations({ browsingHistory });
        if (result && result.recommendations) {
          setRecommendationsIds(result.recommendations);
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setLoading(false);
      }
    }

    getRecs();
  }, []);

  // Fetch the actual product objects from Firestore based on IDs
  const recommendedQuery = useMemo(() => {
    if (!db || recommendationIds.length === 0) return null;
    // Firestore where 'in' limit is 10
    return query(collection(db, 'products'), where(documentId(), 'in', recommendationIds.slice(0, 10)));
  }, [db, recommendationIds]);

  const { data: recommendedProducts, loading: fetchingProducts } = useCollection(recommendedQuery);

  if (!historyExists) return null;

  if (loading || fetchingProducts) {
    return (
      <section className="py-16 md:py-24 border-t border-primary/10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight font-serif">Curated for You</h2>
          <p className="text-muted-foreground mt-2 text-xs uppercase tracking-widest">AI Selection</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="w-full aspect-[3/4] rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  if (!recommendedProducts || recommendedProducts.length === 0) return null;

  return (
    <section className="py-16 md:py-24 border-t border-primary/10">
       <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-serif">Curated for You</h2>
          <p className="text-muted-foreground mt-2 text-xs uppercase tracking-widest font-medium opacity-70">Personalized suggestions based on your taste</p>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {recommendedProducts.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
