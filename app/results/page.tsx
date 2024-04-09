'use client'

import VoteResults from "@/app/components/VoteResults";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Results() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const voteId: string | null = searchParams.get('id') || localStorage.getItem('voteId');
    if (voteId) {
      // TODO: Get data from the vote if exist
      console.log('voteId : ', voteId)
    }
  }, []);

  return (
    <div>
      <VoteResults />
    </div>
  );
}