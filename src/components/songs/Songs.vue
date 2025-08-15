<script setup lang="ts">
import { store } from '@/core/store';
import TagComponent from '@/components/Tag.vue';
import type { Tag } from '@/core/interfaces/tag';
import type { Song } from '@/core/interfaces/song';
import { Sections } from '@/core/enums/sections';
import { store as searchStore } from './store';
import TagSearch from './Tag-Search.vue';
import TextSearch from './Text-Search.vue';
import { computed } from 'vue';

const items = computed(() => {
  
  // by source
  if (searchStore.query.length && !isNaN(+searchStore.query)) {
    const source = parseInt(searchStore.query);
    return store.songs.filter(song => song.source === source);
  }
  
  return store.songs.filter(song => 
  // by tag
  (searchStore.tags.length === 0 || searchStore.tags.every(tag => song.tags.some(t => t === tag.id)))
  // by title
  && (searchStore.query.length === 0 || song.title.toLowerCase().includes(searchStore.query.toLowerCase()))
  )
  
})
  

function setSong (song: Song) {
  store.song = song;
  store.section.setActive(Sections.Lyrics);
};

function addTag(tag: Tag) {
  searchStore.addTag(tag);
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
          :callback="addTag" :class="{ active: searchStore.tags.some(t => t.id === tag) }" />
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>