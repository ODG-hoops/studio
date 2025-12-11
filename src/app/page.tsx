import { HeroSection } from '@/components/hero-section';
import { ProductCard } from '@/components/product-card';
import PersonalizedRecommendations from '@/components/personalized-recommendations';
import { products } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const featuredProducts = products.slice(0, 2);

  return (
    <>
      <HeroSection />
      <section id="featured" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Featured Collection
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Discover our handpicked selection of standout pieces from the latest collection.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/collections">
                <span>View All</span>
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
