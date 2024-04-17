import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { CandidateGroup } from "./candidates";
import { VotesState } from "./votes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const quadratiqueEvolution = [0, 1,3,6,10,15,21,28,36,45,55,66,78,91,105,120,136,153,171,190,210];

export function calculateCredit(vote: number){
  return quadratiqueEvolution[vote];
}

export const initialCredit: number = 30;

export function convertCandidateGroupToState(candidateGroup: CandidateGroup[]) : VotesState {
  const state: VotesState = {
    credit: initialCredit,
    votes: {},
  };
  candidateGroup.forEach(item => {
    item.candidates.forEach(candidate => {
      state.votes[candidate.id] = 0;
    });
  });

  return state;
}