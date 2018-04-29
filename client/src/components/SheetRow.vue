<template>
  <tbody v-if="visible">
    <tr>
      <!-- Wind -->
      <th>
        <img :src="windURL"/>
      </th>
      <!-- Winner -->
      <th>
        <select class="uk-select" v-model="winnerId">
          <option value="-1">Please choose</option>
          <option v-for="player in players" :key="player.id" :value="player.id">
            {{ player.name }}
          </option>
        </select>
      </th>
      <!-- Picked on -->
      <th>
        <select class="uk-select" v-model="pickedOnId">
          <option value="-1">Please choose</option>
          <option v-for="player in players" :key="player.id" :value="player.id">
            {{ player.id == winnerId ? "Self pick" : player.name }}
          </option>
        </select>
      </th>
      <!-- Score -->
      <th><input class="uk-input" type="number" v-model.number="score"/></th>
      <!-- Player points -->
      <td v-for="player in players" :key="player.id">{{ rowdata.points[player.id] }}</td>
    </tr>
  </tbody>


</template>

<script>
export default {
  name: 'SheetRow',
  props: ['players', 'row'],
  data() {
    return {
      winnerId: -1,
      pickedOnId: -1,
      score: 0,
      rowW: this.row,
    };
  },
  // Watch changes to previous row
  watch: {
    'rowW.previous.data': {
      handler: function rowW() {
        this.compute();
      },
    },
  },
  methods: {
    compute() {
      const rowdata = { winnerId: this.winnerId,
        pickedOnId: this.pickedOnId,
        points: {},
        totalPoints: {},
        valid: (this.winnerId !== -1 && this.pickedOnId !== -1 && this.score > 0) };
      const selfPick = this.pickedOnId === this.winnerId;
      const points = rowdata.points;
      // Row points
      for (let i = 0; i < this.players.length; i += 1) {
        const player = this.players[i];
        const isWinner = player.id === this.winnerId;
        const isPickedOn = player.id === this.pickedOnId;
        if (this.winnerId === -1 || this.pickedOnId === -1) points[player.id] = 0;
        else if (selfPick) {
          if (isWinner) points[player.id] = (8 + this.score) * 3;
          else points[player.id] = -(8 + this.score);
        } else if (isWinner) points[player.id] = (8 + this.score) + (8 * 2);
        else if (isPickedOn) points[player.id] = -(8 + this.score);
        else points[player.id] = -8;
      }
      this.$emit('update:data', rowdata);
      return rowdata;
    },
  },
  computed: {
    rowdata() {
      return this.compute();
    },
    visible() {
      return this.row.previous === undefined || this.row.previous.data.valid;
    },
    windURL() {
      const file = { E: 'east.png', W: 'west.png', N: 'north.png', S: 'south.png' }[this.row.wind];
      return `../static/img/${file}`;
    },
  },
};
</script>
