'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { UserNav } from './user-nav';
import { Icons } from './icons';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useSession } from 'next-auth/react';
import { SigninNav } from './signin-nav';

const navItems: { title: string; href: string }[] = [
  {
    title: 'Communities',
    href: '/community',
  },
];

export default function NavBar() {
  const pathName = usePathname();
  const isPathActive = (url: string) => {
    return pathName === url;
  };
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="py-8 px-8 lg:px-40 flex items-center">
      <Link href={'/'} className="w-full">
        <div className="flex gap-2 items-center">
          <Icons.logo className="h-8 w-8" />
          <div className="gap-1 md:flex hidden">
            <span className="font-extrabold">3MPOWER</span>
          </div>
          <Badge>Beta</Badge>
        </div>
      </Link>
      <div className="w-full justify-center hidden lg:flex">
        <NavigationMenu>
          <NavigationMenuList>
            {navItems.map((item, index) => (
              <NavigationMenuItem key={index}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    active={isPathActive(item.href)}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuTrigger disabled>
                Leaderboard
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <Icons.logo className="h-6 w-6" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          3MPOWER
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Track your most loyal community members
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem
                    href="/leaderboard/communities"
                    title="Community Rankings"
                  >
                    See which communities are the most active.
                  </ListItem>
                  {/* <ListItem href="/leaderboard/users" title="User Rankings">
                    See which users are the most active in their communities.
                  </ListItem> */}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="w-full flex justify-end gap-4 items-center">
        <MobileNav />
        {!session ? <SigninNav /> : <UserNav />}
      </div>
    </div>
  );
}

const MobileNav = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const handleMobileClick = () => {
    router.push('/community');
    setIsOpen(false);
  };
  return (
    <Sheet open={isOpen}>
      <SheetTrigger asChild onClick={() => setIsOpen(!isOpen)}>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <div className="flex gap-2 items-center w-full">
              <Icons.logo className="h-8 w-8" />
              <Link href={'/'} onClick={() => setIsOpen(false)}>
                <div className="gap-1 flex">
                  <span className="font-extrabold">3MPOWER</span>
                </div>
              </Link>
              <Badge>Beta</Badge>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={handleMobileClick}
            >
              {item.title}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
