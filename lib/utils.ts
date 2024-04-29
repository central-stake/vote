import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Candidate, CandidateGroup } from "./candidates";
import { VotesState } from "./votes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const defaultQuadratiqueEvolution: number[] = [0, 1,3,6,10,15,21,28,36,45,55,66,78,91,105,120,136,153,171,190,210];

export function calculateCredit(vote: number){
  return defaultQuadratiqueEvolution[vote];
}

export const defaultInitialCredit: number = 30;
export const defaultCampaignId: string =  'belgium-2024-1';

export function convertCandidateGroupToState(candidateGroup: CandidateGroup[]) : VotesState {
  const state: VotesState = {
    credit: defaultInitialCredit,
    votes: {},
  };
  candidateGroup.forEach(item => {
    item.candidates.forEach(candidate => {
      state.votes[candidate.id] = 0;
    });
  });

  return state;
}

export function findCandidateById(id: string, candidates: CandidateGroup[]): Candidate | undefined {
  for (const group of candidates) {
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

export function lightenColor(color: string, factor: number): string {
  // Remove the "#" symbol if it exists
  color = color.replace(/^#/, '');

  // Parse the color as a hexadecimal number
  const num = parseInt(color, 16);

  // Extract the RGB components
  let red = (num >> 16) & 255;
  let green = (num >> 8) & 255;
  let blue = num & 255;

  // Calculate the new RGB values by increasing them
  // You can adjust the factor to control the lightness
  red = Math.min(255, red + factor);
  green = Math.min(255, green + factor);
  blue = Math.min(255, blue + factor);

  // Convert the new RGB values back to hexadecimal
  const newColor = `#${(blue | (green << 8) | (red << 16)).toString(16).padStart(6, '0')}`;

  return newColor;
}

export function lightColors(colors: string[]): string[] {
  return colors.map((color) => lightenColor(color, 80))
};

// Function to generate alternating colors
export function alternatingColors(length: number, color1: string, color2: string): string[]  {
  return Array.from({ length }, (_, i) => (i % 2 === 0 ? color1 : color2));
};

export function extractColorsAndLabels(candidateGroup: CandidateGroup[]) {
  const optionColors: string[] = [];
  const labels: string[] = [];

  candidateGroup.forEach((group) => {
      group.candidates.forEach((candidate) => {
          optionColors.push(candidate.color);
          labels.push(candidate.shortLabel);
      });
  });

  return { optionColors, labels };
}

export function isTotalVotesGreaterThanOne(data: VotesState): boolean {
  const votesValues = Object.values(data.votes);
  const totalVotes = votesValues.reduce((acc, curr) => acc + curr, 0);
  console.log('is greater than : ',totalVotes >= 1 )
  return totalVotes >= 1;
}