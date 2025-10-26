<script setup lang="ts">
import { store } from '@/core/store';
import { computed } from 'vue'

const song = computed(() => store.song);

</script>
<template>
  <div v-if="song && song.link && song.link.includes('youtube.com/embed/')">
      <iframe width="100%" height="315" :src="song.link" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
      </iframe>
  </div>
</template>