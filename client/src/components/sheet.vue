<template>
  <table class="uk-table">
    <!-- Header -->
    <thead>
      <tr>
        <th colspan="4" v-if="ready"></th>
        <th></th>
      </tr>
      <tr>
        <th class="uk-text-center">Wind</th>
        <th class="uk-text-center">Winner</th>
        <th class="uk-text-center">Picked on</th>
        <th class="uk-text-center">Points</th>
        <th v-for="player in players" :key="player.index">
          <sheet-player-chooser v-model="player.value"></sheet-player-chooser>
        </th>
      </tr>
    </thead>
    <!-- Rows -->
    <sheet-row v-for="row in rows" :key="row.index" v-if="row !== undefined" :visible="ready"
      :players="players" :row="row" v-on:update:data="rowDataUpdated(row, $event)">
    </sheet-row>
    <!-- Totals -->
    <tbody v-if="ready">
      <tr>
        <th colspan="4" class="uk-text-right">Totals</th>
        <td v-for="player in players" :key="player.index">{{ totals[player.index] }}</td>
      </tr>
      <!-- Table Points -->
      <tr>
        <th colspan="4" class="uk-text-right">Table points</th>
        <td v-for="player in players" :key="player.index">{{ tablePoints[player.index] }}</td>
      </tr>
    </tbody>

  </table>
</template>

<script>
import SheetRow from '@/components/sheetRow';
import SheetPlayerChooser from '@/components/sheetPlayerChooser';
import '../assets/east.png';
import '../assets/west.png';
import '../assets/north.png';
import '../assets/south.png';

export default {
  name: 'Sheet',
  data() {
    return {
      // Players
      players: [{ index: 0, value: { id: 1, name: 'toto' } },
        { index: 1, value: { id: 2, name: 'tata' } },
        { index: 2, value: { id: 3, name: 'titi' } },
        { index: 3, value: { id: 4, name: 'tutu' } }],
      // Rounds
      rows: [{ index: 0, data: { wind: 'E' } }],
      // Table point distribution
      tablePointsArray: [0, 1, 2, 4],
      winds: ['E', 'S', 'W', 'N'],
    };
  },
  created() {
  },
  methods: {
    computeTotals() {
      const totals = {};
      for (let i = 0; i < this.players.length; i += 1) {
        const player = this.players[i];
        let total = 0;
        let j = 0;
        // Adding totals of all valid rounds
        while (j < 16) {
          const row = this.rows[j];
          if (row.data.valid) total += row.data.points[player.index];
          else break;
          j += 1;
        }
        totals[player.index] = total;
      }
      return totals;
    },
    createRow(previousRow) {
      console.log(previousRow);
      const index = previousRow.index + 1;
      if (index >= 16) return undefined;
      let windIndex = this.winds.indexOf(previousRow.data.wind);
      if (index % 4 === 0) windIndex += 1;
      const wind = this.winds[windIndex];
      return { index, data: { wind }, previousRow };
    },
    rowDataUpdated(row_, $event) {
      const row = row_;
      row.data = $event;
      if (row.next === undefined) {
        row.next = this.createRow(row);
        this.rows.push(row.next);
      }
    },
  },
  computed: {
    totals() {
      return this.computeTotals();
    },
    tablePoints() {
      const totalsArray = [];
      const tablePoints = {};
      // Sorting player totals in totals array
      for (let i = 0; i < this.players.length; i += 1) {
        const player = this.players[i];
        totalsArray.push({ playerIndex: player.index, total: this.totals[player.index] });
      }
      totalsArray.sort((p1, p2) => p1.total - p2.total);
      // Computing table points of the players
      // i: current player
      let i = 0;
      while (i < this.players.length) {
        let j = i;
        // j: last player with the same total
        while (j < this.players.length && totalsArray[j].total === totalsArray[i].total) {
          j += 1;
        }
        // sharedpoints:  sum of points to be shared between players i to j
        //                divided by numer of players
        let sharedPoints = 0;
        for (let k = i; k < j; k += 1) sharedPoints += this.tablePointsArray[k];
        sharedPoints /= j - i;

        // Attributing shared points to players i to j
        for (let k = i; k < j; k += 1) tablePoints[totalsArray[k].playerIndex] = sharedPoints;
        i = j;
      }
      return tablePoints;
    },
    // sheet ready if all players are filled
    ready() {
      let ready = true;
      for (let i = 0; i < this.players.length; i += 1) {
        if (this.players[i].value === undefined) ready = false;
      }
      return ready;
    },
  },
  components: {
    'sheet-row': SheetRow,
    'sheet-player-chooser': SheetPlayerChooser,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
