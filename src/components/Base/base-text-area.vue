<template>
  <div class="text-area__wrapper">
    <textarea
      class="text-area__field"
      type="text"
      v-bind="$attrs"
      @input="inputChecker"
    />
    <label v-if="label" :for="$attrs.id" class="text-area__label">
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
const inputChecker = (event) => {
  if (event.target.value) {
    event.target.classList.add('text-area__field--filled');
  } else {
    event.target.classList.remove('text-area__field--filled');
  }
};
</script>
