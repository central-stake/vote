'use client'

import VoteCardItem from "../components/VoteCardItem";
import { Card } from "@/components/ui/card";
import BottomVote from "../components/BotttomVote";
import { useEffect, useState } from "react";
import { VotesState } from "@/lib/votes";
import LoadingOverlay from "../components/LoadingOverlay";
import { calculateCredit, convertCandidateGroupToState } from "@/lib/utils";
import { redirect } from "next/navigation";
import { RemoteData, useRemoteConfig } from "../components/RemoteConfiProvider";
import { CandidateGroup } from "@/lib/candidates";

export default function Vote() {
  const remoteConfig: RemoteData = useRemoteConfig();
  const [defaultInit, setDefaultInit] = useState<{
    credit: number, candidateGroup: CandidateGroup[], quadratiqueEvolution: number[]
  } | null>(null);
  const [votesState, setVotesState] = useState<VotesState>({
    credit: 0,
    votes: {},
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  function initializeVoteState(candidates: CandidateGroup[]): void {
    const voteState = convertCandidateGroupToState(candidates);
    setVotesState(voteState);
  }

  useEffect(() => {
    if (remoteConfig && !defaultInit) {
      setDefaultInit({
        candidateGroup: remoteConfig.candidateGroup,
        credit: remoteConfig.initialCreditCount,
        quadratiqueEvolution: remoteConfig.quadratiqueEvolution,
      });
    }
  }, [remoteConfig]);

  useEffect(() => {
    if (!defaultInit) {
      return;
    }
    const voteId = localStorage.getItem('voteId');
    if (voteId) {
      redirect(`/results?id=${voteId}`);
    }
    const storedData = localStorage.getItem('votes');
    if (storedData) {
      const voteState: VotesState = JSON.parse(storedData);
      setVotesState(voteState);
    } else {
      initializeVoteState(defaultInit.candidateGroup);
    }
    setIsLoading(false);
  }, [defaultInit]);

  function updateVote(candidateId: string, value: number, initCredit: number): void {
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

    const newCreditValue:number = initCredit - totalCreditValue;

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
            {defaultInit?.candidateGroup.map((item) => {
              return (
                <section key={item.id} className="relative mb-20">
                  <span className="w-auto px-6 py-3 m-auto rounded-full bg-secondary block absolute left-2/4 translate-x-[-50%] translate-y-[-50%] border">
                    <h2 className="text-base font-medium text-primary">
                      {item.label}
                    </h2>
                  </span>
                  <Card className="px-6 py-4 md:py-8 bg-secondary pt-14">
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
                      {defaultInit && item.candidates.map((candidate) => {
                        return (
                          <VoteCardItem
                            key={candidate.id}
                            candidate={candidate}
                            votesState={votesState}
                            updateVote={(candidateId: string, value: number) => {
                              updateVote(candidateId, value, defaultInit.credit);
                            }}
                          />
                        );
                      })}
                    </div>
                  </Card>
                </section>
              );
            })}
            {defaultInit && (
              <BottomVote availableCredit={votesState.credit ?? 0} onReset={() => {
                initializeVoteState(defaultInit.candidateGroup);
              }} />
            )}
          </main>
        </div>
      </div>
    </LoadingOverlay>
  );
}