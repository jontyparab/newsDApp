<template>
  <div class="input-text__wrapper">
    <input
      class="input-text__field"
      type="text"
      v-bind="$attrs"
      @input="inputChecker"
    />
    <label v-if="label" :for="$attrs.id" class="input-text__label">
      {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
import { defineProps, toRefs } from 'vue';
const props = defineProps({
  label: {
    type: String,
    default: '',
    required: false,
  },
});
const { label } = toRefs(props);
const inputChecker = (e) => {
  if (e.target.value) {
    e.target.classList.add('input-text__field--filled');
  } else {
    e.target.classList.remove('input-text__field--filled');
  }
};
</script>
