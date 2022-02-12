<template>
  <div class="inputtext__wrapper">
    <input
      :id="id"
      ref="inputEl"
      class="inputtext__field"
      :name="name"
      spellcheck="false"
      type="text"
      @blur="inputChecker"
    />
    <label :for="id" class="inputtext__label">{{ label }}</label>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
export default {
  props: ["label", "id", "name"],
  setup() {
    const inputEl = ref(null);
    const inputChecker = () => {
      if (inputEl.value.value) {
        inputEl.value.classList.add("inputtext__field--filled");
      } else {
        inputEl.value.classList.remove("inputtext__field--filled");
      }
    };
    return {
      inputChecker,
      inputEl,
    };
  },
};
</script>