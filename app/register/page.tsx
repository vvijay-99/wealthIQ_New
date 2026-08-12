'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Mail, Lock, User, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { supabase, getAuthRedirectUrl } from '@/lib/supabase/client';

function signUpErrorMessage(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes('password')) return 'Choose a stronger password and try again.';
  if (normalized.includes('rate limit')) return 'Too many attempts. Please try again later.';
  if (normalized.includes('already registered') || normalized.includes('already exists')) return 'Unable to create this account. Try signing in instead.';
  return 'We could not create your account. Please try again.';
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); setError(null); setMessage(null);
    const formData = new FormData(e.currentTarget);
    const fullName = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    const password = String(formData.get('password') ?? '');
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: getAuthRedirectUrl(), data: { full_name: fullName } },
    });
    if (signUpError) { setError(signUpErrorMessage(signUpError.message)); setLoading(false); return; }
    if (data.session && data.user) {
      const profilePayload = { user_id: data.user.id, full_name: fullName };
      const { error: profileError } = await (supabase.from('profiles') as any).upsert(profilePayload, { onConflict: 'user_id' });
      if (profileError) { setError('Your account was created, but profile setup could not be completed.'); setLoading(false); return; }
      router.replace('/onboarding'); return;
    }
    setMessage('Check your email to confirm your account, then sign in to continue.');
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="relative hidden flex-1 flex-col justify-between bg-sidebar p-12 text-sidebar-foreground lg:flex"><div className="absolute inset-0 bg-gradient-to-br from-sidebar-accent/20 to-transparent" /><div className="relative"><Link href="/" className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-accent"><Brain className="h-5 w-5 text-white" /></div><span className="text-xl font-bold">WealthIQ</span></Link></div><div className="relative space-y-4"><h2 className="text-3xl font-bold leading-tight">Start understanding your financial health today</h2><ul className="space-y-3">{['Comprehensive Financial Health Score','AI-powered spending risk analysis','Personalized recommendations','Financial forecasting'].map((item) => <li key={item} className="flex items-center gap-2 text-sidebar-muted"><Check className="h-4 w-4 text-sidebar-accent" />{item}</li>)}</ul></div><div className="relative text-xs text-sidebar-muted">Educational AI Project — Not professional financial advice.</div></div>
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12"><div className="w-full max-w-sm"><div className="mb-8 lg:hidden"><Link href="/" className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary"><Brain className="h-5 w-5 text-white" /></div><span className="text-xl font-bold">WealthIQ</span></Link></div><Card><CardHeader><CardTitle className="text-2xl">Create your account</CardTitle><p className="text-sm text-muted-foreground">Get started with WealthIQ in seconds.</p></CardHeader><CardContent>
        {error && <div role="alert" className="mb-4 flex items-start gap-2 rounded-lg border border-danger/20 bg-danger/5 p-3"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" /><p className="text-sm text-danger">{error}</p></div>}{message && <div role="status" className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-primary">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4"><div className="space-y-2"><Label htmlFor="name">Full Name</Label><div className="relative"><User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="name" name="name" type="text" placeholder="John Doe" className="pl-9" required /></div></div><div className="space-y-2"><Label htmlFor="email">Email</Label><div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="email" name="email" type="email" placeholder="you@example.com" className="pl-9" required /></div></div><div className="space-y-2"><Label htmlFor="password">Password</Label><div className="relative"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="password" name="password" type="password" placeholder="••••••••" className="pl-9" minLength={6} required /></div><p className="text-xs text-muted-foreground">At least 6 characters.</p></div><Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}{!loading && <ArrowRight className="ml-2 h-4 w-4" />}</Button></form><p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link></p>
      </CardContent></Card></div></div>
    </div>
  );
}
