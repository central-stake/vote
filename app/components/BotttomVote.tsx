import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { initialCredit } from "@/lib/utils";

export default function BottomVote({ availableCredit, onReset } : { availableCredit: number, onReset: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full py-4 bg-background border-t">
      <div className="container flex items-center justify-between mx-auto">
        <div className="flex items-center">
          <span className="text-muted-foreground">Credit</span>
          <div className="ml-2 font-bold text-xl">
            <span>{availableCredit}</span><span>/{initialCredit}</span>
          </div>
          {availableCredit === 0 && (
            <Badge className="ml-3" variant="destructive">Nore more credit available</Badge>
          )}
        </div>
        <div>
          <Button variant="secondary" className="mr-4" disabled={availableCredit === initialCredit} onClick={onReset}>
            Reset my votes
          </Button>
          <Button disabled={availableCredit === initialCredit}>
            <Link href="/summary">
              Confirm my vote
            </Link>
          </Button>
        </div>
      </div>
  </div>
  );
}