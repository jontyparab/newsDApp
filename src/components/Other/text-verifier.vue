<template>
  <div class="text-verifier">
    <div
      v-if="fields.includes('valueField')"
      class="text-verifier__actual mb-sm"
    >
      <span class="text-verifier__value p-xs">
        {{ trueValue }}
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
    <div v-if="fields.includes('verifyField')" class="text-verifier__entered">
      <FormKit
        type="text"
        name="hash_check"
        help="Enter hash to verify"
        placeholder="Enter hash"
        outer-class="text-verifier__input-wrapper"
        help-class="mt-xs"
        :validation="[['required'], ['is', trueValue]]"
        validation-visibility="live"
        @input="setCurrentState"
      >
        <template #messages="{ node }">
          <ul
            v-if="node.value !== ''"
            class="formkit-messages"
            aria-live="polite"
          >
            <li
              :class="{
                'formkit-message': true,
                'text-success': node.value === trueValue,
              }"
            >
              <template v-if="node.value === trueValue">
                HASH values matched.
              </template>
              <template v-else> HASH values did not match. </template>
            </li>
          </ul>
        </template>
      </FormKit>
      <icon-button
        class="text-verifier__status"
        :icon="currentState.icon"
        :animation="currentState.animation"
        title="Paste from clipboard"
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
  success: {
    icon: 'verified',
    animation: 'scale',
    color: 'var(--color-success)',
  },
  error: {
    icon: 'error_outline',
    animation: '',
    color: 'var(--color-danger)',
  },
};

let currentState = ref(verificationStates.error);
const setCurrentState = (inputVal) => {
  const value = props.trueValue;
  if (inputVal === value) {
    currentState.value = verificationStates.success;
  } else {
    currentState.value = verificationStates.error;
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
