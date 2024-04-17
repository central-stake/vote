export type VotesSubmit = {
  id: string,
  campaignId: string,
  votes: {
    [key: string]: { count: number }
  }
};