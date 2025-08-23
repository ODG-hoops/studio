import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-card">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">Our Story</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Forged from a passion for minimalist design and timeless elegance.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold tracking-tight">Brand Mission</h2>
              <p className="mt-4 text-muted-foreground">
                At Style Maverik INC., our mission is to create high-quality, sustainable pieces that transcend fleeting trends. We believe in conscious consumption and crafting garments that are not only beautiful but also built to last. Each collection is a testament to our commitment to craftsmanship, ethical production, and a modern, minimalist aesthetic.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="https://i.postimg.cc/FsLXCFTW/brand-mission.jpg"
                alt="Behind the scenes at Style Maverik"
                data-ai-hint="fashion designer studio"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
             <div>
              <Image
                src="https://i.postimg.cc/kX9LsNt4/the-maverik-spirit.jpg"
                alt="Style Maverik clothing details"
                data-ai-hint="fabric swatch"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">The Maverick Spirit</h2>
              <p className="mt-4 text-muted-foreground">
                We are for the independent thinkers, the creators, and the modern connoisseurs who appreciate refined simplicity. Style Maverik is more than a brand; it's a philosophy of living with intention and dressing with confidence. We invite you to be part of our journey in redefining elegance for the contemporary world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
