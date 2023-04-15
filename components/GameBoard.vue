<template>
  <div class="flex flex-row justify-center p-5">
    <div ref="container"></div>
  </div>
</template>

<script setup lang="ts">
import { AnimeStatus } from '~/classes/Anime';
import { Tetris } from '~/classes/Tetris.js';

const container = ref<HTMLElement>();
const status = ref<AnimeStatus>();

let tetris: Tetris;

onMounted(() => {
  tetris = new Tetris(container.value!, { queueSize: 4 });
  window.__tetris__ = tetris;

  status.value = tetris.status;
  tetris.onStatusChange((val) => {
    status.value = val;
  });
});

onUnmounted(() => {
  tetris?.destroy();
});
</script>
