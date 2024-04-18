'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import ExplanationDialog from "./ExplanationsDialog";
import { useEffect } from "react";

export function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isVotePage = pathname === '/vote';
  const isSummaryPage = pathname === '/summary';
  let voteId: string | null = null;

  useEffect(() => {
    voteId = localStorage.getItem('voteId');
  }, [])

  return (
    <nav className="border-b bg-background h-[10vh] flex items-center min-h-16">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <h1 className="font-bold text-3xl">
            Vote<span className="text-primary">Now</span>
          </h1>
        </Link>

        <div className="flex items-center gap-x-5">
          <div className="flex items-center gap-x-5">
            {isVotePage || isSummaryPage || (voteId && !isHomePage) ? (
              <Button asChild>
                <Link href="/">
                  <Home />
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/vote">
                  <span className="block md:hidden">
                    Start
                  </span>
                  <span className="hidden md:block">
                    Start voting now!
                  </span>
                </Link>
              </Button>
            )}
            <ExplanationDialog />
          </div>
          {/* <ThemeToggle /> */}
        </div>
      </div>
    </nav>
  )
}