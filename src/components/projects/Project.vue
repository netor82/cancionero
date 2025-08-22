<script setup lang="ts">
import type { Project } from '@/core/interfaces/project'
import { store } from './store'
import { store as gStore } from '@/core/store';
import ProjectSong from './ProjectSong.vue';
import projectService from '@/core/services/project-service';
import { ref } from 'vue';

const props = defineProps<{
    project: Project
}>()

const originalTitle = ref(props.project.title);

function saveTitle() {
    if (originalTitle.value !== props.project.title) {
        projectService.save(props.project);
    }
}

const confirmDelete = async () => {
    const confirmed = confirm('¿Seguro de eliminar este proyecto?');
    if (confirmed) {
        await projectService.delete(props.project).then(() => {
            store.projects = store.projects.filter(p => p.id !== props.project.id);
            gStore.project = null;
        });
    }
};

const cloneProject = async () => {
    await projectService.clone(props.project).then((created) => {
        store.projects.unshift(created);
        gStore.project = created;
    });
};


const swapSong = (indexA: number, indexB: number) => {
    const temp = props.project.songs[indexA];
    props.project.songs[indexA] = props.project.songs[indexB];
    props.project.songs[indexB] = temp;
    projectService.save(props.project).catch(error => {
        console.error('Error saving project:', error);
    });
};

</script>

<template>
    <div class="controls">
        <slot name="controls" />
        <div class="inline">
            <button @click="cloneProject">🈁Clonar</button>
            <button @click="confirmDelete">❌Borrar</button>
            <button @click="projectService.export(props.project)">⬇️Descargar</button>
        </div>
    </div>
    <div class="project">
        <input type="text" v-model="props.project.title" @focusin="originalTitle = props.project.title"
            @focusout="saveTitle()" />
        <p class="date">{{ store.dateFormat(props.project.date) }}</p>

        <ul>
            <ProjectSong v-for="(s, i) in props.project.songs" :key="s.id" :project="props.project" :id="s.id">
                <template #controls>
                    <button @click="swapSong(i, i - 1)" v-if="i > 0">⬆️</button>
                    <button @click="swapSong(i, i + 1)" :class="{ invisible: i >= props.project.songs.length - 1 }">⬇️</button>
                </template>
            </ProjectSong>
        </ul>
    </div>
</template>

<style scoped>
input {
    background: none;
    font-size: x-large;
    border: none;
    padding: 0;
    width: 100%;
}

input:focus {
    background: initial;
    border: initial;
    padding: 6px 8px;
}
</style>