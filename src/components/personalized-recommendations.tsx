'use client';

import { useState, useEffect } from 'react';
import { fetchRecommendations } from '@/app/actions';
import { products as allProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ProductCard } from './product-card';
import { Skeleton } from './ui/skeleton';

export default function PersonalizedRecommendations() {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate user browsing history with a couple of product IDs.
    const browsingHistory = ['p2', 'p6']; 
    
    async function getRecs() {
      setLoading(true);
      try {
        const result = await fetchRecommendations({ browsingHistory });
        if (result && result.recommendations) {
          const recommendedProducts = allProducts.filter((p) =>
            result.recommendations.includes(p.id)
          );
          setRecommendations(recommendedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        setRecommendations([]); // Clear recommendations on error
      } finally {
        setLoading(false);
      }
    }

    getRecs();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Recommended For You</h2>
          <p className="text-muted-foreground mt-2">Personalized suggestions based on your activity.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="w-full aspect-[3/4] rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return null; // Don't render the section if there are no recommendations
  }

  return (
    <section className="py-16 md:py-24">
       <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Recommended For You</h2>
          <p className="text-muted-foreground mt-2">Personalized suggestions based on your activity.</p>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
