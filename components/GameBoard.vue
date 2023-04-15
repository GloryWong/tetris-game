<template>
  <div class="flex flex-row justify-center p-5">
    <div ref="container"></div>
  </div>
</template>

<script setup lang="ts">
import { AnimeStatus } from '~/classes/Anime';
import { Game } from '~/classes/Game';

const container = ref<HTMLElement>();
const status = ref<AnimeStatus>();

let game: Game;

onMounted(() => {
  game = new Game(container.value!, { queueSize: 4 });
  window.__game__ = game;

  status.value = game.status;
  game.onStatusChange((val) => {
    status.value = val;
  });
});

onUnmounted(() => {
  game?.destroy();
});
</script>
