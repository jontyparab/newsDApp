<template>
  <the-navigation-bar></the-navigation-bar>
  <router-view />
</template>

<script setup>
import { watchEffect } from 'vue';
import { useUserStore } from '@/stores/useUserStore';

const userStore = useUserStore();
watchEffect(() => {
  userStore.tryLogin();
});
</script>
