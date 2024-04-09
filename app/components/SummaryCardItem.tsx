import Image from 'next/image';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Candidate } from "@/lib/candidates";
import { VotesState } from "@/lib/votes";
import { cn } from "@/lib/utils";
import ProgrammeDetails from "./ProgrammeDetails";

export default function SummaryCardItem({
  candidate,
  votesState,
} : {
  candidate: Candidate,
  votesState: VotesState,
}) {

  const voteIsEqualToZero: boolean = votesState.votes[candidate.id] === 0 || !!!votesState.votes[candidate.id];
  const voteIsPositive: boolean = votesState.votes[candidate.id] > 0;
  const voteIsNegative: boolean = votesState.votes[candidate.id] < 0;
  const credit = Math.abs(votesState.votes[candidate.id]);

  const color:string = voteIsNegative ? 'bg-red-600' : voteIsPositive ? 'bg-green-600' : '';

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
      <div className={`flex flex-col justify-center items-center ${color} p-3`}>
        <div className="text-muted-foreground text-lg text-white font-medium">
          {voteIsEqualToZero ? (
            <span className="opacity-0">-</span>
          ) : (
            <span>
              {credit} credit{credit > 1 ? 's' : ''} {voteIsPositive ? 'for' : 'against'} {candidate.label}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}