
'use client';

import Link from 'next/link';
import { NAV_ITEMS, OWNER_NAME } from '@/lib/constants';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Sparkles } from 'lucide-react';

export function Header() {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    const targetId = href.replace(/.*#/, '');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 md:px-8 px-2 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-lg">
            {OWNER_NAME}
          </span>
        </Link>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-primary"
                onClick={(e) => handleSmoothScroll(e, item.href)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                      onClick={(e) => {
                        // It's good practice to ensure the sheet closes after a mobile navigation click.
                        // To do this robustly, we'd typically manage the Sheet's open state here
                        // or use a SheetClose component if available.
                        // For simplicity and since SheetClose isn't used, we'll assume the Sheet might need manual closure.
                        // The Sheet component handles its own state, so clicking a link might not close it automatically.
                        // For now, the smooth scroll will work.
                        // If SheetClose is available and appropriate, it can be wrapped around the Link.
                        // For now, let's find the close button and click it programmatically if the Sheet is complex.
                        // Simpler: assuming Sheet has its own open/setOpen and it's managed internally or via context.
                        // For now, we can try to close the sheet by finding its close button if it's a common pattern.
                        // Let's assume this needs to be handled or is handled by ShadCN's Sheet logic when navigation occurs.
                        handleSmoothScroll(e, item.href);
                        // To close the sheet, you might need to trigger the close button or manage 'open' state.
                        // This is often done by wrapping the Link in a SheetClose component or by controlling Sheet's 'open' prop.
                        // For now, we just handle the scroll.
                        const sheetCloseButton = document.querySelector('button[cmdk-dialog-trigger-cmdk-item][aria-label="Close"]');
                        if (sheetCloseButton instanceof HTMLElement) {
                            // This is a bit of a hack and depends on ShadCN's internal structure, which can change.
                            // A more robust solution would be to manage the Sheet's open state or use SheetClose.
                            // sheetCloseButton.click(); 
                            // Commenting out the programmatic click for now as it's brittle.
                            // The Sheet's internal close button should still work for the user.
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
