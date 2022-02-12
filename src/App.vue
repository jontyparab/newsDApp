<template>
  <navigation-bar></navigation-bar>
  <router-view />
</template>

<script>
import NavigationBar from "./components/UI/NavigationBar.vue";
export default {
  components: {
    NavigationBar,
  },
  setup() {},
};
</script>