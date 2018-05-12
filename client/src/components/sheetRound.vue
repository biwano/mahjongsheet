<template>
  <tbody v-if="visible">
    <tr>
      <!-- Wind -->
      <th>
        <img :src="windURL"/>
      </th>
      <!-- Winner -->
      <th>
        <select class="uk-select" v-model.number="winnerIndex">
          <option value="-1">Please choose</option>
          <option v-for="player in players" :key="player.index" :value="player.index">
            {{ player.value.name }}
          </option>
        </select>
      </th>
      <!-- Picked on -->
      <th>
        <select class="uk-select" v-model.number="pickedOnIndex">
          <option value="-1">Please choose</option>
          <option v-for="player in players" :key="player.index" :value="player.index">
            {{ player.index == winnerIndex ? "Self pick" : player.value.name }}
          </option>
        </select>
      </th>
      <!-- Score -->
      <th><input class="uk-input points" type="number" v-model.number="score"/></th>
      <!-- Player points -->
      <td v-for="player in players" :key="player.index"  v-if="rules.isValid(newData)"
        :class="{ 'uk-alert-success': rules.isWinner(newData, player.index),
        'uk-alert-danger': rules.isPickedOn(newData, player.index) }">
        {{ newData.points[player.index] }}
      </td>
    </tr>
  </tbody>


</template>

<script>
export default {
  name: 'SheetRound',
  props: ['players', 'data', 'visible', 'rules'],
  data() {
    return {
      winnerIndex: this.data.winnerIndex,
      pickedOnIndex: this.data.pickedOnIndex,
      score: this.data.score,
      wind: this.data.wind,
    };
  },
  created() {
  },
  methods: {
    compute() {
      const newData = {
        wind: this.wind,
        winnerIndex: this.winnerIndex,
        pickedOnIndex: this.pickedOnIndex,
        score: this.score,
        points: {},
        totalPoints: {},
      };
      newData.valid = this.rules.isValid(newData);

      for (let i = 0; i < this.players.length; i += 1) {
        const index = this.players[i].index;
        newData.points[index] = this.rules.playerRoundPoints(newData, index);
      }
      this.$emit('update:data', newData);
      return newData;
    },
  },
  computed: {
    newData() {
      return this.compute();
    },
    windURL() {
      const file = { E: 'east.png', W: 'west.png', N: 'north.png', S: 'south.png' }[this.data.wind];
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
