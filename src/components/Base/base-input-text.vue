<template>
  <div class="input-text">
    <component
      :is="inputTypeMap[inputType].tag"
      :type="inputTypeMap[inputType].type"
      class="input-text__field"
      :class="{ 'input-text__field--filled': isFilled }"
      v-bind="$attrs"
      :style="fieldStyles"
      @input="inputChecker"
    >
    </component>
    <label
      v-if="label"
      :style="textStyles"
      :for="$attrs.id"
      class="input-text__label"
    >
      {{ label }}
    </label>
    <small v-if="helpText" class="input-text__error" :style="textStyles">
      {{ helpText }}
    </small>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
import { ref, toRefs, computed } from 'vue';
const props = defineProps({
  label: {
    type: String,
    required: false,
    default: '',
  },
  helpText: {
    type: String,
    required: false,
    default: '',
  },
  inputType: {
    type: String,
    required: false,
    default: 'text',
    validator: (value) => {
      return ['text', 'password', 'textarea'].includes(value);
    },
  },
  color: {
    type: String,
    required: false,
    default: 'var(--color-grey-dark-2)',
  },
});
const inputTypeMap = {
  text: {
    tag: 'input',
    type: 'text',
  },
  password: {
    tag: 'input',
    type: 'password',
  },
  textarea: {
    tag: 'textarea',
  },
};

const fieldStyles = computed(() => {
  return { borderColor: props.color };
});
const textStyles = computed(() => {
  return { color: props.color };
});

const { label } = toRefs(props);
let isFilled = ref(false);
const inputChecker = (e) => {
  e.target.value ? (isFilled.value = true) : (isFilled.value = false);
};
</script>
