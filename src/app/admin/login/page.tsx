'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth) {
      toast({
        title: "System Error",
        description: "Firebase is not initialized. Please check your configuration.",
        variant: "destructive",
      });
      return;
    }

    if (!accessCode) {
      toast({
        title: "Code Required",
        description: "Please enter your management access code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // The requested code is used as the password for the management account
      // Code: @admin.stylemaverik2021
      await signInWithEmailAndPassword(auth, 'management@stylemaverik.com', accessCode);
      
      toast({ title: "Authorized", description: "Welcome to the management portal." });
      router.push('/admin/dashboard');
    } catch (error: any) {
      console.error("Auth error:", error);
      
      let errorMessage = "The access code provided is incorrect.";
      
      if (error.code === 'auth/api-key-not-valid' || error.code === 'auth/invalid-api-key') {
        errorMessage = "Firebase configuration is invalid. Please update your API key in src/firebase/config.ts.";
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Access denied. Verify your code or ensure the management user exists in Firebase.";
      }

      toast({
        title: "Access Denied",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-32 flex justify-center items-center">
      <Card className="w-full max-w-md border-primary/20 shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
             <div className="p-4 bg-primary/10 rounded-full border border-primary/20">
                <ShieldCheck className="h-8 w-8 text-primary" />
             </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Management Access</CardTitle>
          <CardDescription>Enter your secure access code to manage Style Maverik INC.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="accessCode">Access Code</Label>
              <Input
                id="accessCode"
                type="password"
                placeholder="••••••••••••"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                required
                disabled={loading}
                className="bg-background border-primary/20 focus:border-primary transition-colors text-center text-lg tracking-widest"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Verify Identity"}
            </Button>
          </form>
          <p className="mt-6 text-[10px] text-center text-muted-foreground uppercase tracking-[0.2em]">
            Style Maverik INC. Internal Systems
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
