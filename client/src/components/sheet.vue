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
    <!-- Rounds -->
    <sheet-round v-for="round in rounds" :key="round.index" v-if="round !== undefined" :visible="ready"
      :players="players" :data="round.data" v-on:update:data="roundDataUpdated(round, $event)"
      :rules="rules">
    </sheet-round>
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
import SheetRound from '@/components/sheetRound';
import SheetPlayerChooser from '@/components/sheetPlayerChooser';
import mcrRules from '@/business/mcrRules';
import '@/assets/east.png';
import '@/assets/west.png';
import '@/assets/north.png';
import '@/assets/south.png';

export default {
  name: 'Sheet',
  data() {
    return {
      // Players
      players: [{ index: 0, value: { _id: 1, name: 'toto' } },
        { index: 1, value: { _id: 2, name: 'tata' } },
        { index: 2, value: { _id: 3, name: 'titi' } },
        { index: 3, value: { _id: 4, name: 'tutu' } }],
      // Rounds
      rounds: [mcrRules.nextRound()],
      // Table point distribution
      rules: mcrRules,
    };
  },
  created() {
  },
  methods: {
    // A round is updated, a new round is created if this one is valid
    roundDataUpdated(round_, $event) {
      const round = round_;
      round.data = $event;
      if (round.next === undefined && this.rules.isValid(round.data)) {
        round.next = this.rules.nextRound(round);
        if (round.next !== undefined) {
          this.rounds.push(round.next);
        }
      }
    },
  },
  computed: {
    totals() {
      return this.rules.totals(this.players, this.rounds);
    },
    tablePoints() {
      return this.rules.tablePoints(this.players, this.rounds);
    },
    // sheet ready if all players are filled
    ready() {
      let ready = true;
      for (let i = 0; i < this.players.length; i += 1) {
        if (this.players[i].value === undefined) ready = false;
      }
      return ready;
    },
    finished() {
      return this.rules.isFinished(this.rounds);
    },
  },
  components: {
    'sheet-round': SheetRound,
    'sheet-player-chooser': SheetPlayerChooser,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
