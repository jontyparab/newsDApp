<template>
  <div class="text-verifier">
    <div
      v-if="fields.includes('valueField')"
      class="text-verifier__actual mb-sm"
    >
      <span class="text-verifier__value p-xs">
        {{ finalTrueVal }}
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
        :value="finalTrueVal"
        help="Enter hash to verify"
        placeholder="Enter hash"
        outer-class="text-verifier__input-wrapper"
        help-class="mt-xs"
        :validation="[['required'], ['is', finalTrueVal]]"
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
                'text-success': node.value === finalTrueVal,
              }"
            >
              <template v-if="node.value === finalTrueVal">
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
import { ref, computed } from 'vue';
import { useClipboard } from '@vueuse/core';

const props = defineProps({
  trueValue: {
    type: [Number, String],
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

let currentState = ref(verificationStates.success);
const setCurrentState = (inputVal) => {
  if (inputVal === finalTrueVal.value) {
    currentState.value = verificationStates.success;
  } else {
    currentState.value = verificationStates.error;
  }
};

const finalTrueVal = computed(() => {
  return props.trueValue.toString();
});

const { copy } = useClipboard();
async function copyHash() {
  try {
    copy(finalTrueVal.value);
  } catch (e) {
    console.error(e);
  }
}
</script>
