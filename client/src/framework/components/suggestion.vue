<template>
  <div>
          <input class="uk-input" type="text" v-model="query"
          v-on:input="queryUpdated($event.target.value)"
          v-on:focus="dropdown=true" v-on:blur="dropdownOff()"
          ref="input"/>
          <div :class="{ 'uk-dropdown':true, 'uk-open': (dropdown && suggestions.length>0) }"
            ref="dropdown">
                <div v-for="suggestion in suggestions" :key="suggestion.id"
                    v-on:click="notify(suggestion.value)">
                    {{ suggestion.display }}
                </div>
          </div>

  </div>
</template>

<script>

export default {
  name: 'Suggestion',
  props: { value: Object,
    suggestions: Array,
    minChars: { type: Number, default: 0 } },
  data() {
    return {
      query: '', dropdown: false,
    };
  },
  created() {
    this.queryUpdated(this.query);
  },
  methods: {
    notify(suggestion) {
      this.$emit('input', suggestion);
    },
    queryUpdated(query) {
      if (query.length >= this.minChars) {
        this.$emit('update:query', query);
      }
    },
    dropdownOff() {
      window.setTimeout(() => { this.dropdown = false; }, 250);
    },
    focus() {
      this.$nextTick(() => this.$refs.input.focus());
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
