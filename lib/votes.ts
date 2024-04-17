export type VotesState = {
  credit?: number,
  votes: {
    [key: string]: number;
  }
};