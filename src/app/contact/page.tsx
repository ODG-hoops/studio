// src/app/contact/page.tsx
import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Contact Us</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have questions? We're here to help. Reach out to us anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Mail className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Email</h3>
                <p className="text-muted-foreground">
                  Send us an email and we'll get back to you shortly.
                </p>
                <a href="mailto:stylemaverikclothing@gmail.com" className="text-primary hover:underline mt-1 block">
                  stylemaverikclothing@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Phone className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Phone</h3>
                <p className="text-muted-foreground">
                  Give us a call during our business hours.
                </p>
                <a href="tel:+233598663290" className="text-primary hover:underline mt-1 block">
                  +233 59 866 3290
                </a>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Our Location</h3>
                <p className="text-muted-foreground">
                  Accra, Ghana
                </p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Input id="name" placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                  <Input id="email" type="email" placeholder="Your Email" />
                </div>
                <div className="space-y-2">
                  <Textarea id="message" placeholder="Your Message" rows={5} />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
