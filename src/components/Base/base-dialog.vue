<template>
  <teleport to="body">
    <div class="dialog">
      <div class="dialog__backdrop"></div>
      <div class="dialog__box" v-bind="$attrs">
        <slot name="header"></slot>
        <slot>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat
          necessitatibus sapiente nobis laboriosam aut, placeat est assumenda
          fuga recusandae minima.
        </slot>
        <slot name="footer"></slot>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>
