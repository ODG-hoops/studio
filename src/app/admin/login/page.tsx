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
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { checkLoginBlock } from '@/app/actions';

export default function AdminLoginPage() {
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [configError, setConfigError] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth) {
      toast({ title: "System Error", description: "Firebase connection not established.", variant: "destructive" });
      return;
    }

    if (!accessCode) {
      toast({ title: "Code Required", description: "Please enter your admin access code.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setConfigError(false);
    
    try {
      // 1. Check Rate Limit via Server Action
      const rateLimitCheck = await checkLoginBlock();
      if (!rateLimitCheck.allowed) {
        toast({
          title: "Access Restricted",
          description: rateLimitCheck.error || "Too many failed attempts. Try again later.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // 2. Official business email is hidden secure ID
      await signInWithEmailAndPassword(auth, 'stylemaverikclothing@gmail.com', accessCode);
      
      toast({ title: "Authorized", description: "Identity verified. Redirecting..." });
      router.push('/admin/dashboard');
    } catch (error: any) {
      console.error("Auth error code:", error.code);
      
      let errorMessage = "The access code provided is incorrect.";
      
      if (error.code === 'auth/api-key-not-valid' || error.code === 'auth/invalid-api-key') {
        errorMessage = "Configuration error. Please check your Firebase settings.";
        setConfigError(true);
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Email/Password provider is not enabled in Firebase Console.";
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = "Access Denied. Check your code or try again later.";
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
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4">
      {configError && (
        <Alert variant="destructive" className="max-w-md mb-6 bg-destructive/10 border-destructive/20 text-destructive-foreground">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Setup Required</AlertTitle>
          <AlertDescription className="text-xs">
            Firebase keys are missing or invalid. Verify <code>src/firebase/config.ts</code> matches your Firebase Console.
          </AlertDescription>
        </Alert>
      )}

      <Card className="w-full max-w-md border-primary/20 shadow-2xl bg-card/80 backdrop-blur-md">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-4">
             <div className="p-4 bg-primary/10 rounded-full border border-primary/30 shadow-inner">
                <ShieldCheck className="h-8 w-8 text-primary" />
             </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight font-serif">Admin Access</CardTitle>
          <CardDescription>Secure login for Style Maverik INC.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="accessCode" className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1 font-bold">Admin Access Code</Label>
              <Input
                id="accessCode"
                type="password"
                placeholder="••••••••••••"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                required
                disabled={loading}
                className="bg-background/50 border-primary/20 focus:border-primary transition-all text-center text-xl tracking-[0.4em] h-14"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-bold shadow-lg" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Verify Identity"}
            </Button>
          </form>
          <div className="mt-8 pt-6 border-t border-primary/10">
             <p className="text-[10px] text-center text-muted-foreground uppercase tracking-[0.2em] font-medium opacity-50">
               Rate-limited secure portal
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
