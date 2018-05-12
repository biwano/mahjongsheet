export default {
  tablePointsList: [0, 1, 2, 4],
  winds: ['E', 'S', 'W', 'N'],
  minMahjongScore: 0,
  isWinner(roundData, playerIndex) {
    return roundData.winnerIndex === playerIndex;
  },
  isPickedOn(roundData, playerIndex) {
    return roundData.pickedOnIndex === playerIndex && !this.isWinner(roundData, playerIndex);
  },
  selfPick(roundData) {
    return roundData.winnerIndex === roundData.pickedOnIndex;
  },
  isValid(roundData) {
    return roundData.winnerIndex !== -1 &&
      roundData.pickedOnIndex !== -1 &&
      roundData.score >= this.minMahjongScore;
  },
  totals(players, rounds) {
    const totals = {};
    // For each player
    for (let i = 0; i < players.length; i += 1) {
      const player = players[i];
      let total = 0;
      // Adding totals of all valid rounds
      for (let j = 0; j < rounds.length; j += 1) {
        const round = rounds[j];
        if (this.isValid(round.data)) total += round.data.points[player.index];
        else break;
      }
      totals[player.index] = total;
    }
    return totals;
  },
  tablePoints(players, rounds) {
    const totals = this.totals(players, rounds);
    const totalsArray = [];
    const tablePoints = {};
    // Sorting player totals in totals array
    for (let i = 0; i < players.length; i += 1) {
      const player = players[i];
      totalsArray.push({ playerIndex: player.index, total: totals[player.index] });
    }
    totalsArray.sort((p1, p2) => p1.total - p2.total);
    // Computing table points of the players
    // i: current player
    let i = 0;
    while (i < players.length) {
      let j = i;
      // j: last player with the same total
      while (j < players.length && totalsArray[j].total === totalsArray[i].total) {
        j += 1;
      }
      // sharedpoints:  sum of points to be shared between players i to j
      //                divided by numer of players
      let sharedPoints = 0;
      for (let k = i; k < j; k += 1) sharedPoints += this.tablePointsList[k];
      sharedPoints /= j - i;

      // Attributing shared points to players i to j
      for (let k = i; k < j; k += 1) tablePoints[totalsArray[k].playerIndex] = sharedPoints;
      i = j;
    }
    return tablePoints;
  },
};
