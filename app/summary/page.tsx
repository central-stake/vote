'use client'

import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import LoadingOverlay from "../components/LoadingOverlay";
import { VotesState } from "@/lib/votes";
import { convertVoteToVoteSubmit, defaultCampaignId, defaultInitialCredit } from "@/lib/utils";
import candidateGroup from "@/lib/candidate-group";
import { Card } from "@/components/ui/card";
import { CandidateGroup } from "@/lib/candidates";
import SummaryCardItem from "../components/SummaryCardItem";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CallResponse, createVote } from "../firebase/data";

export default function Summary() {
  const router = useRouter();
  const uuid: string = uuidv4();

  async function submitMyVote() {
    setIsLoading(true);
    const callResponse: CallResponse = await createVote({
      campaignId: defaultCampaignId,
      id: uuid,
      votes: convertVoteToVoteSubmit(votesState),
    });
    if (callResponse.result) {
      localStorage.removeItem('votes');
      localStorage.setItem('voteId', uuid);
      router.push(`/results?id=${uuid}`);
    } else if (callResponse.error) {
      // TODO: Show error message to the user and ask to try again
      console.log('Error on saving vote : ', callResponse.error.message);
    }
    setIsLoading(false);
  }

  const [votesState, setVotesState] = useState<VotesState>({
    credit: defaultInitialCredit,
    votes: {},
  });
  const [candidatesWithVoteState, setCandidatesWithVoteState] = useState<CandidateGroup[]>([]);
  const [hasVoteState, setHasVoteState] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedData = localStorage.getItem('votes');

    if (storedData) {
      const voteState: VotesState = JSON.parse(storedData);
      const hasVote: string[] = [];
      Object.entries(voteState.votes).forEach((item) => {
        if (item[1] !== 0) {
          hasVote.push(item[0]);
        }
      });
      const candidatesWithVote: CandidateGroup[] = [];
      candidateGroup.forEach((item) => {
        item.candidates.forEach((candidate) => {
          if (hasVote.includes(candidate.id)){
            candidatesWithVote.push(item);
          }
        })
      });
      const candidatesWithVoteUnique: CandidateGroup[] = candidatesWithVote.filter((value, index, array) => {
        return array.indexOf(value) === index;
      });
      setHasVoteState(hasVote);
      setCandidatesWithVoteState(candidatesWithVoteUnique);
      setVotesState(voteState);
    } else {
      redirect('/');
    }

    setIsLoading(false);
  }, []);

  return (
    <LoadingOverlay isLoading={isLoading}>
      <div className="flex flex-col space-y-6 mt-10 mb-40">
        <div className="container">
          <header className="text-center flex flex-col items-center justify-center mb-14 pt-4">
            <h1 className="font-bold text-3xl md:text-4xl max-w-lg">
              Your vote summary
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean porta risus non nunc ornare.
            </p>
          </header>

          <main className="pt-10">
            {candidatesWithVoteState.map((item) => {
              return (
                <section key={item.id} className="relative mb-20">
                  <span className="w-auto px-6 py-3 m-auto rounded-full bg-secondary block absolute left-2/4 translate-x-[-50%] translate-y-[-50%] border">
                    <h2 className="text-base font-medium text-primary">
                      {item.label}
                    </h2>
                  </span>
                  <Card className="px-6 py-8 bg-secondary pt-14">
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
                      {item.candidates.map((candidate) => {
                        if (hasVoteState.includes(candidate.id)) {
                          return (
                            <SummaryCardItem
                              key={candidate.id}
                              candidate={candidate}
                              votesState={votesState}
                            />
                          );
                        }
                      })}
                    </div>
                  </Card>
                </section>
              );
            })}

            <div className="flex items-center justify-center flex-col">
              <Button className="mb-4 px-10 py-8" onClick={submitMyVote}>
                <span className="text-base font-medium">
                  Ok, I confirm my vote
                </span>
              </Button>
              <Button variant="ghost">
                <Link href="/vote">
                  <span className="text-sm font-medium">
                    No, I want to change my vote
                  </span>
                </Link>
              </Button>
            </div>
          </main>
        </div>
      </div>
    </LoadingOverlay>
  );
}