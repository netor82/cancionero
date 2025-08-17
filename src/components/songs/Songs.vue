<script setup lang="ts">
import { store as gStore } from '@/core/store';
import TagComponent from '@/components/Tag.vue';
import type { Tag } from '@/core/interfaces/tag';
import type { Song } from '@/core/interfaces/song';
import { Sections } from '@/core/enums/sections';
import { store } from './store';
import TagSearch from './Tag-Search.vue';
import TextSearch from './Text-Search.vue';
import { computed } from 'vue';

const items = computed(() => {
  
  // by source
  if (store.query.length && !isNaN(+store.query)) {
    const source = parseInt(store.query);
    return gStore.songs.filter(song => song.source === source);
  }
  
  return gStore.songs.filter(song => 
  // by tag
  (store.tags.length === 0 || store.tags.every(tag => song.tags.some(t => t === tag.id)))
  // by title
  && (store.query.length === 0 || song.title.toLowerCase().includes(store.query.toLowerCase()))
  )
  
})

function setSong (song: Song) {
  gStore.song = song;
  gStore.section.setActive(Sections.Lyrics);
};

function addTag(tag: Tag) {
  store.addTag(tag);
}

</script>


<template>
  <div class="songs">
    <TextSearch />&nbsp;
    <TagSearch />
    <ul>
      <li v-for="song in items" :key="song.id" @click="setSong(song)">
        <span>{{ song.title }}</span> - 
        <TagComponent v-for="tag in song.tags" :id="tag" :tag="null" class="tag" 
          :callback="addTag" :class="{ active: store.tags.some(t => t.id === tag) }" />
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>