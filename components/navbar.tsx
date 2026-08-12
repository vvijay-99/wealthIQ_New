'use client';

import { useEffect } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface NavbarProps { onMenuClick: () => void; }

export function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();
  const { user, signOut, authState } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Account';
  const initials = displayName.split(/\s+/).map((part: string) => part[0]).join('').slice(0, 2).toUpperCase();
  useEffect(() => { if (authState === 'unauthenticated') router.replace('/login'); }, [authState, router]);
  const handleSignOut = async () => { try { await signOut(); } catch { router.replace('/login'); } };

  return <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6"><button onClick={onMenuClick} className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden" aria-label="Toggle menu"><Menu className="h-5 w-5" /></button><div className="relative hidden max-w-md flex-1 md:block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input type="search" placeholder="Search..." className="border-0 bg-muted/50 pl-9" /></div><div className="flex flex-1 items-center justify-end gap-3"><button aria-label="Notifications" className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted"><Bell className="h-5 w-5" /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" /></button><DropdownMenu><DropdownMenuTrigger asChild><button className="flex items-center gap-2 rounded-lg p-1 hover:bg-muted" aria-label="Open account menu"><Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">{initials}</AvatarFallback></Avatar></button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56"><DropdownMenuLabel><div className="text-sm font-medium">{displayName}</div><div className="text-xs text-muted-foreground">{user?.email}</div></DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem><DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onClick={handleSignOut} className="text-danger">Sign Out</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div></header>;
}
