'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ShoppingCart, User, LogOut, Settings } from 'lucide-react';

export function Navigation() {
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      // Error is handled by the auth hook
    }
  };

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          AgroFresh
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/catalogue">
            <Button variant="ghost">Catalogue</Button>
          </Link>

          {user ? (
            <>
              <Link href="/cart">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/auth?tab=signup">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 