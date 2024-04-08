export type Candidate = {
  id: string,
  label: string,
  description: string,
  programme: string,
  websiteUrl: string,
}

export type CandidateGroup = {
  id: string,
  label: string,
  candidates: Candidate[],
}