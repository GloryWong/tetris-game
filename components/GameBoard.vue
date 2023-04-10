<template>
  <div class="flex flex-row justify-center p-5">
    <div ref="container"></div>
    <div class="flex h-full flex-col space-y-3 p-5">
      <div ref="nextShapeContainer"></div>
      <div class="flex flex-row space-x-2">
        <div>status:</div>
        <div>{{ status?.toUpperCase() }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AnimeStatus } from '~/classes/Anime';
import { Game } from '~/classes/Game';

const container = ref<HTMLElement>();
const nextShapeContainer = ref<HTMLElement>();
const status = ref<AnimeStatus>();

onMounted(() => {
  const game = new Game(container.value!, {
    nextShapeContainer: nextShapeContainer.value!,
  });
  window.__game__ = game;

  const board = game.board;
  status.value = board.status;
  board.onStatusChange((val) => {
    status.value = val;
  });

  document.addEventListener('keyup', (evt) => {
    switch (evt.key) {
      case 'ArrowUp':
        board.rotate();
        break;
      case 'ArrowDown':
        board.moveDown();
        break;
      case 'ArrowRight':
        board.moveRight();
        break;
      case 'ArrowLeft':
        board.moveLeft();
        break;
      case 'Enter':
        board.start();
        break;
      case ' ':
        board.toggle();
        break;
      case 'Spacebar':
        board.toggle();
        break;
    }
  });
});
</script>
