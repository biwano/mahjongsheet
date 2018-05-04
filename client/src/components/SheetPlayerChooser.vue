<template>

  <div>
    <div v-if="mode==='new'">
        <div class="uk-grid-small" uk-grid>
          <div class="uk-width-2-3">
              <input v-if="value.id === undefined" class="uk-input" type="text"
                  v-model="newPlayer.name" placeholder="Register a player"/>
          </div>
          <div class="uk-width-1-3">
              <a v-if="newPlayer.name !==''"
                  class="uk-form-icon-flip"
                  uk-icon="icon: check; ratio: 0.5"
                  v-on:click="createPlayer(newPlayer.name)"></a><br/>
              <a class="uk-form-icon-flip"
                  uk-icon="icon: close; ratio: 0.5"
                  v-on:click="mode='choose'"></a>
          </div>
        </div>
    </div>
    <div v-if="mode==='choose'" class="uk-inline">
        <span class="uk-form-icon" href="" uk-icon="icon: user"></span>
        <input v-if="value.id === undefined" class="uk-input" type="text"
    :value="newPlayer.name" placeholder="Register a player"/>
    </div>
  </div>
</template>

<script>
import player from '../services/player';

export default {
  name: 'SheetPlayerChooser',
  props: ['value'],
  data() {
    return { newPlayer: { name: '' },
      mode: 'new',
    };
  },
  created() {
  },
  methods: {
    createPlayer(name) {
      player.create(name).then((response) => {
        this.$emit('update:value', response.data);
      }).catch((error) => {
        console.log(error);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
