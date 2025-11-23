<script setup lang="ts">
import { store } from '@/core/store';
import { computed, ref } from 'vue'

const song = computed(() => store.song);
const showLink = ref(false);

</script>
<template>
  <div v-if="song && song.link && song.link.includes('youtube.com/embed/')">
    <button @click="showLink = !showLink">{{ showLink ? 'Ocultar video' : '▶️ Ver video' }}</button>
    <iframe v-if="showLink" width="100%" height="315" :src="song.link" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
    </iframe>
  </div>
</template>