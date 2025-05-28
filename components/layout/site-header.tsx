"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Dna,
  Home,
  Mic,
  BarChart,
  PenLine,
  Menu,
  X,
  GithubIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: <Home className="h-4 w-4 mr-2" />,
  },
  {
    title: "Selfie",
    href: "/selfie",
    icon: <Dna className="h-4 w-4 mr-2" />,
  },
  {
    title: "Voice",
    href: "/voice",
    icon: <Mic className="h-4 w-4 mr-2" />,
  },
  {
    title: "Journal",
    href: "/journal",
    icon: <PenLine className="h-4 w-4 mr-2" />,
  },
  {
    title: "Insights",
    href: "/insights",
    icon: <BarChart className="h-4 w-4 mr-2" />,
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b bg-background/95 backdrop-blur-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Dna className="h-6 w-6 text-accent" />
          <span className="font-bold text-lg">BioTwinX</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
              <SheetHeader className="mb-4">
                <SheetTitle className="flex items-center">
                  <Dna className="h-5 w-5 text-accent mr-2" />
                  BioTwinX
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4">
                <AnimatePresence>
                  {navItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-muted"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </nav>
              <div className="mt-auto flex justify-center">
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href="https://github.com/yourusername/biotwinx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <GithubIcon className="mr-2 h-4 w-4" />
                    <span>GitHub</span>
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}