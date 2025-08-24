<script setup lang="ts">
import projectService from '@/core/services/project-service'
import { store } from '@/core/store'
import { computed, ref } from 'vue'


const hasProject = computed(() => !!store.project)
const index = computed(() => {
    if (!store.project || !store.song) return -1
    return store.projectHas(store.song.id)
})

const includeExcludeSong = () : void => {
    if (index.value >= 0) {
        store.project!.songs = store.project!.songs.filter(song => song.id !== store.song!.id)
    } else {
        store.project!.songs.push({ id: store.song!.id, transpose: store.transpose })
    }
    projectService.save(store.project!).catch(error => {
        console.error('Error saving project:', error)
    })
}

const moveIndex = (delta: number) : void => {
    if (!store.project || index.value < 0) return
    const newIndex = index.value + delta
    if (newIndex < 0 || newIndex >= store.project.songs.length) return

    const newSongId = store.project.songs[newIndex].id
    const song = store.songs.find(s => s.id === newSongId)
    if (song) {
        store.song = song
    }
}

</script>

<template>
    <div v-if="hasProject" class="song-control">
      <strong>{{ store.project?.title }}</strong>
      <br />
      <button @click.stop="moveIndex(-1)" :class="{ invisible: !hasProject || index <= 0 }">⏮️</button>
      <button @click.stop="moveIndex(1)" :class="{ invisible: !store.project || index < 0 || index >= store.project.songs.length -1 }">⏭️</button>
      <button @click.stop="includeExcludeSong">{{ index > -1 ? '✔️' : '➕' }}</button>
    </div>
</template>

<style>
.song-control {
  text-align: right;
}
</style>