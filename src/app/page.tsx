
'use client';

import { HeroSection } from '@/components/hero-section';
import { ProductCard } from '@/components/product-card';
import PersonalizedRecommendations from '@/components/personalized-recommendations';
import { products as fallbackProducts } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, limit, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';

export default function Home() {
  const db = useFirestore();

  const featuredQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('updatedAt', 'desc'), limit(2));
  }, [db]);

  const { data: firestoreProducts, loading } = useCollection(featuredQuery);

  const featuredProducts = useMemo(() => {
    if (firestoreProducts && firestoreProducts.length > 0) return firestoreProducts;
    if (!loading) return fallbackProducts.slice(0, 2);
    return [];
  }, [firestoreProducts, loading]);

  return (
    <>
      <HeroSection />
      <section id="featured" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-serif">
              Featured Collection
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto uppercase text-xs tracking-[0.2em] font-medium opacity-60">
              New arrivals at Style Maverik INC.
            </p>
          </div>
          
          {loading && featuredProducts.length === 0 ? (
            <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary/20" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-10 rounded-full shadow-lg">
              <Link href="/collections">
                <span>View Full Catalog</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4">
        <PersonalizedRecommendations />
      </div>
    </>
  );
}
