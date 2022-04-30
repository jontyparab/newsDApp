<template>
  <component :is="tag" class="icon-button" :style="btnStyles">
    <svg class="icon-button__svg">
      <use :href="iconLink" :class="animation" :style="iconStyles"></use>
    </svg>
  </component>
</template>

<script setup>
import { computed } from 'vue';
import SVG from '@/assets/images/sprite.svg';
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: 'button',
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // activeIcon: {
  //   type: String,
  //   required: false
  // },
  size: {
    type: Number,
    default: 1,
  },
  color: {
    type: String,
    default: '#000000',
  },
  animation: {
    type: String,
    default: '',
    required: false,
  },
});
const iconLink = computed(() => `${SVG}#${props.icon}`);
const btnStyles = computed(() => {
  return {
    height: `${5 * props.size}rem`,
    width: `${5 * props.size}rem`,
  };
});
const iconStyles = computed(() => {
  return {
    fill: props.color,
  };
});
</script>
