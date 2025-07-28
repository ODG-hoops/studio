import Link from 'next/link';
import { Button } from './ui/button';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative h-[80vh] md:h-screen w-full flex items-center justify-center text-center text-white overflow-hidden">
      <Image
        src="https://placehold.co/1920x1080"
        alt="A person wearing a Maverik sweatshirt looking out over a landscape"
        data-ai-hint="fashion outdoors"
        fill
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        priority
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 -z-10"></div>
      <div className="container mx-auto px-4 z-10 animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
          Style Maverik INC.
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-white/90 drop-shadow-md">
          Redefining Modern Elegance
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/collections">Shop Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
