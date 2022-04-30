<template>
  <teleport to="body">
    <div class="dialog">
      <div class="dialog__backdrop" @click="closeDialog"></div>
      <div class="dialog__box" v-bind="$attrs">
        <slot name="header"></slot>
        <slot>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat
          necessitatibus sapiente nobis laboriosam aut, placeat est assumenda
          fuga recusandae minima.
        </slot>
        <slot name="footer"></slot>
        <div v-if="showCloseBtn" class="dialog__close-btn">
          <icon-button
            icon="close-line"
            :size="0.8"
            @click="closeDialog"
          ></icon-button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>
<script setup>
import { toRefs } from 'vue';
const props = defineProps({
  showCloseBtn: {
    type: Boolean,
    default: true,
    required: false,
  },
});
const emits = defineEmits(['close-dialog']);
const { showCloseBtn } = toRefs(props);
const closeDialog = () => {
  emits('close-dialog');
};
</script>
