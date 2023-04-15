<template>
  <div class="flex flex-col items-center justify-center space-y-10">
    <div ref="container"></div>
    <div>
      <div class="text-gray-500">
        <kbd>Space</kbd> Start or Pause | <kbd>Arrow Up</kbd> Rotate |
        <kbd>Arrow Left</kbd> Move left | <kbd>Arrow Right</kbd> Move right |
        <kbd>Arrow Down</kbd> Soft drop
      </div>
    </div>
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

<style>
kbd {
  background-color: #333;
  border-radius: 3px;
  border: 1px solid #444;
  color: #789;
  display: inline-block;
  font-size: 0.85em;
  font-weight: 700;
  line-height: 1;
  padding: 2px 4px;
  white-space: nowrap;
}
</style>
