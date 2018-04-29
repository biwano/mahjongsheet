<template>
  <table class="uk-table">
    <!-- Header -->
    <thead>
      <tr>
        <th colspan="4"></th>
        <th></th>
      </tr>
      <tr>
        <th class="center">Wind</th>
        <th class="center">Winner</th>
        <th class="center">Picked on</th>
        <th class="center">Points</th>
        <th v-for="player in players" :key="player.id">{{ player.name }}</th>
      </tr>
    </thead>
    <!-- Rows -->
    <sheet-row v-for="row in rows" :key="row.id"
      :players="players" :row="row" v-on:update:data="row.data = $event;">
    </sheet-row>
    <!-- Totals -->
    <tr>
      <th colspan="4" class="right">Totals</th>
      <td v-for="player in players" :key="player.id">{{ totals[player.id] }}</td>
    </tr>
    <!-- Table Points -->
    <tr>
      <th colspan="4" class="right">Table points</th>
      <td v-for="player in players" :key="player.id">{{ tablePoints[player.id] }}</td>
    </tr>

  </table>
</template>

<script>
import SheetRow from '@/components/SheetRow';
import '../assets/east.png';
import '../assets/west.png';
import '../assets/north.png';
import '../assets/south.png';

const initRows = function initRows() {
  const rows = [];
  for (let i = 0; i < 16; i += 1) {
    const wind = ['E', 'S', 'W', 'N'][Math.floor(i / 4)];
    const row = { id: i, wind, data: {} };
    rows.push(row);
  }
  for (let i = 0; i < 16; i += 1) {
    if (i > 0) rows[i - 1].next = rows[i];
    if (i < 15) rows[i + 1].previous = rows[i];
  }
  return rows;
};

export default {
  name: 'Sheet',
  data() {
    return {
      players: [{ id: 1, name: 'toto' }, { id: 2, name: 'tata' }, { id: 3, name: 'titi' }, { id: 4, name: 'tutu' }],
      rows: initRows(),
      tablePointsArray: [0, 1, 2, 4],
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
        while (j < 16) {
          const row = this.rows[j];
          if (row.data.valid) total += row.data.points[player.id];
          else break;
          j += 1;
        }
        totals[player.id] = total;
      }
      return totals;
    },
  },
  computed: {
    totals() {
      return this.computeTotals();
    },
    tablePoints() {
      const totalsArray = [];
      const tablePoints = {};
      for (let i = 0; i < 4; i += 1) {
        const player = this.players[i];
        totalsArray.push({ playerId: player.id, total: this.totals[player.id] });
      }
      totalsArray.sort((p1, p2) => p1.total - p2.total);
      let i = 0;
      while (i < 4) {
        let j = i;
        while (j < 4 && totalsArray[j].total === totalsArray[i].total) {
          j += 1;
        }
        let sharedPoints = 0;
        for (let k = i; k < j; k += 1) sharedPoints += this.tablePointsArray[k];
        sharedPoints /= j - i;

        for (let k = i; k < j; k += 1) tablePoints[totalsArray[k].playerId] = sharedPoints;
        i = j;
      }
      return tablePoints;
    },
  },
  components: {
    // <my-component> ne sera disponible que dans le template parent
    'sheet-row': SheetRow,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.right {
  text-align: right;
}
.center {
  text-align: center;
}
</style>
