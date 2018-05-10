<template>
  <tbody v-if="visible">
    <tr>
      <!-- Wind -->
      <th>
        <img :src="windURL"/>
      </th>
      <!-- Winner -->
      <th>
        <select class="uk-select" v-model="winnerIndex">
          <option value="-1">Please choose</option>
          <option v-for="player in players" :key="player.index" :value="player.index">
            {{ player.value.name }}
          </option>
        </select>
      </th>
      <!-- Picked on -->
      <th>
        <select class="uk-select" v-model="pickedOnIndex">
          <option value="-1">Please choose</option>
          <option v-for="player in players" :key="player.index" :value="player.index">
            {{ player.index == winnerIndex ? "Self pick" : player.value.name }}
          </option>
        </select>
      </th>
      <!-- Score -->
      <th><input class="uk-input points" type="number" v-model.number="score"/></th>
      <!-- Player points -->
      <td v-for="player in players" :key="player.index"  v-if="isValid"
        :class="{ 'uk-alert-success': isWinner(player), 'uk-alert-danger': isPickedOn(player) }">
        {{ rowdata.points[player.index] }}
      </td>
    </tr>
  </tbody>


</template>

<script>
export default {
  name: 'SheetRow',
  props: ['players', 'row', 'visible'],
  data() {
    return {
      winnerIndex: -1,
      pickedOnIndex: -1,
      score: 0,
      rowW: this.row,
    };
  },
  // Watch changes to previous row
  /*
  watch: {
    'rowW.previous.data': {
      handler: function rowW() {
        this.compute();
      },
    },
  }, */
  methods: {
    compute() {
      const rowdata = {
        wind: this.row.data.wind,
        winnerIndex: this.winnerIndex,
        pickedOnIndex: this.pickedOnIndex,
        points: {},
        totalPoints: {},
        valid: this.isValid };

      const selfPick = this.pickedOnIndex === this.winnerIndex;
      const points = rowdata.points;
      for (let i = 0; i < this.players.length; i += 1) {
        const player = this.players[i];
        const index = player.index;
        const isWinner = this.isWinner(player);
        const isPickedOn = this.isPickedOn(player);
        if (this.winnerId === -1 || this.pickedOnId === -1) points[index] = 0;
        else if (selfPick) {
          if (isWinner) points[index] = (8 + this.score) * 3;
          else points[index] = -(8 + this.score);
        } else if (isWinner) points[index] = (8 + this.score) + (8 * 2);
        else if (isPickedOn) points[index] = -(8 + this.score);
        else points[player.index] = -8;
      }
      this.$emit('update:data', rowdata);
      return rowdata;
    },
    isWinner(player) {
      return player.index === this.winnerIndex;
    },
    isPickedOn(player) {
      return player.index === this.pickedOnIndex && !this.isWinner(player);
    },
  },
  computed: {
    // Round is valid if winner, picked on and scores have been filled
    isValid() {
      return this.winnerIndex !== -1 && this.pickedOnIndex !== -1 && this.score > 0;
    },
    rowdata() {
      return this.compute();
    },
    windURL() {
      const file = { E: 'east.png', W: 'west.png', N: 'north.png', S: 'south.png' }[this.row.data.wind];
      return `../static/img/${file}`;
    },
  },
};
</script>
<style scoped>
.winner {
  background-color: #efe;
}
.pickedOn {
  background-color: #fee;
}
.points {
  width:60px;
}
</style>
