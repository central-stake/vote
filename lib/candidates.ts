export type Candidate = {
  id: string,
  label: string,
  shortLabel: string,
  description: string,
  programme: string,
  websiteUrl: string,
  color: string,
}

export type CandidateGroup = {
  id: string,
  label: string,
  candidates: Candidate[],
}