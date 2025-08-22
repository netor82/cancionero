<script setup lang="ts">
import type { Project } from '@/core/interfaces/project';
import { computed } from 'vue';
import { store as gStore } from '@/core/store';
import projectService from '@/core/services/project-service';
import { Sections } from '@/core/enums/sections';


const props = defineProps<{
    project: Project
    id: number
}>()

const song = computed(() => {
    return gStore.songs.find(s => s.id === props.id) || null
})

const removeSong = () => {
    props.project.songs = props.project.songs.filter(s => s.id !== song.value!.id)

    projectService.save(props.project).catch(error => {
        console.error('Error saving project:', error)
    })
}

const selectSong = () => {
    gStore.song = song.value
    gStore.section.setActive(Sections.Lyrics);
}

</script>

<template>
    <li @click.stop="selectSong()" class="controls">
        <div>
            <button @click.stop="removeSong()">❌</button>
            {{ song?.title }}
        </div>
        <div>
            <slot name="controls" />
        </div>
    </li>
</template>