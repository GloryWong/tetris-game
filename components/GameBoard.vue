<template>
  <div class="flex flex-row justify-center p-5">
    <div ref="container"></div>
    <div class="flex h-full flex-col space-y-3 p-5">
      <div ref="queueContainer"></div>
      <div class="flex flex-col space-y-2">
        <div class="flex flex-row space-x-5">
          <div>Lines</div>
          <div>{{ lines }}</div>
        </div>
        <div class="flex flex-row space-x-5">
          <div>Score</div>
          <div>{{ score }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AnimeStatus } from '~/classes/Anime';
import { Game } from '~/classes/Game';

const container = ref<HTMLElement>();
const queueContainer = ref<HTMLElement>();
const status = ref<AnimeStatus>();
const score = ref<number>(0);
const lines = ref<number>(0);

let game: Game;

onMounted(() => {
  game = new Game(container.value!, {
    queueContainer: queueContainer.value!,
  });
  window.__game__ = game;

  status.value = game.status;
  game.onStatusChange((val) => {
    status.value = val;
  });

  score.value = game.score;
  game.onScoreChange((val) => {
    score.value = val;
  });

  lines.value = game.lines;
  game.onLinesChange((val) => {
    lines.value = val;
  });
});

onUnmounted(() => {
  game?.destroy();
});
</script>
