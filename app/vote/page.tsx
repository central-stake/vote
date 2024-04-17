'use client'

import VoteCardItem from "../components/VoteCardItem";
import { Card } from "@/components/ui/card";
import BottomVote from "../components/BotttomVote";
import { useEffect, useState } from "react";
import { VotesState } from "@/lib/votes";
import candidateGroup from "@/lib/candidate-group";
import LoadingOverlay from "../components/LoadingOverlay";
import { calculateCredit, convertCandidateGroupToState, initialCredit } from "@/lib/utils";
import { redirect } from "next/navigation";

export default function Vote() {

  const [votesState, setVotesState] = useState<VotesState>({
    credit: initialCredit,
    votes: {},
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  function initializeVoteState(): void {
    const voteState = convertCandidateGroupToState(candidateGroup);
    setVotesState(voteState);
  }

  useEffect(() => {
    const voteId = localStorage.getItem('voteId');
    if (voteId) {
      redirect(`/results?id=${voteId}`);
    }
    const storedData = localStorage.getItem('votes');
    if (storedData) {
      const voteState: VotesState = JSON.parse(storedData);
      setVotesState(voteState);
    } else {
      initializeVoteState();
    }
    setIsLoading(false);
  }, []);

  function updateVote(candidateId: string, value: number): void {
    const newVoteState: VotesState = {
      credit: votesState.credit,
      votes: {...votesState.votes},
    };
    newVoteState.votes[candidateId] = value;

    let totalCreditValue:number = 0;
    Object.keys(newVoteState.votes).forEach(key => {
      const vote = newVoteState.votes[key];

      totalCreditValue += calculateCredit(Math.abs(vote));
    });

    const newCreditValue:number = initialCredit - totalCreditValue;

    if (newCreditValue >= 0) {
      const votes = {
        ...newVoteState,
        credit: newCreditValue,
      };
      setVotesState(votes);
      localStorage.setItem('votes', JSON.stringify(votes));
    }
  }

  return (
    <LoadingOverlay isLoading={isLoading}>
      <div className="flex flex-col space-y-6 mt-10 mb-40">
        <div className="container">
          <header className="text-center flex flex-col items-center justify-center mb-14 pt-4">
            <h1 className="font-bold text-3xl md:text-4xl max-w-lg">
              Vote
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean porta risus non nunc ornare.
            </p>
          </header>

          <main className="pt-10">
            {candidateGroup.map((item) => {
              return (
                <section key={item.id} className="relative mb-20">
                  <span className="w-auto px-6 py-3 m-auto rounded-full bg-secondary block absolute left-2/4 translate-x-[-50%] translate-y-[-50%] border">
                    <h2 className="text-base font-medium text-primary">
                      {item.label}
                    </h2>
                  </span>
                  <Card className="px-6 py-8 bg-secondary pt-14">
                    <div className="grid grid-cols-3 gap-4">
                      {item.candidates.map((candidate) => {
                        return (
                          <VoteCardItem
                            key={candidate.id}
                            candidate={candidate}
                            votesState={votesState}
                            updateVote={updateVote}
                          />
                        );
                      })}
                    </div>
                  </Card>
                </section>
              );
            })}
            <BottomVote availableCredit={votesState.credit} onReset={initializeVoteState} />
          </main>
        </div>
      </div>
    </LoadingOverlay>
  );
}