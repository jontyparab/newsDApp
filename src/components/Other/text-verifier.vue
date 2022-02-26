<template>
  <div class="text-verifier">
    <div
      v-if="fields.includes('valueField')"
      class="text-verifier__actual mb-sm"
    >
      <span class="text-verifier__value p-xs">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque aliquam
        iure totam, qui commodi obcaecati. Neque facilis maxime quibusdam harum
        amet? Dolor vitae unde at tempore molestiae quia dolores provident
        asperiores pariatur, suscipit consequuntur, laudantium necessitatibus
        repudiandae facilis, autem ducimus? Sequi id architecto aperiam animi
        unde dicta ex. Ea, esse!
      </span>
      <icon-button
        title="Copy"
        class="text-verifier__copy-btn"
        icon="content_copy"
        color="var(--color-grey-dark-2)"
        :size="0.9"
        @click="copyHash"
      ></icon-button>
    </div>
    <div
      v-if="fields.includes('verifyField')"
      class="text-verifier__entered mb-sm"
    >
      <base-input-text
        input-type="text"
        :help-text="fieldMsg"
        :color="currentState.color"
        title="Paste from clipboard"
        label="Enter Hash"
        @input="setCurrentState"
      ></base-input-text>
      <icon-button
        class="text-verifier__status"
        :icon="currentState.icon"
        :animation="currentState.animation"
        :color="currentState.color"
        :size="0.9"
      ></icon-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { toClipboard } from '@soerenmartius/vue3-clipboard';

const props = defineProps({
  trueValue: {
    type: String,
    required: true,
  },
  fields: {
    type: Array,
    required: false,
    default() {
      return ['valueField', 'verifyField'];
    },
  },
});

const verificationStates = {
  loading: {
    icon: 'refresh',
    animation: 'rotate',
    color: 'var(--color-grey-dark-2)',
  },
  success: {
    icon: 'verified',
    animation: 'scale',
    color: 'var(--color-success)',
  },
  error: {
    icon: 'error_outline',
    animation: 'scale',
    color: 'var(--color-danger)',
  },
};

let currentState = ref(verificationStates.loading);
let fieldMsg = ref('');
const setCurrentState = (e) => {
  const inputVal = e.target.value;
  const value = props.trueValue;
  if (inputVal !== '') {
    if (inputVal === value) {
      currentState.value = verificationStates.success;
      fieldMsg.value = 'HASH values matched.';
    } else if (inputVal !== value) {
      currentState.value = verificationStates.error;
      fieldMsg.value = 'HASH values did not match.';
    }
  } else {
    currentState.value = verificationStates.loading;
    fieldMsg.value = '';
  }
};

async function copyHash() {
  try {
    await toClipboard(props.trueValue);
  } catch (e) {
    console.error(e);
  }
}
</script>
