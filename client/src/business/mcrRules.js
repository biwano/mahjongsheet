import rules from './rules';

const localRules = {
  name: 'mcr',
  minMahjongScore: 8,
  // Creates a round
  nextRound(previousRound) {
    let index;
    let wind;
    const score = this.minMahjongScore;
    const winnerIndex = -1;
    const pickedOnIndex = -1;

    // First roundData
    if (previousRound === undefined) {
      index = 0;
      wind = this.winds[0];
    } else {
    // Next Rounds
      index = previousRound.index + 1;
      if (index >= 16) return undefined;
      let windIndex = this.winds.indexOf(previousRound.data.wind);
      if (index % 4 === 0) windIndex += 1;
      wind = this.winds[windIndex];
    }
    return { index, data: { wind, score, winnerIndex, pickedOnIndex } };
  },
  playerRoundPoints(roundData, playerIndex) {
    const isWinner = this.isWinner(roundData, playerIndex);
    const isPickedOn = this.isPickedOn(roundData, playerIndex);
    let points = 0;
    console.log(roundData);
    if (!this.isValid(roundData)) points = 0;
    // Self pick
    else if (this.selfPick(roundData)) {
      // Winner
      if (this.isWinner(roundData, playerIndex)) points = (8 + roundData.score) * 3;
      // Others
      else points = -(8 + roundData.score);
    // PickedOn
    // Winner
    } else if (isWinner) points = (8 + roundData.score) + (8 * 2);
    // PickedOn
    else if (isPickedOn) points = -(8 + roundData.score);
    // Others
    else points = -8;
    return points;
  },
  isFinished(rounds) {
    return rounds.length === 16;
  },
};

const mcrRules = Object.assign({}, rules, localRules);
export default mcrRules;
