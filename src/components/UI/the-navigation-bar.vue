<template>
  <div class="">
    <button @click="toggleDarkMode">TOGGLE</button>
  </div>
</template>

<script setup>
import {
  enable as enableDarkMode,
  disable as disableDarkMode,
  auto as followSystemColorScheme,
  exportGeneratedCSS as collectCSS,
  isEnabled as isDarkReaderEnabled,
} from 'darkreader';

function toggleDarkMode() {
  isDarkReaderEnabled()
    ? disableDarkMode()
    : enableDarkMode({
        brightness: 95,
        contrast: 95,
      });
}
</script>
