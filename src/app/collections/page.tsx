import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/data';

export default function CollectionsPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Our Collections</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Explore our curated selection of timeless pieces and modern essentials.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
