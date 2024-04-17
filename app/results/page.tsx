'use client'

import VoteResults from "@/app/components/VoteResults";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ShareResultsBox from "../components/ShareResultsBox";
import { CallResponse, getVoteById } from "../firebase/data";
import LoadingOverlay from "../components/LoadingOverlay";
import { VotesState } from "@/lib/votes";

export default function Results() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [votes, setVotes] = useState<VotesState | null>(null);

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

  useEffect(() => {
    const voteId: string | null = searchParams.get('id') || localStorage.getItem('voteId');
    if (voteId) {
      getVote(voteId);
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <LoadingOverlay isLoading={isLoading}>
      <div>
        <VoteResults>
          <div>
            TODO: USER VOTE <br />
            {JSON.stringify(votes)}
          </div>
        </VoteResults>
        <ShareResultsBox />
      </div>
    </LoadingOverlay>
  );
}