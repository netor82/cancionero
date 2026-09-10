<script setup lang="ts">
import { store } from '@/core/store';
import { computed, ref } from 'vue';
import Tag from '../Tag.vue';
import SongControl from '../projects/SongControl.vue';

const song = computed(() => store.song);

const songControl = ref<InstanceType<typeof SongControl> | null>(null);

const SWIPE_THRESHOLD = 50;
let touchStartX = 0;
let touchStartY = 0;

const onTouchStart = (e: TouchEvent) => {
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
};

const onTouchEnd = (e: TouchEvent) => {
  const deltaX = e.changedTouches[0].clientX - touchStartX;
  const deltaY = e.changedTouches[0].clientY - touchStartY;

  if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
    songControl.value?.moveIndex(deltaX < 0 ? 1 : -1);
  }
};

</script>

<template>
  <div class="song-info controls" v-if="song || store.projectNote" @touchstart="onTouchStart" @touchend="onTouchEnd">
    <div v-if="song">
      <h2>{{ song.title }}</h2>
      <Tag v-for="tag in song.tags" :key="tag" :id="tag" :tag="null" />
      <span>#{{ song.source }}</span>
      <span v-if="song.author"> - {{ song.author }}</span>
    </div>
    <div v-else>
      <h2>{{ store.projectNote }}</h2>
    </div>
    <SongControl ref="songControl" />
  </div>
  <p v-if="song && song.comments" :innerHTML="song.comments"></p>
</template>

<style>
.song-info {
  border: 1px solid var(--color-border);
  padding: 1rem;
  border-radius: 0.5rem;
}
.song-info .tag {
  cursor: pointer;
}
</style>