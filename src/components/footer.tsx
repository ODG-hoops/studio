import Link from 'next/link';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t border-border/40">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="font-bold text-lg tracking-wider text-primary">STYLE MAVERIK</h3>
            <p className="mt-2 text-sm text-muted-foreground">Redefining Modern Elegance.</p>
            <div className="flex space-x-4 mt-4">
              <Link href="https://www.instagram.com/stylemaverik_clothing" aria-label="Instagram"><Instagram className="h-5 w-5 hover:text-primary transition-colors" /></Link>
              <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 hover:text-primary transition-colors" /></Link>
              <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5 hover:text-primary transition-colors" /></Link>
            </div>
          </div>
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold">Shop</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/collections" className="text-muted-foreground hover:text-primary">Collections</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Men</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Women</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">About</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary">Our Story</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Sustainability</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Newsletter</h4>
              <p className="mt-4 text-sm text-muted-foreground">Subscribe for exclusive updates.</p>
              <form className="flex space-x-2 mt-2">
                <Input type="email" placeholder="Your Email" className="bg-input" />
                <Button type="submit" size="icon" aria-label="Subscribe">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Style Maverik INC. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
