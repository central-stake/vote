import VoteResultBySeat from "./VoteResultBySeat";
import VoteSystemComparison from "./VoteSystemComparison";

export default function VoteResults() {
  return (
    <div>
      <VoteSystemComparison />
      <VoteResultBySeat />
    </div>
  );
}