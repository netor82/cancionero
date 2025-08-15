<script setup lang="ts">
import ProjectService from '@/core/services/project-service'
import { store } from '@/core/store'
import { computed, toRaw } from 'vue'

const project = computed(() => store.project)
const added = computed(() => store.projectHas(store.song!.id))
const projectService = new ProjectService()

const includeExcludeSong = () : void => {
    if (added.value) {
        store.project!.songs = store.project!.songs.filter(song => song.id !== store.song!.id)
    } else {
        store.project!.songs.push({ id: store.song!.id, transpose: store.transpose })
    }
    projectService.save(store.project!).catch(error => {
        console.error('Error saving project:', error)
    })
}

</script>

<template>
    <div v-if="project">
      <strong>{{ project.title }}</strong>
      <button @click="includeExcludeSong">{{ added ? '✔️' : '➕' }}</button>
    </div>
</template>