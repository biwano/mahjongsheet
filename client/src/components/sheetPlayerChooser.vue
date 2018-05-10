<template>

  <div>
    <!-- edit mode -->
    <div :hidden="mode!=='edit'" class="uk-grid-collapse" uk-grid>
        <div class="uk-width-2-3">
          <player-suggestion v-model="player"
            v-on:input="playerUpdated($event)"
            v-on:update:query="queryUpdated($event)"
            ref="suggestion">
          </player-suggestion>
        </div>
        <div class="uk-width-1-3">
            <a v-if="query !==''"
                class="uk-form-icon-flip"
                uk-icon="icon: check; ratio: 1"
                v-on:click="createPlayer(query)"></a><br/>
        </div>
    </div>
    <!-- Read Mode -->
    <div :hidden="mode!=='read'" class="uk-grid-collapse" uk-grid>
        <div class="uk-width-2-3">
          {{ player.name }}
        </div>
        <div class="uk-width-1-3">
            <a  class="uk-icon-flip"
                uk-icon="icon: pencil"
                v-on:click="editMode()"></a><br/>
        </div>
    </div>
  </div>
</template>

<script>
import Player from '../services/player';
import PlayerSuggestion from './playerSuggestion';

export default {
  name: 'SheetPlayerChooser',
  props: ['value'],
  data() {
    return { query: '',
      player: undefined,
      mode: undefined,
    };
  },
  created() {
    this.player = this.value;
    if (this.player === undefined) {
      this.editMode();
    } else this.mode = 'read';
  },
  methods: {
    playerUpdated(player) {
      this.player = player;
      this.$emit('input', this.player);
      if (this.player !== undefined) this.mode = 'read';
    },
    editMode() {
      this.mode = 'edit';
      this.$refs.suggestion.focus();
    },
    queryUpdated(query) {
      this.query = query;
    },
    createPlayer(name) {
      Player.create(name).then((response) => {
        const data = response.data;
        if (data.status === 'ko' && data.message === 'player_exists') {
          this.playerUpdated(data.payload);
        } else this.playerUpdated(data);
      }).catch((error) => {
        console.log(error);
      });
    },
  },
  components: { 'player-suggestion': PlayerSuggestion },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
