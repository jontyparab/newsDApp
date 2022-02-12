<template>
  <div class="textarea__wrapper">
    <textarea
      :id="id"
      ref="textareaEl"
      class="textarea__field"
      :name="name"
      spellcheck="false"
      type="text"
      @blur="inputChecker"
    />
    <label :for="id" class="textarea__label">{{ label }}</label>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
export default {
  props: ["label", "id", "name"],
  setup() {
    const textareaEl = ref(null);
    const inputChecker = () => {
      if (textareaEl.value.value) {
        textareaEl.value.classList.add("textarea__field--filled");
      } else {
        textareaEl.value.classList.remove("textarea__field--filled");
      }
    };
    return {
      inputChecker,
      textareaEl,
    };
  },
};
</script>