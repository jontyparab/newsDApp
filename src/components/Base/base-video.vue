<template>
  <video ref="videoPlayer" class="video-js"></video>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import videojs from 'video.js';

const props = defineProps({
  options: {
    type: Object,
    default() {
      return {};
    },
  },
});
let player = ref(null);
let videoPlayer = ref(null);
onMounted(() => {
  player.value = videojs(
    videoPlayer.value,
    props.options,
    function onPlayerReady() {
      console.log('onPlayerReady', this);
    }
  );
});
onBeforeUnmount(() => {
  if (player.value) {
    player.value.dispose();
  }
});
</script>
