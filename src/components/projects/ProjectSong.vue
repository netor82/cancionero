<script setup lang="ts">
import type { Project } from '@/core/interfaces/project';
import { computed } from 'vue';
import { store } from '@/core/store';
import ProjectService from '@/core/services/project-service';


const props = defineProps<{
    project: Project
    id: number
}>()

const song = computed(() => {
    return store.songs.find(s => s.id === props.id) || null
})

const projectService = new ProjectService()

const removeSong = () => {
    props.project.songs = props.project.songs.filter(s => s.id !== song.value!.id)

    projectService.save(props.project).catch(error => {
        console.error('Error saving project:', error)
    })
}

const selectSong = () => {
    store.song = song.value
}

</script>

<template>
    <li @click.stop="selectSong()">
        <button @click.stop="removeSong()">❌</button>
        {{ song?.title }}
    </li>
</template>