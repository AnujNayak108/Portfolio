import { OWNER_NAME } from '@/lib/constants';
import { Copyright, Sparkles } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container flex flex-col items-center justify-center gap-4 py-10 md:h-20 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Sparkles className="h-5 w-5 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by {OWNER_NAME}.
          </p>
          <p className="flex items-center text-center text-sm text-muted-foreground md:text-left">
             <Copyright className="mr-1 h-4 w-4" /> {currentYear} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
