import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ProgrammeDetails from "./ProgrammeDetails";
import Image from 'next/image';
import { Candidate } from "@/lib/candidates";
import { findCandidateById, cn } from "@/lib/utils";

export default function ListResultItem({ voteCount, candidateId } : { voteCount : number, candidateId: string }) {

  const voteIsPositive: boolean = voteCount > 0;
  const voteIsNegative: boolean = voteCount < 0;
  const candidate: Candidate | undefined = findCandidateById(candidateId);

  if (!candidate) {
    return null;
  }

  return (
    <Card className="flex flex-row justify-between border-[3px] mb-3">
      <div className="flex flex-row justify-between p-5">
        <div className="flex items-center justify-center mr-2">
          <Image
            priority={true}
            src={`/assets/logos/logo-${candidateId}.jpg`}
            alt={candidateId}
            width={120}
            height={67.5}
          />
        </div>
        <div className="mr-2">
          <div className="flex items-center">
            <span className="text-xl font-medium">{candidate.label}</span>
            <ProgrammeDetails candidate={candidate} />
          </div>
          <div className="text-muted-foreground text-sm">
            {candidate.description}
          </div>
        </div>
        <div className="w-[100px] text-center flex flex-col items-center justify-center">
          <span
            className={cn(
              "block text-2xl font-bold",
              voteIsNegative ? 'text-[#d93838]' : '',
              voteIsPositive ? 'text-[#36ae62]' : '',
            )}
          >
            {voteCount}
          </span>
          <span className="text-muted-foreground text-xs block">
            vote{voteCount > 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </Card>
  );
}