<template>
  <the-navigation-bar></the-navigation-bar>
  <router-view />
</template>

<script setup>
import { watchEffect, watch } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import { useNewsStore } from '@/stores/useNewsStore';

const userStore = useUserStore();
const newsStore = useNewsStore();
userStore.tryLogin();

watchEffect(() => {
  newsStore.fetchNewsList('all');
});
</script>
