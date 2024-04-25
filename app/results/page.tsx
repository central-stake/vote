'use client'

import VoteResults from "@/app/components/VoteResults";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ShareResultsBox from "../components/ShareResultsBox";
import { CallResponse, getParties, getResults, getVoteById, getVotes } from "../firebase/data";
import LoadingOverlay from "../components/LoadingOverlay";
import { VotesState } from "@/lib/votes";
import ListResultItem from "../components/ListResultItem";
import { RemoteData, useRemoteConfig } from "../components/RemoteConfiProvider";
import { CandidateGroup } from "@/lib/candidates";

export default function Results() {
  const remoteConfig: RemoteData = useRemoteConfig();
  const [defaultInit, setDefaultInit] = useState<{
    campaignId: string,
    candidateGroup: CandidateGroup[]
  } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [votes, setVotes] = useState<VotesState | null>(null);
  const [isMyVote, setIsMyVote] = useState<boolean>(false);
  const [isMyFriendVote, setIsMyFriendVote] = useState<boolean>(false);

  async function getData(voteId: string | null, campaignId: string): Promise<void> {
    setIsLoading(true);
    if (voteId) {
      await getVote(voteId);
    }
    await getResultsFromApi(campaignId);
    await getPartiesFromApi(campaignId);
    await getVotesFromApi(campaignId);
    setIsLoading(false);
  }

  async function getVote(voteId: string): Promise<void> {
    const callResponse: CallResponse = await getVoteById(voteId);
    if (callResponse.result) {
      setVotes(callResponse.result);
    } else if (callResponse.error) {
      // TODO: Show error message to the user and ask to try again
      console.log('Error on getting vote : ', callResponse.error.message);
      router.replace('/results');
    }
  }

  async function getResultsFromApi(campaignId: string): Promise<void> {
    const result = await getResults(campaignId);
    // TODO: Use data
    console.log('result : ', result);
  }

  async function getPartiesFromApi(campaignId: string): Promise<void> {
    const parties = await getParties(campaignId);
    // TODO: Use data
    console.log('parties : ', parties);
  }

  async function getVotesFromApi(campaignId: string): Promise<void> {
    const votes = await getVotes(campaignId);
    // TODO: Use data
    console.log('votes : ', votes);
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
    if (remoteConfig && !defaultInit) {
      setDefaultInit({
        campaignId: remoteConfig.campaignId,
        candidateGroup: remoteConfig.candidateGroup,
      });
    }
  }, [remoteConfig]);

  useEffect(() => {
    if (!defaultInit) {
      return;
    }
    const urlVoteId: string | null = searchParams.get('id');
    const localVoteId: string | null = localStorage.getItem('voteId');
    checkIfVoteCurrentUser(urlVoteId, localVoteId);
    getData(urlVoteId || localVoteId, defaultInit.campaignId);
  }, [defaultInit]);

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
        {defaultInit && (
          <VoteResults candidates={defaultInit.candidateGroup}>
            <div className="flex justify-center items-center">
              <div className="max-w-3xl">
                <div className="text-center text-2xl font-bold mb-5">
                  {isMyVote && 'Vote'}
                  {isMyFriendVote && 'Your friend vote'}
                </div>
                {defaultInit && votes?.votes && filterVote(votes!.votes).map((item: {
                  id: string,
                  count: number,
                  }, _) => {
                  return (
                    <ListResultItem
                      key={item.id}
                      voteCount={item.count}
                      candidateId={item.id}
                      candidates={defaultInit.candidateGroup}
                    />
                  );
                })}
              </div>
            </div>
          </VoteResults>
        )}
        <ShareResultsBox />
      </div>
    </LoadingOverlay>
  );
}