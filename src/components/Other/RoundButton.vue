<template>
  <button class="round__link" :style="btnStyles">
    <svg class="round__icon">
      <use :href="iconLink" :style="iconStyles"></use>
    </svg>
  </button>
</template>

<script>
import { computed } from "@vue/reactivity";
import SVG from "@/assets/images/sprite.svg";
export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default:true,
    },
    activeIcon: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 1,
    },
    color: {
      type: String,
      default: '#000000',
    },
  },
  setup(props) {
    const iconLink = computed(() => `${SVG}#${props.icon}`);
    const btnStyles = computed(() => {
      return {
        height: `${5 * props.size}rem`,
        width: `${5 * props.size}rem`,
      }
    });
    const iconStyles = computed(() => {
      return {
        fill : props.color,
      }
    });

    return {
      iconLink,
      iconStyles,
      btnStyles,
    };
  },
};
</script>
