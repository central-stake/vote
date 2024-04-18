import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Candidate, CandidateGroup } from "./candidates";
import { VotesState } from "./votes";
import candidateGroup from "./candidate-group";

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

export function findCandidateById(id: string): Candidate | undefined {
  for (const group of candidateGroup) {
    const candidate = group.candidates.find(candidate => candidate.id === id);
    if (candidate) {
      return candidate;
    }
  }
  return undefined;
}

export function convertVoteToVoteSubmit(votes: VotesState): {
  [key: string]: { count: number }
} {
  const newVotes: { [key: string]: { count: number } } = {};
  for (const key in votes.votes) {
    if (Object.prototype.hasOwnProperty.call(votes.votes, key)) {
      newVotes[key] = { count: votes.votes[key] };
    }
  }
  return newVotes;
}

export function convertVoteResponseToVoteState(response: {
  [key: string]: { count: number }
}) : VotesState {
  const newVotes: VotesState = {
    votes: {}
  };

  for (const key in response) {
    if (Object.prototype.hasOwnProperty.call(response, key)) {
      newVotes.votes[key] = response[key].count;
    }
  }

  return newVotes;
}