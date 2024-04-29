import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { defaultInitialCredit } from "@/lib/utils";

export default function BottomVote({ availableCredit, isVotePositive, onReset } : { availableCredit: number, isVotePositive: boolean, onReset: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full py-4 bg-background border-t">
      <div className="container flex items-center justify-between mx-auto">
        <div className="flex items-center">
          <span className="text-muted-foreground">Credit</span>
          <div className="ml-2 font-bold text-xl">
            <span>{availableCredit}</span><span>/{defaultInitialCredit}</span>
          </div>
          {availableCredit === 0 && (
            <Badge className="ml-3" variant="destructive">Nore more credit available</Badge>
          )}
          {!isVotePositive && availableCredit !== defaultInitialCredit && (
            <Badge className="ml-3" variant="destructive">
              Your total vote must be positive
            </Badge>
          )}
        </div>
        <div className="flex">
          <Button variant="secondary" className="mr-4 hidden md:block" disabled={availableCredit === defaultInitialCredit} onClick={onReset}>
            Reset my votes
          </Button>
          <Button disabled={availableCredit === defaultInitialCredit || !isVotePositive}>
            <Link href="/summary">
              Confirm my vote
            </Link>
          </Button>
        </div>
      </div>
  </div>
  );
}