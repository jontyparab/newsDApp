<template>
  <base-dialog class="menubar px-sm pt-xs pb-sm" @close-dialog="emitCloseMenu">
    <template #header>
      <div class="dialog-header mb-sm">
        <h2>Menu</h2>
      </div>
    </template>
    <menu class="menubar__main">
      <li
        v-for="item of filteredMenuList"
        :key="item.name"
        class="menubar__item p-xs"
      >
        <router-link
          class="menubar__link"
          :to="item.to"
          @click="executeCallback(item?.callback)"
        >
          <icon-button
            tag="span"
            :icon="item.icon"
            :color="item.color"
          ></icon-button>
          {{ item.name }}
        </router-link>
      </li>
    </menu>
  </base-dialog>
</template>

<script setup>
import { toRefs, computed } from 'vue';

const props = defineProps({
  options: {
    type: Object,
    default: function () {
      return {};
    },
    required: false,
  },
  itemList: {
    type: Array,
    required: true,
  },
});

const { itemList } = toRefs(props);
const emits = defineEmits(['close-menu']);

const filteredMenuList = computed(() => {
  return itemList.value.filter((item) => {
    console.log(!item.condition);
    return !item.condition;
  });
});

function executeCallback(fn) {
  if (fn instanceof Function) {
    fn();
  }
  emitCloseMenu();
}

function emitCloseMenu() {
  // seems hacky since we passing same emit as the base-dialog doing the same action;
  // not sure though
  emits('close-menu');
}
</script>
