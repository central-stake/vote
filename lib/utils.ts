import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { CandidateGroup } from "./candidates";
import { VotesState } from "./votes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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