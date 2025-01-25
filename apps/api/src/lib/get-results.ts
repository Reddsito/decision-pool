import { Nominations } from 'src/modules/poll/types/nominations.types';
import { Rankings } from 'src/modules/poll/types/ranking.types';
import { Results } from 'src/modules/poll/types/result.types';

export default (
  rankings: Rankings,
  nominations: Nominations,
  votesPerVoter: number,
): Results => {
  // 1. Each value of `rankings` key values is an array of a participants'
  // vote. Points for each array element corresponds to following formula:
  // r_n = ((votesPerVoter - 0.3*n) / votesPerVoter)^(n+1), where n corresponds
  // to array index of rankings.
  // Accumulate score per nominationID
  const scores: { [nominationID: string]: number } = {};

  Object.values(rankings).forEach((userRankings) => {
    userRankings.forEach((nominationID, n) => {
      const voteValue =
        ((votesPerVoter - 0.3 * n) / votesPerVoter) * (1 + 0.5 * n);

      scores[nominationID] = (scores[nominationID] ?? 0) + voteValue;
    });
  });

  // 2. Take nominationID to score mapping, and merge in nominationText
  // and nominationID into value
  const results = Object.entries(scores).map(([nominationID, score]) => ({
    nominationID,
    nominationText: nominations[nominationID].text,
    votes: score,
  }));

  // 3. Sort values by score in descending order
  results.sort((res1, res2) => res2.votes - res1.votes);

  return results;
};
