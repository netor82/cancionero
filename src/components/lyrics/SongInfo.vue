<script setup lang="ts">
import { store } from '@/core/store';
import { computed } from 'vue';
import Tag from '../Tag.vue';
import SongControl from '../projects/SongControl.vue';

const song = computed(() => store.song);



</script>

<template>
  <div class="song-info controls" v-if="song">
    <div>
      <h2>{{ song.title }}</h2>
      <Tag v-for="tag in song.tags" :key="tag" :id="tag" :tag="null" />
      <span>#{{ song.source }}</span>
    </div>
    <SongControl />
  </div>
</template>

<style scoped>
.song-info {
  border: 1px solid var(--color-border);
  padding: 1rem;
  border-radius: 0.5rem;
}
.song-info .tag {
  cursor: pointer;
}
</style>