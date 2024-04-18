'use client'

import VoteResults from "@/app/components/VoteResults";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ShareResultsBox from "../components/ShareResultsBox";
import { CallResponse, getVoteById } from "../firebase/data";
import LoadingOverlay from "../components/LoadingOverlay";
import { VotesState } from "@/lib/votes";
import ListResultItem from "../components/ListResultItem";

export default function Results() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [votes, setVotes] = useState<VotesState | null>(null);
  const [isMyVote, setIsMyVote] = useState<boolean>(false);
  const [isMyFriendVote, setIsMyFriendVote] = useState<boolean>(false);

  async function getVote(voteId: string): Promise<void> {
    setIsLoading(true);
    const callResponse: CallResponse = await getVoteById(voteId);
    if (callResponse.result) {
      setVotes(callResponse.result);
    } else if (callResponse.error) {
      // TODO: Show error message to the user and ask to try again
      console.log('Error on getting vote : ', callResponse.error.message);
      router.replace('/results');
    }
    setIsLoading(false);
  }

  function checkIfVoteCurrentUser(urlVoteId: string | null, localVoteId: string | null) {
    if (urlVoteId === null && localVoteId === null) {
      router.replace('/');
    } else if (urlVoteId === localVoteId) {
      setIsMyVote(true);
    } else if (!urlVoteId && localVoteId) {
      setIsMyVote(true);
    } else if (urlVoteId && !localVoteId) {
      setIsMyFriendVote(true);
    } else if (urlVoteId !== localVoteId) {
      setIsMyFriendVote(true);
    }
  }

  useEffect(() => {
    const urlVoteId: string | null = searchParams.get('id');
    const localVoteId: string | null = localStorage.getItem('voteId');

    checkIfVoteCurrentUser(urlVoteId, localVoteId);

    const voteId: string | null = urlVoteId || localVoteId;
    if (voteId) {
      getVote(voteId);
    } else {
      setIsLoading(false);
    }
  }, []);

  function filterVote(votes: {
    [key: string]: number;
  }) : {id: string, count: number}[]
    {
      const filteredVotes: {id: string, count: number}[] = [];
      Object.entries(votes).filter((item: [string, number], _) =>{
        if (item[1] !== 0) {
          filteredVotes.push({
            id: item[0],
            count: item[1],
          });
        }
      });

      return filteredVotes;
  }

  return (
    <LoadingOverlay isLoading={isLoading}>
      <div>
        <VoteResults>
          <div className="flex justify-center items-center">
            <div className="max-w-3xl">
              <div className="text-center text-2xl font-bold mb-5">
                {isMyVote && 'Vote'}
                {isMyFriendVote && 'Your friend vote'}
              </div>
              {votes?.votes && filterVote(votes!.votes).map((item: {
                id: string,
                count: number,
                }, _) => {
                return (
                  <ListResultItem
                    key={item.id}
                    voteCount={item.count}
                    candidateId={item.id}
                  />
                );
              })}
            </div>
          </div>
        </VoteResults>
        <ShareResultsBox />
      </div>
    </LoadingOverlay>
  );
}