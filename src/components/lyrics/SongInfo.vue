<script setup lang="ts">
import { store } from '@/core/store';
import { computed, ref } from 'vue';
import Tag from '../Tag.vue';
import SongControl from '../projects/SongControl.vue';
import projectService from '@/core/services/project-service';

const song = computed(() => store.song);

let originalNote = '';

const saveNote = () => {
  const item = store.project?.songs[store.projectIndex];
  if (!item) return;
  if (originalNote !== store.projectNote) {
    item.label = store.projectNote ?? '';
    projectService.save(store.project!).catch(error => {
      console.error('Error saving project:', error);
    });
  }
};

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
      <input type="text" class="note-input" v-model="store.projectNote"
        @focusin="originalNote = store.projectNote ?? ''" @focusout="saveNote()" />
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
.song-info .note-input {
  background: none;
  border: none;
  padding: 0;
  width: 100%;
  font-size: 1.5em;
  font-weight: bold;
  font-family: inherit;
  color: inherit;
}
.song-info .note-input:focus {
  background: initial;
  border: initial;
  padding: 6px 8px;
}
</style>