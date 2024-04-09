'use client'

import VoteResults from "@/app/components/VoteResults";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
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
      <VoteResults>
        <div>
          TODO: USER VOTE
        </div>
      </VoteResults>
      <div className="flex items-center justify-center">
        <Button>
          Share the results <Share2 className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}