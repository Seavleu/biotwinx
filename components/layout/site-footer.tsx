

import { Dna, Github, Twitter } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
        <div className="flex items-center gap-2">
          <Dna className="h-5 w-5 text-accent" />
          <p className="text-sm leading-loose text-muted-foreground">
            &copy; {new Date().getFullYear()} BioTwinX. All rights reserved.
          </p>
        </div>
        <div className="flex items-center">
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/privacy"
              className="text-sm font-medium underline-offset-4 hover:underline text-muted-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm font-medium underline-offset-4 hover:underline text-muted-foreground"
            >
              Terms
            </Link>
            <Link
              href="https://github.com/Seavleu/biotwinx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium underline-offset-4 hover:underline text-muted-foreground"
            >
              <Github className="h-4 w-4" />
            </Link>
            <Link
              href="https://jennyheang.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium underline-offset-4 hover:underline text-muted-foreground"
            >
              <Twitter className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}