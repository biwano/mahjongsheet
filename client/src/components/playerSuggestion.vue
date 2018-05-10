<template>
  <suggestion v-model="player" v-on:input="valueUpdated($event)"
    :suggestions="suggestions" v-on:update:query="queryUpdated($event)"
    ref="suggestion"
  ></suggestion>
</template>

<script>
import Player from '../services/player';

export default {
  name: 'PlayerSuggestion',
  props: ['value'],
  data() {
    return { suggestions: [],
      player: undefined,
    };
  },
  created() {
    this.player = this.value;
  },
  methods: {
    queryUpdated(query) {
      this.$emit('update:query', query);
      Player.find(query).then((response) => {
        this.suggestions = [];
        for (let i = 0; i < response.data.length; i += 1) {
          const player = response.data[i];
          this.suggestions.push({ id: player._id,
            display: player.name,
            value: player,
          });
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    valueUpdated(player) {
      this.$emit('input', player);
    },
    focus() {
      this.$refs.suggestion.focus();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
