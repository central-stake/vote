import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Candidate } from "@/lib/candidates";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { VotesState } from "@/lib/votes";
import { calculateCredit, cn } from "@/lib/utils";
import ProgrammeDetails from "./ProgrammeDetails";

export default function VoteCardItem({
  candidate,
  votesState,
  updateVote,
} : {
  candidate: Candidate,
  votesState: VotesState,
  updateVote: (candidateId: string, value: number) => void,
}) {

  const voteIsEqualToZero: boolean = votesState.votes[candidate.id] === 0 || !!!votesState.votes[candidate.id];
  const voteIsPositive: boolean = votesState.votes[candidate.id] > 0;
  const voteIsNegative: boolean = votesState.votes[candidate.id] < 0;

  return (
    <Card className={cn(
      "flex flex-col justify-between border-[3px]",
      voteIsNegative ? 'border-red-600' : '',
      voteIsPositive ? 'border-green-600' : '',
      voteIsEqualToZero && votesState.credit === 0 ? 'opacity-50' : '',
    )}>
      <CardHeader>
        <Image
          priority={true}
          src={`/assets/logos/logo-${candidate.id}.jpg`}
          alt={candidate.id}
          width={960}
          height={540}
        />
        <CardTitle className="flex items-center">
          <span>{candidate.label}</span>
          <ProgrammeDetails candidate={candidate} />
        </CardTitle>
        <CardDescription>
          {candidate.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col">
        <div className="flex w-full max-w-sm items-center space-x-2 mb-2">
          <Button variant="secondary" onClick={() => {
            updateVote(candidate.id, votesState.votes[candidate.id] - 1);
          }}>
            <Minus />
          </Button>
          <Input
            type="number"
            placeholder="0"
            value={votesState.votes[candidate.id] ?? 0}
            className="text-center disabled:opacity-100 text-lg"
            disabled
          />
          <Button variant="secondary" onClick={() => {
            updateVote(candidate.id, votesState.votes[candidate.id] + 1);
          }}>
            <Plus />
          </Button>
        </div>
        <div className="text-muted-foreground text-sm">
          {voteIsEqualToZero ? (
            <span className="opacity-0">-</span>
          ) : (
            <span>
              use {calculateCredit(Math.abs(votesState.votes[candidate.id]))} credit {voteIsPositive ? 'for' : 'against'} {candidate.label}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}